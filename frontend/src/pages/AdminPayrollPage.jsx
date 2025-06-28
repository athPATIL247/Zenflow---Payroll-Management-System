import { AdminSidebar } from "../components/AdminSidebar";
import { useEffect, useState } from "react";
import { getPayrollSummary } from "../service/adminApi";
import { toast } from "react-toastify";
import { FaMoneyBillWave, FaCalendarAlt, FaDownload, FaEye } from "react-icons/fa";
import { MdTrendingUp, MdTrendingDown } from "react-icons/md";
import "../styling/AdminPayroll.css";

export const AdminPayrollPage = () => {
    const [payrollData, setPayrollData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        fetchPayrollData();
    }, [selectedMonth, selectedYear]);

    const fetchPayrollData = async () => {
        try {
            setLoading(true);
            const response = await getPayrollSummary(selectedMonth, selectedYear);
            if (response.data.status === "success") {
                setPayrollData(response.data.payrollSummary[0] || null);
            }
        } catch (error) {
            console.error("Error fetching payroll data:", error);
            toast.error("Failed to load payroll data");
        } finally {
            setLoading(false);
        }
    };

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

    const PayrollCard = ({ title, value, icon: Icon, color, subtitle, trend }) => (
        <div className="payroll-card" style={{ borderLeft: `4px solid ${color}` }}>
            <div className="card-header">
                <div className="card-icon" style={{ color }}>
                    <Icon size={24} />
                </div>
                <div className="trend-indicator">
                    {trend === 'up' && <MdTrendingUp size={20} color="#10b981" />}
                    {trend === 'down' && <MdTrendingDown size={20} color="#ef4444" />}
                </div>
            </div>
            <div className="card-content">
                <h3 className="card-title">{title}</h3>
                <p className="card-value">₹{value?.toLocaleString() || '0'}</p>
                {subtitle && <p className="card-subtitle">{subtitle}</p>}
            </div>
        </div>
    );

    return (
        <>
            <div className="admin-body">
                <AdminSidebar />
                <section className="admin-payroll">
                    <div className="page-header">
                        <div>
                            <h1>Payroll Management</h1>
                            <p>View and manage payroll summaries and reports</p>
                        </div>
                        <div className="header-actions">
                            <button className="export-btn">
                                <FaDownload size={16} />
                                Export Report
                            </button>
                        </div>
                    </div>

                    <div className="filters-section">
                        <div className="filter-group">
                            <label>Month:</label>
                            <select 
                                value={selectedMonth} 
                                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                            >
                                {months.map((month, index) => (
                                    <option key={index + 1} value={index + 1}>
                                        {month}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="filter-group">
                            <label>Year:</label>
                            <select 
                                value={selectedYear} 
                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                            >
                                {years.map(year => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading">Loading payroll data...</div>
                    ) : payrollData ? (
                        <>
                            <div className="payroll-summary">
                                <h2>Payroll Summary for {months[selectedMonth - 1]} {selectedYear}</h2>
                                
                                <div className="payroll-grid">
                                    <PayrollCard
                                        title="Total Salary Payout"
                                        value={payrollData.totalSalaryPayout}
                                        icon={FaMoneyBillWave}
                                        color="#667eea"
                                        subtitle="Gross salary payments"
                                        trend="up"
                                    />
                                    <PayrollCard
                                        title="Total Income Tax"
                                        value={payrollData.totalIncomeTax}
                                        icon={FaMoneyBillWave}
                                        color="#ef4444"
                                        subtitle="Tax deductions"
                                        trend="down"
                                    />
                                    <PayrollCard
                                        title="Total PF"
                                        value={payrollData.totalPF}
                                        icon={FaMoneyBillWave}
                                        color="#f59e0b"
                                        subtitle="Provident Fund"
                                        trend="down"
                                    />
                                    <PayrollCard
                                        title="Total LWP"
                                        value={payrollData.totalLWP}
                                        icon={FaMoneyBillWave}
                                        color="#8b5cf6"
                                        subtitle="Leave Without Pay"
                                        trend="down"
                                    />
                                    <PayrollCard
                                        title="Total Deductions"
                                        value={payrollData.totalDeductions}
                                        icon={FaMoneyBillWave}
                                        color="#ec4899"
                                        subtitle="All deductions combined"
                                        trend="down"
                                    />
                                </div>
                            </div>

                            <div className="payroll-actions">
                                <div className="action-cards">
                                    <div className="action-card">
                                        <FaEye size={24} />
                                        <h3>View Detailed Report</h3>
                                        <p>See individual employee payroll details</p>
                                        <button className="action-btn">View Report</button>
                                    </div>
                                    <div className="action-card">
                                        <FaDownload size={24} />
                                        <h3>Download Report</h3>
                                        <p>Export payroll data to PDF or Excel</p>
                                        <button className="action-btn">Download</button>
                                    </div>
                                    <div className="action-card">
                                        <FaCalendarAlt size={24} />
                                        <h3>Generate Payroll</h3>
                                        <p>Create payroll for the selected period</p>
                                        <button className="action-btn">Generate</button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="no-data">
                            <FaMoneyBillWave size={48} color="#a0aec0" />
                            <h3>No Payroll Data Available</h3>
                            <p>No payroll data found for {months[selectedMonth - 1]} {selectedYear}</p>
                        </div>
                    )}
                </section>
            </div>
        </>
    );
} 