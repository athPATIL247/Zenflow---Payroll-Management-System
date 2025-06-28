import "../styling/Navbar.css";
import { IoMdHome } from "react-icons/io";
import { RiInformation2Fill } from "react-icons/ri";
import { IoCall } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { IoLogOut } from "react-icons/io5";
import { RiDashboard3Fill } from "react-icons/ri";
import { FaCalendarCheck, FaCalendarAlt } from "react-icons/fa";
import { MdPayments } from "react-icons/md";
import { CgProfile } from "react-icons/cg";

export const NavigationBar = ({ loginState }) => {
    const navigate = useNavigate();
    return (
        <section className="navbar">
            <nav className={loginState === 'off' ? "gap-11" : "gap-8"}>
                <div className="logo">
                    <p className="logo-name">ZenRoll</p>
                </div>
                <div className="navbar-links">
                    {loginState === 'off' ?
                        <ul className="gap-7">
                            <li className="tooltip-container">
                                <IoMdHome size={30} />
                                <span className="tooltip-text">Home</span>
                            </li>
                            <li className="tooltip-container">
                                <RiInformation2Fill size={30} />
                                <span className="tooltip-text">About</span>
                            </li>
                            <li className="tooltip-container">
                                <IoCall size={30} />
                                <span className="tooltip-text">Contact</span>
                            </li>
                        </ul>
                        :
                        <ul className="gap-5">
                            <li className="tooltip-container">
                                <RiDashboard3Fill size={30} onClick={() => navigate("/employee")} />
                                <span className="tooltip-text">Dashboard</span>
                            </li>
                            <li className="tooltip-container">
                                <FaCalendarAlt size={26} onClick={() => navigate("/employee/att_history")} />
                                <span className="tooltip-text">Attendance History</span>
                            </li>
                            <li className="tooltip-container" onClick={() => navigate("/employee/sal_history")}>
                                <MdPayments size={33} />
                                <span className="tooltip-text">Salary History</span>
                            </li>
                            <li className="tooltip-container" onClick={() => navigate("/employee/profile")}>
                                <CgProfile size={33} />
                                <span className="tooltip-text">Profile</span>
                            </li>
                        </ul>
                    }
                </div>
                <div className={loginState === 'off' ? "login-btn" : "logout-btn"} onClick={() => navigate("/login")}>
                    {loginState === 'off' ? "Log In" : <IoLogOut size={35} />}
                </div>
            </nav>
        </section>
    );
}