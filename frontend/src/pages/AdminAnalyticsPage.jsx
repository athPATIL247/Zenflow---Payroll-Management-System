import { AdminSidebar } from "../components/AdminSidebar";
import { useEffect, useState } from "react";
import { getEmployeeList, getDepartmentCountInfo, getPayrollSummary } from "../service/adminApi";
import { toast } from "react-toastify";
import { FaUsers, FaBuilding, FaMoneyBillWave, FaChartLine, FaChartPie, FaChartBar } from "react-icons/fa";
import { MdTrendingUp, MdTrendingDown } from "react-icons/md";
import "../styling/AdminAnalytics.css";

export const AdminAnalyticsPage = () => {
    const [analyticsData, setAnalyticsData] = useState({
        employees: [],
        departments: [],
        payroll: null
    });
    const [loading, setLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState('month');

    useEffect(() => {
        fetchAnalyticsData();
    }, []);

    const fetchAnalyticsData = async () => {
        try {
            setLoading(true);
            const [employeeRes, deptRes, payrollRes] = await Promise.all([
                getEmployeeList(),
                getDepartmentCountInfo(),
                getPayrollSummary(new Date().getMonth() + 1, new Date().getFullYear())
            ]);

            if (employeeRes.data.status === "success") {
                setAnalyticsData(prev => ({
                    ...prev,
                    employees: employeeRes.data.employeeList
                }));
            }

            if (deptRes.data.status === "success") {
                setAnalyticsData(prev => ({
                    ...prev,
                    departments: deptRes.data.deptIdToCount
                }));
            }

            if (payrollRes.data.status === "success") {
                setAnalyticsData(prev => ({
                    ...prev,
                    payroll: payrollRes.data.payrollSummary[0] || null
                }));
            }
        } catch (error) {
            console.error("Error fetching analytics data:", error);
            toast.error("Failed to load analytics data");
        } finally {
            setLoading(false);
        }
    };

    const getEmployeeStatusDistribution = () => {
        const statusCount = analyticsData.employees.reduce((acc, emp) => {
            acc[emp.status] = (acc[emp.status] || 0) + 1;
            return acc;
        }, {});
        return statusCount;
    };

    const getDepartmentDistribution = () => {
        return analyticsData.departments.map(dept => ({
            name: dept.department_name,
            count: dept.count
        }));
    };

    const StatCard = ({ title, value, icon: Icon, color, trend, percentage }) => (
        <div className="stat-card" style={{ borderLeft: `4px solid ${color}` }}>
            <div className="stat-header">
                <div className="stat-icon" style={{ color }}>
                    <Icon size={24} />
                </div>
                <div className="trend-indicator">
                    {trend === 'up' && <MdTrendingUp size={20} color="#10b981" />}
                    {trend === 'down' && <MdTrendingDown size={20} color="#ef4444" />}
                    {percentage && <span className="percentage">{percentage}</span>}
                </div>
            </div>
            <div className="stat-content">
                <h3 className="stat-title">{title}</h3>
                <p className="stat-value">{value}</p>
            </div>
        </div>
    );

    const ChartCard = ({ title, icon: Icon, children }) => (
        <div className="chart-card">
            <div className="chart-header">
                <div className="chart-icon">
                    <Icon size={20} />
                </div>
                <h3>{title}</h3>
            </div>
            <div className="chart-content">
                {children}
            </div>
        </div>
    );

    return (
        <>
            <div className="admin-body">
                <AdminSidebar />
                <section className="admin-analytics">
                    <div className="page-header">
                        <div>
                            <h1>Analytics & Insights</h1>
                            <p>Comprehensive analytics and insights about your organization</p>
                        </div>
                        <div className="period-selector">
                            <select 
                                value={selectedPeriod} 
                                onChange={(e) => setSelectedPeriod(e.target.value)}
                            >
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                                <option value="quarter">This Quarter</option>
                                <option value="year">This Year</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading">Loading analytics...</div>
                    ) : (
                        <>
                            <div className="stats-overview">
                                <StatCard
                                    title="Total Employees"
                                    value={analyticsData.employees.length}
                                    icon={FaUsers}
                                    color="#667eea"
                                    trend="up"
                                    percentage="+12%"
                                />
                                <StatCard
                                    title="Departments"
                                    value={analyticsData.departments.length}
                                    icon={FaBuilding}
                                    color="#764ba2"
                                    trend="up"
                                    percentage="+5%"
                                />
                                <StatCard
                                    title="Active Employees"
                                    value={analyticsData.employees.filter(emp => emp.status === 'active').length}
                                    icon={FaUsers}
                                    color="#f093fb"
                                    trend="up"
                                    percentage="+8%"
                                />
                                <StatCard
                                    title="Monthly Payroll"
                                    value={`₹${analyticsData.payroll?.totalSalaryPayout?.toLocaleString() || '0'}`}
                                    icon={FaMoneyBillWave}
                                    color="#4facfe"
                                    trend="up"
                                    percentage="+15%"
                                />
                            </div>

                            <div className="charts-section">
                                <div className="charts-grid">
                                    <ChartCard title="Employee Status Distribution" icon={FaChartPie}>
                                        <div className="status-chart">
                                            {Object.entries(getEmployeeStatusDistribution()).map(([status, count]) => (
                                                <div key={status} className="status-item">
                                                    <div className="status-info">
                                                        <span className="status-name">{status}</span>
                                                        <span className="status-count">{count}</span>
                                                    </div>
                                                    <div className="status-bar">
                                                        <div 
                                                            className="status-fill"
                                                            style={{ 
                                                                width: `${(count / analyticsData.employees.length) * 100}%`,
                                                                backgroundColor: status === 'active' ? '#10b981' : 
                                                                               status === 'inactive' ? '#f59e0b' : '#ef4444'
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </ChartCard>

                                    <ChartCard title="Department Distribution" icon={FaChartBar}>
                                        <div className="dept-chart">
                                            {getDepartmentDistribution().map((dept, index) => (
                                                <div key={dept.name} className="dept-item">
                                                    <div className="dept-info">
                                                        <span className="dept-name">{dept.name}</span>
                                                        <span className="dept-count">{dept.count}</span>
                                                    </div>
                                                    <div className="dept-bar">
                                                        <div 
                                                            className="dept-fill"
                                                            style={{ 
                                                                width: `${(dept.count / Math.max(...getDepartmentDistribution().map(d => d.count))) * 100}%`,
                                                                backgroundColor: `hsl(${index * 60}, 70%, 60%)`
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </ChartCard>

                                    <ChartCard title="Payroll Breakdown" icon={FaChartLine}>
                                        <div className="payroll-breakdown">
                                            {analyticsData.payroll && (
                                                <>
                                                    <div className="breakdown-item">
                                                        <span>Gross Salary</span>
                                                        <span>₹{analyticsData.payroll.totalSalaryPayout?.toLocaleString() || '0'}</span>
                                                    </div>
                                                    <div className="breakdown-item">
                                                        <span>Income Tax</span>
                                                        <span>-₹{analyticsData.payroll.totalIncomeTax?.toLocaleString() || '0'}</span>
                                                    </div>
                                                    <div className="breakdown-item">
                                                        <span>Provident Fund</span>
                                                        <span>-₹{analyticsData.payroll.totalPF?.toLocaleString() || '0'}</span>
                                                    </div>
                                                    <div className="breakdown-item">
                                                        <span>LWP</span>
                                                        <span>-₹{analyticsData.payroll.totalLWP?.toLocaleString() || '0'}</span>
                                                    </div>
                                                    <div className="breakdown-item total">
                                                        <span>Net Payroll</span>
                                                        <span>₹{(analyticsData.payroll.totalSalaryPayout - analyticsData.payroll.totalDeductions)?.toLocaleString() || '0'}</span>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </ChartCard>

                                    <ChartCard title="Key Insights" icon={FaChartLine}>
                                        <div className="insights-list">
                                            <div className="insight-item">
                                                <div className="insight-icon positive">📈</div>
                                                <div className="insight-content">
                                                    <h4>Employee Growth</h4>
                                                    <p>12% increase in employee count this month</p>
                                                </div>
                                            </div>
                                            <div className="insight-item">
                                                <div className="insight-icon positive">💰</div>
                                                <div className="insight-content">
                                                    <h4>Payroll Efficiency</h4>
                                                    <p>Payroll processing time reduced by 25%</p>
                                                </div>
                                            </div>
                                            <div className="insight-item">
                                                <div className="insight-icon neutral">👥</div>
                                                <div className="insight-content">
                                                    <h4>Department Balance</h4>
                                                    <p>Well-distributed workforce across departments</p>
                                                </div>
                                            </div>
                                            <div className="insight-item">
                                                <div className="insight-icon positive">✅</div>
                                                <div className="insight-content">
                                                    <h4>Attendance Rate</h4>
                                                    <p>95% average attendance rate this month</p>
                                                </div>
                                            </div>
                                        </div>
                                    </ChartCard>
                                </div>
                            </div>
                        </>
                    )}
                </section>
            </div>
        </>
    );
} 