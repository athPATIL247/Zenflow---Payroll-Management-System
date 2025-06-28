const db = require("../connect");

const handleAddEmployee = async (req, res) => {
    const { name, department_id, position, date_joined, password, role } = req.body;
    try {
        const query = `INSERT INTO employees (name, department_id, position, date_joined) VALUES (?,?,?,?)`;
        const [newRow] = await db.query(query, [name, Number(department_id), position, date_joined]);
        const newID = newRow.insertId;
        const query2 = `INSERT INTO users (employee_id, password, role) values (?,?,?)`;
        await db.query(query2, [Number(newID), password, role]);
        return res.status(201).json({ status: "success", message: `New employee added with EID ${newID}` });
    } catch (error) {
        console.log(error);
        return res.status(402).json({ status: "error", message: "Failed to add employee" });
    }
}

const handleDeleteEmployee = async (req, res) => {
    const { employeeId } = req.params;
    try {
        // First delete from users table (due to foreign key constraint)
        await db.query(`DELETE FROM users WHERE employee_id = ?`, [Number(employeeId)]);
        // Then delete from employees table
        await db.query(`DELETE FROM employees WHERE id = ?`, [Number(employeeId)]);
        return res.status(200).json({ status: "success", message: `Employee with ID ${employeeId} deleted successfully` });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "error", message: "Failed to delete employee" });
    }
}

const handleListEmployees = async (req, res) => {
    try {
        const query = `SELECT e.id, e.name, e.department_id, d.name AS department_name, e.position, e.date_joined, e.status FROM employees e JOIN departments d ON d.id = e.department_id ORDER BY e.id;`;
        const rows = await db.query(query);
        console.log(rows);
        return res.status(200).json({ status: "success", "employeeList": rows[0] });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "error", message: "Failed to fetch employees list" });
    }
}

const getDeptCountInfo = async (req, res) => {
    try {
        const idToCount = await db.query(`SELECT e.department_id, d.name AS department_name, COUNT(*) AS count FROM employees e JOIN departments d ON e.department_id = d.id GROUP BY e.department_id`);
        return res.status(200).json({ status: "success", "deptIdToCount": idToCount[0] });
    } catch (error) {
        console.log(error);
    }
}

const getPplInDept = async (req, res) => {
    const deptID = req.query.deptID;
    try {
        const query = `SELECT * FROM employees WHERE department_id = ? ORDER BY id`;
        const rows = await db.query(query, [Number(deptID)]);
        return res.status(200).json({ status: "success", "pplInfo": rows[0] });
    } catch (error) {
        console.log(error);
    }
}

const handlePayrollSummary = async (req, res) => {
    const { month, year } = req.query;
    try {
        const query = `SELECT SUM(base_salary) AS totalSalaryPayout, SUM(income_tax) AS totalIncomeTax, SUM(PF) as totalPF, SUM(LWP) AS totalLWP, SUM(totalDeduction) AS totalDeductions FROM payroll GROUP BY payroll_month, payroll_year HAVING payroll_month = ? AND payroll_year = ?`;
        const rows = await db.query(query, [Number(month), Number(year)]);
        return res.status(200).json({ status: "success", payrollSummary: rows[0] });
    } catch (error) {
        console.log(error);
    }
}

module.exports = { handleAddEmployee, handleDeleteEmployee, handleListEmployees, getDeptCountInfo, getPplInDept, handlePayrollSummary };

//
// INSERT INTO users (password, role) VALUES (?,?)