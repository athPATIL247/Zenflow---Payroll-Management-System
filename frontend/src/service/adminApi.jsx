import axios from "axios"

export const adminApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const addEmployee = (employeeData) => {
    return adminApi.post("/admin/add-employee", employeeData);
}

export const getEmployeeList = () => {
    return adminApi.get("/admin/employee-list");
}

export const deleteEmployee = (employeeId) => {
    return adminApi.delete(`/admin/delete-employee/${employeeId}`);
}

export const getDepartmentCountInfo = () => {
    return adminApi.get("/admin/dept-count");
}

export const getPeopleInDepartment = (deptID) => {
    return adminApi.get(`/admin/dept-ppl?deptID=${deptID}`);
}

export const getPayrollSummary = (month, year) => {
    return adminApi.get(`/admin/payroll-summary?month=${month}&year=${year}`);
} 