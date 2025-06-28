const express = require('express');
const router = express.Router();
const { handleAddEmployee, handleDeleteEmployee, handleListEmployees, getDeptCountInfo, getPplInDept, handlePayrollSummary } = require("../controllers/admin");

router.post("/add-employee", handleAddEmployee);
router.delete("/delete-employee/:employeeId", handleDeleteEmployee);
router.get("/employee-list", handleListEmployees);
router.get("/dept-count", getDeptCountInfo);
router.get("/dept-ppl", getPplInDept);
router.get("/payroll-summary", handlePayrollSummary);

module.exports = router;