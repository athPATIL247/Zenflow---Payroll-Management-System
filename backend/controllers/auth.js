const jwt = require('jsonwebtoken');
const db = require("../connect");

const JWT_SECRET = 'zenflow_confidential';

const handleLogin = async (req, res) => {
    const { role, employeeID, password } = req.body;

    try {
        const [userRows] = await db.query(
            `SELECT * FROM users WHERE employee_id = ? AND password = ? AND role = ?`,
            [Number(employeeID), password, role]
        );

        if (userRows.length === 0) return res.status(404).json({ error: "Invalid credentials" });

        const user = userRows[0];

        const payload = {
            employee_id: user.employee_id,
            role: user.role
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

        // 3. Set cookie (HTTP-only for security)
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        return res.json({
            status: "success",
            employee_id: user.employee_id
        });

    } catch (err) {
        console.error('DB Error:', err);
        res.status(500).json({ error: 'Failed to log in' });
    }
};

module.exports = { handleLogin };
