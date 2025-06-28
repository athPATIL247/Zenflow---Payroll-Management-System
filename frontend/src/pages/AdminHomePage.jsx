import { AdminSidebar } from "../components/AdminSidebar";
import { FcStatistics } from "react-icons/fc";
import { FaCalendarCheck, FaCalendarTimes, FaPercentage, FaUsers, FaBuilding, FaMoneyBillWave } from "react-icons/fa";
import { AiFillClockCircle } from "react-icons/ai";
import { MdOutlineAddTask, MdTrendingUp } from "react-icons/md";
import { useEffect, useState } from "react";
import { getEmployeeList, getDepartmentCountInfo, getPayrollSummary } from "../service/adminApi";
import { toast } from "react-toastify";
import "../styling/AdminDashboard.css";

export const AdminHomePage = () => {
    const [stats, setStats] = useState({
        totalEmployees: 0,
        totalDepartments: 0,
        activeEmployees: 0,
        totalPayroll: 0
    });
    const [loading, setLoading] = useState(true);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [employeeRes, deptRes, payrollRes] = await Promise.all([
                getEmployeeList(),
                getDepartmentCountInfo(),
                getPayrollSummary(currentMonth, currentYear)
            ]);

            if (employeeRes.data.status === "success") {
                const employees = employeeRes.data.employeeList;
                setStats(prev => ({
                    ...prev,
                    totalEmployees: employees.length,
                    activeEmployees: employees.filter(emp => emp.status === 'active').length
                }));
            }

            if (deptRes.data.status === "success") {
                setStats(prev => ({
                    ...prev,
                    totalDepartments: deptRes.data.deptIdToCount.length
                }));
            }

            if (payrollRes.data.status === "success" && payrollRes.data.payrollSummary.length > 0) {
                const summary = payrollRes.data.payrollSummary[0];
                setStats(prev => ({
                    ...prev,
                    totalPayroll: summary.totalSalaryPayout || 0
                }));
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ icon: Icon, title, value, color, subtitle }) => (
        <div className="stat-card" style={{ borderLeft: `4px solid ${color}` }}>
            <div className="stat-icon" style={{ color }}>
                <Icon size={40} />
            </div>
            <div className="stat-content">
                <h3 className="stat-title">{title}</h3>
                <p className="stat-value">{loading ? "Loading..." : value}</p>
                {subtitle && <p className="stat-subtitle">{subtitle}</p>}
            </div>
        </div>
    );

    return (
        <>
            <div className="admin-body">
                <AdminSidebar />
                {/* <NavigationBar /> */}
                <section className="admin-dashboard">
                    <div className="dashboard-header" style={{marginBottom:'6rem'}}>
                        <h1>Admin Dashboard</h1>
                        <p>Welcome back! Here's an overview of your organization.</p>
                    </div>

                    <div className="stats-grid">
                        <StatCard
                            icon={FaUsers}
                            title="Total Employees"
                            value={stats.totalEmployees}
                            color="#667eea"
                            subtitle="Active workforce"
                        />
                        <StatCard
                            icon={FaBuilding}
                            title="Departments"
                            value={stats.totalDepartments}
                            color="#764ba2"
                            subtitle="Organizational units"
                        />
                        <StatCard
                            icon={FaCalendarCheck}
                            title="Active Employees"
                            value={stats.activeEmployees}
                            color="#f093fb"
                            subtitle="Currently working"
                        />
                        <StatCard
                            icon={FaMoneyBillWave}
                            title="Monthly Payroll"
                            value={`₹${stats.totalPayroll.toLocaleString()}`}
                            color="#4facfe"
                            subtitle={`${currentMonth}/${currentYear}`}
                        />
                    </div>

                    <div className="quick-actions">
                        <h2>Quick Actions</h2>
                        <div className="actions-grid">
                            <div className="action-card" onClick={() => window.location.href = '/admin/employees'}>
                                <MdOutlineAddTask size={30} />
                                <h3>Add Employee</h3>
                                <p>Register a new employee</p>
                            </div>
                            <div className="action-card" onClick={() => window.location.href = '/admin/departments'}>
                                <FaBuilding size={30} />
                                <h3>Manage Departments</h3>
                                <p>View department details</p>
                            </div>
                            <div className="action-card" onClick={() => window.location.href = '/admin/payroll'}>
                                <FaMoneyBillWave size={30} />
                                <h3>Payroll Summary</h3>
                                <p>View payroll reports</p>
                            </div>
                            <div className="action-card" onClick={() => window.location.href = '/admin/analytics'}>
                                <MdTrendingUp size={30} />
                                <h3>Analytics</h3>
                                <p>View detailed reports</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}