import { useNavigate, useLocation } from "react-router-dom";
import { RiDashboard3Fill } from "react-icons/ri";
import { MdPeople, MdPayments, MdAnalytics } from "react-icons/md";
import { FaBuilding } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import "../styling/AdminSidebar.css";

export const AdminSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { path: "/admin", icon: RiDashboard3Fill, label: "Dashboard" },
        { path: "/admin/employees", icon: MdPeople, label: "Employees" },
        { path: "/admin/departments", icon: FaBuilding, label: "Departments" },
        { path: "/admin/payroll", icon: MdPayments, label: "Payroll" },
        { path: "/admin/analytics", icon: MdAnalytics, label: "Analytics" }
    ];

    const isActive = (path) => {
        if (path === "/admin") {
            return location.pathname === "/admin";
        }
        return location.pathname.startsWith(path);
    };

    const handleLogout = () => {
        // Add any logout logic here (clear tokens, etc.)
        // For now, just navigate to login page
        navigate("/login");
    };

    return (
        <div className="admin-sidebar">
            <div className="sidebar-header">
                <h3>Admin Panel</h3>
            </div>
            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <button
                        key={item.path}
                        className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}
                        onClick={() => navigate(item.path)}
                        title={item.label}
                    >
                        <item.icon size={24} />
                        <span className="tooltip">{item.label}</span>
                    </button>
                ))}
            </nav>
            <div className="sidebar-footer">
                <button
                    className="sidebar-item logout-btn"
                    onClick={handleLogout}
                    title="Logout"
                >
                    <IoLogOut size={24} />
                    <span className="tooltip">Logout</span>
                </button>
            </div>
        </div>
    );
} 