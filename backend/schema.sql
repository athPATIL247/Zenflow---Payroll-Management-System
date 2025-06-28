-- =======================================
-- Payroll Management System Schema
-- =======================================

-- Departments Table
CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Employees Table
CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    department_id INT NOT NULL,
    position VARCHAR(100) NOT NULL,
    date_joined DATE NOT NULL,
    status ENUM('active', 'inactive', 'terminated') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
);

-- Users Table (Authentication)
CREATE TABLE users (
    employee_id INT PRIMARY KEY,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'employee') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- Bank Details Table
CREATE TABLE bankdetails (
    employee_id INT PRIMARY KEY,
    bank_name VARCHAR(100) NOT NULL,
    account_number VARCHAR(20) NOT NULL UNIQUE,
    ifsc_code VARCHAR(20) NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- Attendance Table
CREATE TABLE attendance (
    employee_id INT NOT NULL,
    date DATE NOT NULL,
    status ENUM('Present', 'Absent', 'Leave', 'Half-Day') NOT NULL,
    leave_type VARCHAR(50),
    work_hours INT DEFAULT 8,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (employee_id, date),
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- Payroll Table
CREATE TABLE payroll (
    employee_id INT NOT NULL,
    base_salary DECIMAL(10,2) NOT NULL,
    income_tax DECIMAL(10,2),
    PF DECIMAL(10,2),
    LWP DECIMAL(10,2),
    totalDeduction DECIMAL(10,2),
    net_salary DECIMAL(10,2),
    payroll_month INT NOT NULL CHECK (payroll_month BETWEEN 1 AND 12),
    payroll_year INT NOT NULL CHECK (payroll_year BETWEEN 2000 AND 2100),
    payment_status ENUM('pending', 'paid') DEFAULT 'pending',
    payment_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (employee_id, payroll_month, payroll_year),
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- Audit Log Table
CREATE TABLE attendance_log (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT,
    date DATE,
    action ENUM('insert', 'update', 'delete'),
    log_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =======================================
-- TRIGGERS
-- =======================================

DELIMITER //

-- Trigger: Compute salary components before inserting payroll
CREATE TRIGGER before_insert_payroll
BEFORE INSERT ON payroll
FOR EACH ROW
BEGIN
    DECLARE total_days INT;
    DECLARE working_days INT;
    DECLARE absent_days INT;
    DECLARE is_leap_year BOOLEAN;

    -- Determine days in month
    SET is_leap_year = (NEW.payroll_year % 4 = 0 AND NEW.payroll_year % 100 <> 0) OR (NEW.payroll_year % 400 = 0);

    SET total_days = CASE
        WHEN NEW.payroll_month IN (1, 3, 5, 7, 8, 10, 12) THEN 31
        WHEN NEW.payroll_month IN (4, 6, 9, 11) THEN 30
        WHEN NEW.payroll_month = 2 AND is_leap_year THEN 29
        ELSE 28
    END;

    -- Count working days
    SELECT COUNT(*) INTO working_days
    FROM attendance
    WHERE employee_id = NEW.employee_id
      AND MONTH(date) = NEW.payroll_month
      AND YEAR(date) = NEW.payroll_year
      AND status = 'Present';

    SET absent_days = total_days - working_days;

    -- Compute LWP
    SET NEW.LWP = absent_days * (NEW.base_salary / total_days);

    -- Compute income tax
    IF NEW.base_salary <= 33000 THEN
        SET NEW.income_tax = 0;
    ELSEIF NEW.base_salary <= 66000 THEN
        SET NEW.income_tax = NEW.base_salary * 0.05;
    ELSEIF NEW.base_salary <= 100000 THEN
        SET NEW.income_tax = NEW.base_salary * 0.10;
    ELSEIF NEW.base_salary <= 133000 THEN
        SET NEW.income_tax = NEW.base_salary * 0.15;
    ELSEIF NEW.base_salary <= 166000 THEN
        SET NEW.income_tax = NEW.base_salary * 0.20;
    ELSEIF NEW.base_salary <= 200000 THEN
        SET NEW.income_tax = NEW.base_salary * 0.25;
    ELSE
        SET NEW.income_tax = NEW.base_salary * 0.30;
    END IF;

    -- Compute PF
    SET NEW.PF = NEW.base_salary * 0.12;

    -- Total deductions
    SET NEW.totalDeduction = NEW.income_tax + NEW.PF + NEW.LWP;

    -- Net Salary
    SET NEW.net_salary = NEW.base_salary - NEW.totalDeduction;
END;
//

-- Trigger: Attendance insert log
CREATE TRIGGER log_attendance_insert
AFTER INSERT ON attendance
FOR EACH ROW
BEGIN
    INSERT INTO attendance_log (employee_id, date, action)
    VALUES (NEW.employee_id, NEW.date, 'insert');
END;
//

-- Trigger: Attendance update log
CREATE TRIGGER log_attendance_update
AFTER UPDATE ON attendance
FOR EACH ROW
BEGIN
    INSERT INTO attendance_log (employee_id, date, action)
    VALUES (NEW.employee_id, NEW.date, 'update');
END;
//

-- Trigger: Attendance delete log
CREATE TRIGGER log_attendance_delete
AFTER DELETE ON attendance
FOR EACH ROW
BEGIN
    INSERT INTO attendance_log (employee_id, date, action)
    VALUES (OLD.employee_id, OLD.date, 'delete');
END;
//

DELIMITER ;

-- =======================================
-- END OF SCHEMA
-- =======================================
