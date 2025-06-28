const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const cors = require('cors');

const db = require("./connect");
const authenticate = require("./middlewares/auth");
const authRoute = require("./routes/auth");
const EmpDashboardRoute = require("./routes/employee");
const adminRoute = require("./routes/admin");

const app = express();
const PORT = 8005;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/auth', authRoute);
app.use('/dashboard/employee', authenticate, EmpDashboardRoute);
app.use('/admin', adminRoute);

module.exports = db;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})