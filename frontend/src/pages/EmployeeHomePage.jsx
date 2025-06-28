import { NavigationBar } from "../components/NavigationBar";
import { checkAttendance, getMonthlyAttendance, getRecentActivity } from "../service/employeeApi";
import "../styling/EmployeeHomePage.css";
import { FcStatistics } from "react-icons/fc";
import { FaCalendarCheck, FaCalendarTimes, FaPercentage } from "react-icons/fa";
import { AiFillClockCircle } from "react-icons/ai";
import { MdOutlineAddTask } from "react-icons/md";
import { useEffect, useState } from "react";

export const EmployeeHomePage = () => {
    const [currMonthStats, setCurrMonthStats] = useState({ status: "", stats: "" });
    const [todaysAttendance, setTodaysAttendance] = useState('Absent');
    const [recentAcitivity, setRecentActivity] = useState([]);
    const handleGetMonthlyStats = async () => {
        try {
            const today = new Date();
            const res = await getMonthlyAttendance({ month: today.getMonth() + 1, year: today.getFullYear() });
            setCurrMonthStats(res.data.stats);
            // console.log(res.data);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    }

    const checkTodaysAttendance = async () => {
        try {
            const res = await checkAttendance();
            setTodaysAttendance(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    const handleGetRecentActivity = async () => {
        try {
            const res = await getRecentActivity();
            setRecentActivity(res.data.activities);
            // console.log("Recent Activity: ", res.data.activities);
        } catch (error) {

        }
    }

    useEffect(() => {
        handleGetMonthlyStats();
        checkTodaysAttendance();
        handleGetRecentActivity();
    }, []);

    return (
        <>
            <div className="hp-body">
                <NavigationBar loginState='on' />
                <section className="dashboard-container">
                    <div className="container-header">
                        <FcStatistics size={40} />
                        <h1>Monthly Statistics</h1>
                    </div>
                    <div className="stat-boxes-container">
                        <div className="stat-box" style={{ backgroundColor: "#1cb905" }}>
                            <FaCalendarCheck size={35} color="maroon" />
                            <h2>{currMonthStats.presentDays}</h2>
                            <p>Present Days</p>
                        </div>
                        <div className="stat-box" style={{ backgroundColor: "#ff1f35" }}>
                            <FaCalendarTimes size={35} color="maroon" />
                            <h2>{currMonthStats.absentDays}</h2>
                            <p>Absent Days</p>
                        </div>
                        <div className="stat-box" style={{ backgroundColor: "#575757" }}>
                            <AiFillClockCircle size={35} color="maroon" />
                            <h2>{currMonthStats.totalWorkHours}</h2>
                            <p>Working Hours</p>
                        </div>
                        <div className="stat-box" style={{ backgroundColor: "#ffc106" }}>
                            <FaPercentage size={35} color="maroon" />
                            <h2>{currMonthStats.attendanceRate}</h2>
                            <p>Attendance Rate</p>
                        </div>
                    </div>
                </section>

                <section className="dashboard-container">
                    <div className="container-header">
                        <MdOutlineAddTask size={30} />
                        <h1>Today's Attendance</h1>
                    </div>
                    <div className="todays-attendance-container">
                        <h2>{todaysAttendance === 'Leave' ? "You are on Leave Today 🌴" : todaysAttendance === 'Absent' ? "You haven't marked attendance for today" : "You have marked attendance for today ✅"}</h2>
                        {todaysAttendance === 'Absent' ? <button className="mark-attendance-btn">Mark Attendance</button> : <button className="disabled-attendance-btn">Present 📆</button>}

                    </div>
                </section>

                <section className="dashboard-container">
                    <div className="container-header">
                        <MdOutlineAddTask size={30} />
                        <h1>Recent Activities</h1>
                    </div>
                    <div className="activity-log">
                        {recentAcitivity.map((curr, indx) => {
                            return <p> {curr.type === 'attendance' ? `Attendance marked for ${curr.timestamp?.slice(0, 10)}` : `Salary processed for ${curr.timestamp.getMonth()} ${curr.timestamp.getFullYear()}`} </p>;
                        })}
                    </div>
                </section>
            </div>

            {/* <div className="hp-body"> */}
            {/* </div> */}
        </>
    );
}