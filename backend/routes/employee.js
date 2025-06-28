const express = require('express');
const { handleGetMonthlyAttendance, handleTodaysAttendance, handleGetRecentActivity, handleMarkAttendance, handleGetAttendanceHistory, handleGetSalaryHistory, handleProfileDetails, handleProfileUpdate, handleDepartmentName } = require('../controllers/employee');
const router = express.Router();

router.post("/monthly-attendance", handleGetMonthlyAttendance);
router.get("/check-attendance", handleTodaysAttendance);
router.get("/recent-activity", handleGetRecentActivity);
router.get("/mark-attendance", handleMarkAttendance);
router.get("/attendance-history", handleGetAttendanceHistory);
router.get("/salary-history", handleGetSalaryHistory);
router.get("/get-profile", handleProfileDetails);
router.patch("/update-profile", handleProfileUpdate);
router.get("/department-name", handleDepartmentName);

module.exports = router;