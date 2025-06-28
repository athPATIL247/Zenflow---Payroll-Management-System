import { useEffect, useState } from "react";
import { FaHistory } from "react-icons/fa";
import "../styling/EmployeeHomePage.css";
import { NavigationBar } from "../components/NavigationBar";
import { getSalaryHistory } from "../service/employeeApi";

export const EmployeeSalHistory = () => {
    const [salaryHistory, setSalaryHistory] = useState([]);

    const handleGetSalaryHistory = async () => {
        try {
            const res = await getSalaryHistory();
            console.log(res.data.salaryHistory);
            setSalaryHistory(res.data.salaryHistory.reverse());
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        handleGetSalaryHistory();
    }, []);

    return <div className="hp-body">
        <NavigationBar />
        <section className="dashboard-container">
            <div className="container-header">
                <FaHistory size={25} />
                <h1>Salary History</h1>
            </div>
            <div style={{ padding: "1rem", overflowX: "auto" }}>
                <table>
                    <thead>
                        <tr>
                            <th>Base Salary</th>
                            <th>PF</th>
                            <th>LWP</th>
                            <th>Income Tax</th>
                            <th>Total Deductions</th>
                            <th>Net Salary</th>
                            <th>Payment Status</th>
                            <th>Payment Date</th>
                            <th>Payment Month</th>
                            <th>Payment Year</th>
                        </tr>
                    </thead>
                    <tbody style={{ fontWeight: "bolder" }}>
                        {salaryHistory.map((curr, index) => {
                            const { LWP, PF, base_salary, income_tax, net_salary, payment_date, payment_status, payment_month, payment_year, totalDeduction } = curr;
                            console.log(LWP, PF);
                            return <tr
                                key={index}
                                className={
                                    curr.payment_status.toLowerCase() === 'pending'
                                        ? 'row-absent'
                                        : 'row-present'
                                }
                            >
                                <td data-label="Base Salary">{base_salary}</td>
                                <td data-label="PF">{PF}</td>
                                <td data-label="LWP">{LWP}</td>
                                <td data-label="Income Tax">{income_tax}</td>
                                <td data-label="Total Deductions">{totalDeduction}</td>
                                <td data-label="Net Salary">{net_salary}</td>
                                <td data-label="Payment Status">{payment_status}</td>
                                <td data-label="Payment Date">{payment_date}</td>
                                <td data-label="Payment Month">{payment_month}</td>
                                <td data-label="Payment Year">{payment_year}</td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    </div>
}