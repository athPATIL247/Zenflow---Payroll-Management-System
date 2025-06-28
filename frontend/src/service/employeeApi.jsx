import { api } from "./api";

export const getMonthlyAttendance = (body) => {
    return api.post(`/dashboard/employee/monthly-attendance`, body);
}

export const checkAttendance = () => {
    return api.get(`/dashboard/employee/check-attendance`);
}

export const getRecentActivity = () => {
    return api.get(`/dashboard/employee/recent-activity`);
}

export const markAttendance = () => {
    return api.get(`/dashboard/employee/mark-attendance`);
}

export const getAttendanceHistory = () => {
    return api.get(`/dashboard/employee/attendance-history`);
}

export const getSalaryHistory = () => {
    return api.get(`/dashboard/employee/salary-history`);
}

export const fetchProfile = () => {
    return api.get('/dashboard/employee/get-profile');
}

export const updateProfile = (body) => {
    return api.patch('/dashboard/employee/update-profile', body);
}

export const departmentName = () => {
    return api.get('/dashboard/employee/department-name');
}