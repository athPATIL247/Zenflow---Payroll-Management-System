const db = require("../connect");
const jwt = require('jsonwebtoken');

const decodeToken = (token) => {
    const decoded = jwt.decode(token);
    return decoded;
}

const handleGetMonthlyAttendance = async (req, res) => {
    const token = decodeToken(req.cookies.token);
    const { month, year } = req.body;
    const employee_id = token.employee_id;
    try {
        const daysInMonth = new Date(year, month, 0).getDate();

        let workingDaysInMonth = 0;
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month - 1, day);
            const dayOfWeek = date.getDay(); // 0 is Sunday, 6 is Saturday
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                workingDaysInMonth++;
            }
        }

        const query = `SELECT COUNT(CASE WHEN status = 'Present' THEN 1 END) as presentDays, COUNT(CASE WHEN status = 'Absent' THEN 1 END) as absentDays, COUNT(CASE WHEN status = 'Leave' THEN 1 END) as leaveDays, SUM(work_hours) as totalWorkHours FROM attendance WHERE employee_id = ? AND MONTH(date) = ? AND YEAR(date) = ?`;

        const results = await db.query(query, [employee_id, month, year]);
        if (results.length === 0) return res.status(404).json({ status: "error", error: "Cannot Load Data" });

        const stats = results[0][0];

        // additional statistics
        const totalDaysRecorded = (stats.presentDays || 0) + (stats.absentDays || 0) + (stats.leaveDays || 0);

        const attendanceRate = totalDaysRecorded > 0 ? Math.round((stats.presentDays / totalDaysRecorded) * 100) : 0;

        const enhancedStats = {
            ...results[0][0],
            daysInMonth: daysInMonth,
            workingDaysInMonth: workingDaysInMonth,
            attendanceRate: attendanceRate,
            presentDays: stats.presentDays || 0,
            absentDays: stats.absentDays || 0,
            totalWorkHours: stats.totalWorkHours || 0,
            averageWorkHours: totalDaysRecorded > 0 ? Math.round((stats.totalWorkHours || 0) / totalDaysRecorded * 10) / 10 : 0
        };
        console.log('✅ Monthly stats calculated:', enhancedStats);
        return res.status(200).json({ status: "success", stats: enhancedStats });
    } catch (error) {
        console.log(error);
    }
}

const getTodaysDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

const handleTodaysAttendance = async (req, res) => {
    const token = decodeToken(req.cookies.token);
    const employee_id = token.employee_id;
    try {
        const date = getTodaysDate();
        const query = `SELECT * FROM attendance WHERE employee_id = ? AND DATE(date) = ?`;
        const [result] = await db.query(query, [employee_id, date]);

        console.log(result[0].status);
        res.json(result[0].status);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Something went wrong" });
    }
};

const handleGetRecentActivity = async (req, res) => {
    const token = decodeToken(req.cookies.token);
    const employee_id = token.employee_id;
    try {
        const query = `SELECT * FROM (
            SELECT 
                'attendance' AS type,
                date AS timestamp,
                CONCAT('Marked ', status, ' for ', DATE_FORMAT(date, '%M %d, %Y')) AS description
            FROM attendance 
            WHERE employee_id = ?
    
            UNION ALL
    
            SELECT 
                'salary' AS type,
                STR_TO_DATE(CONCAT(payroll_year, '-', payroll_month, '-01'), '%Y-%m-%d') AS timestamp,
                CONCAT('Salary processed for ', MONTHNAME(STR_TO_DATE(CONCAT(payroll_year, '-', payroll_month, '-01'), '%Y-%m-%d')), ' ', payroll_year) AS description
            FROM payroll 
            WHERE employee_id = ?
        ) AS combined
        ORDER BY timestamp DESC
        LIMIT 10;
        `;

        const results = await db.query(query, [Number(employee_id), Number(employee_id)]);
        console.log(`✅ Found ${results[0].length} recent activities`);
        res.json({ status: "success", activities: results[0] });
    } catch (error) {
        return res.status(500).json({ status: "error", message: 'Error fetching recent activity' });
    }

}

const handleMarkAttendance = async (req, res) => {
    const token = decodeToken(req.cookies.token);
    const employee_id = token.employee_id;
    try {
        const query = `INSERT INTO attendance (employee_id, date, status, leave_type) VALUES(?,?,'Present',NULL);`
        const date = getTodaysDate();

        await db.query(query, [employee_id, date]);
        return res.status(200).json({ status: "success", message: "Attendance Marked For Today" });
    } catch (error) {
        return res.status(500).json({ status: "error", message: "Error Marking Attendance" });
    }
}

const handleGetAttendanceHistory = async (req, res) => {
    const token = decodeToken(req.cookies.token);
    const employee_id = token.employee_id;
    try {
        const query = `SELECT date, status, leave_type, work_hours FROM attendance WHERE employee_id = ?`;
        const [rows] = await db.query(query, [Number(employee_id)]);
        return res.status(200).json({ status: "success", attendanceHistory: rows });
    } catch (error) {
        return res.status(500).json({ status: "error", message: "Error Fetching Attendance History" });
    }
}

const handleGetSalaryHistory = async (req, res) => {
    const token = decodeToken(req.cookies.token);
    const employee_id = token.employee_id;
    try {
        const query = `SELECT base_salary, income_tax, PF, LWP, totalDeduction, net_salary, payroll_month, payroll_year, payment_status, payment_date FROM payroll WHERE employee_id = ?`;
        const [rows] = await db.query(query, [Number(employee_id)]);
        return res.status(200).json({ status: "success", salaryHistory: rows });
    } catch (error) {
        return res.status(500).json({ status: "error", message: "Error Fetching Salary History" });
    }
}

const handleProfileDetails = async (req, res) => {
    const token = decodeToken(req.cookies.token);
    const employee_id = token.employee_id;
    try {
        const query = `SELECT * FROM employees WHERE id = ?`;
        const data = await db.query(query, [employee_id]);
        return res.status(200).json({ status: "success", profileData: data });
    } catch (error) {
        return res.status(500).json({ status: "error", message: "Error Fetching Profile" });
    }
}

const handleProfileUpdate = async (req, res) => {
    const token = decodeToken(req.cookies.token);
    const employee_id = token.employee_id;
    const { address, email, phone } = req.body;
    try {
        if (address === undefined || email === undefined || phone === undefined) { return res.status(400).json({ status: "error", message: "Fields cannot be undefinned" }); }
        const query = `UPDATE employees SET address = ?, email = ?, phone = ? WHERE id= ?`;
        await db.query(query, [address, email, phone, employee_id]);
        return res.status(200).json({ status: "success", message: "Profile details updated" });
    } catch (error) {
        console.log(error);
    }
}

const handleDepartmentName = async (req, res) => {
    const token = decodeToken(req.cookies.token);
    const employee_id = token.employee_id;
    try {
        const [result] = await db.query(`SELECT d.name FROM departments d JOIN employees e ON e.department_id = d.id WHERE e.id = ?`, [employee_id]);
        return res.status(200).json({ status: "success", deptName: result[0].name });
    } catch (error) {
        console.log(error);
    }
}

module.exports = { handleGetMonthlyAttendance, handleTodaysAttendance, handleGetRecentActivity, handleMarkAttendance, handleGetAttendanceHistory, handleGetSalaryHistory, handleProfileDetails, handleProfileUpdate, handleDepartmentName }