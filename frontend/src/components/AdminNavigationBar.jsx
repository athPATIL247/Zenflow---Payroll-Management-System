import "../styling/AdminNavbar.css";
import { IoMdHome } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { RiDashboard3Fill } from "react-icons/ri";
import { MdPeople, MdPayments, MdAnalytics } from "react-icons/md";
import { FaBuilding } from "react-icons/fa";

export const AdminNavigationBar = ({ activePage }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Add logout logic here
        navigate("/login");
    };

    return (
        // <section className="admin-navbar">
            <nav className="admin-nav">
                <div className="logo">
                    <p className="logo-name">ZenRoll Admin</p>
                </div>
                <div className="navbar-links">
                    <ul className="admin-nav-links">
                        <li className={`tooltip-container`}>
                            <RiDashboard3Fill size={30} onClick={() => navigate("/admin")} />
                            <span className="tooltip-text">Dashboard</span>
                        </li>
                        <li className={`tooltip-container`}>
                            <MdPeople size={30} onClick={() => navigate("/admin/employees")} />
                            <span className="tooltip-text">Employees</span>
                        </li>
                        <li className={`tooltip-container`}>
                            <FaBuilding size={28} onClick={() => navigate("/admin/departments")} />
                            <span className="tooltip-text">Departments</span>
                        </li>
                        <li className={`tooltip-container`}>
                            <MdPayments size={30} onClick={() => navigate("/admin/payroll")} />
                            <span className="tooltip-text">Payroll</span>
                        </li>
                        <li className={`tooltip-container`}>
                            <MdAnalytics size={30} onClick={() => navigate("/admin/analytics")} />
                            <span className="tooltip-text">Analytics</span>
                        </li>
                    </ul>
                </div>
                <div className="logout-btn" onClick={handleLogout}>
                    <IoLogOut size={35} />
                </div>
            </nav>
        // </section>
    );
} 