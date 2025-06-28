const mysql = require('mysql2/promise');
const { faker } = require('@faker-js/faker');

// MySQL config — change if needed
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'atharva@2005', // change this
    database: 'zenflow3', // use your actual DB name
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function seed() {
    // 🔥 Clear all tables safely
    await pool.query('SET FOREIGN_KEY_CHECKS = 0');
    await pool.query('TRUNCATE TABLE payroll');
    await pool.query('TRUNCATE TABLE attendance');
    await pool.query('TRUNCATE TABLE bankdetails');
    await pool.query('TRUNCATE TABLE users');
    await pool.query('TRUNCATE TABLE employees');
    await pool.query('TRUNCATE TABLE departments');
    await pool.query('SET FOREIGN_KEY_CHECKS = 1');
    
    const departments = ['Engineering', 'HR', 'Finance', 'Sales', 'Marketing'];

    // 1. Departments
    for (const name of departments) {
        await pool.query(`INSERT IGNORE INTO departments (name) VALUES (?)`, [name]);
    }

    // 2. Employees, Users, Bank Details, Attendance, Payroll
    for (let i = 0; i < 200; i++) {
        const name = faker.person.fullName();
        const deptId = faker.number.int({ min: 1, max: departments.length });
        const position = faker.person.jobTitle();
        const joinDate = faker.date.past({ years: 3 });

        const [empRes] = await pool.query(
            `INSERT INTO employees (name, department_id, position, date_joined) VALUES (?, ?, ?, ?)`,
            [name, deptId, position, joinDate.toISOString().slice(0, 10)]
        );

        const empId = empRes.insertId;

        // 3. Users
        const password = faker.internet.password(12);
        await pool.query(
            `INSERT INTO users (employee_id, password, role) VALUES (?, ?, 'employee')`,
            [empId, password]
        );

        // 4. Bank Details
        await pool.query(
            `INSERT INTO bankdetails (employee_id, bank_name, account_number, ifsc_code) VALUES (?, ?, ?, ?)`,
            [
                empId,
                faker.company.name(), // ✅ Corrected
                faker.finance.accountNumber(),
                'IFSC' + faker.string.alphanumeric(6).toUpperCase()
            ]
        );


        // 5. Attendance for June 2025
        for (let day = 1; day <= 28; day++) {
            const date = `2025-06-${String(day).padStart(2, '0')}`;
            const status = faker.helpers.arrayElement(['Present', 'Absent', 'Leave']);
            await pool.query(
                `INSERT INTO attendance (employee_id, date, status) VALUES (?, ?, ?)`,
                [empId, date, status]
            );
        }

        // 6. Payroll (auto-handled via triggers)
        const baseSalary = faker.number.int({ min: 30000, max: 150000 });
        await pool.query(
            `INSERT INTO payroll (employee_id, base_salary, payroll_month, payroll_year) VALUES (?, ?, 6, 2025)`,
            [empId, baseSalary]
        );
    }

    console.log(`✅ Seeding completed with 200 employees.`);
    process.exit();
}

seed().catch((err) => {
    console.error(`❌ Error while seeding:`, err);
    process.exit(1);
});
