import { useEffect, useState } from "react";
import { FaHistory } from "react-icons/fa";
import "../styling/EmployeeHomePage.css";
import { getAttendanceHistory } from "../service/employeeApi";
import { NavigationBar } from "../components/NavigationBar";

export const EmployeeAttHistory = () => {
    const [attendanceHistory, setAttendanceHistory] = useState([]);

    const handleGetAttendanceHistory = async () => {
        try {
            const res = await getAttendanceHistory();
            setAttendanceHistory(res.data.attendanceHistory.reverse());
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        handleGetAttendanceHistory();
    }, []);

    return <div className="hp-body">
        <NavigationBar />
        <section className="dashboard-container">
            <div className="container-header">
                <FaHistory size={25} />
                <h1>Attendance History</h1>
            </div>
            <div style={{ padding: "1rem", overflowX: "auto" }}>
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendanceHistory.map((curr, index) => (
                            <tr
                                key={index}
                                className={
                                    curr.status.toLowerCase() === 'absent'
                                        ? 'row-absent'
                                        : curr.status.toLowerCase() === 'present'
                                            ? 'row-present'
                                            : 'row-leave'
                                }
                            >
                                <td data-label="Date">{curr.date.slice(0, 10)}</td>
                                <td data-label="Status">{curr.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    </div>
}