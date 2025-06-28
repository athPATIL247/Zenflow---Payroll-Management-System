import { AdminSidebar } from "../components/AdminSidebar";
import { useEffect, useState } from "react";
import { getEmployeeList, addEmployee, deleteEmployee } from "../service/adminApi";
import { toast } from "react-toastify";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import "../styling/AdminEmployees.css";

export const AdminEmployeesPage = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [newEmployee, setNewEmployee] = useState({
        name: "",
        department_id: "",
        position: "",
        date_joined: "",
        password: "",
        role: "employee"
    });

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const response = await getEmployeeList();
            if (response.data.status === "success") {
                setEmployees(response.data.employeeList);
            }
        } catch (error) {
            console.error("Error fetching employees:", error);
            toast.error("Failed to load employees");
        } finally {
            setLoading(false);
        }
    };

    const handleAddEmployee = async (e) => {
        e.preventDefault();
        try {
            const response = await addEmployee(newEmployee);
            if (response.data.status === "success") {
                toast.success("Employee added successfully!");
                setShowAddModal(false);
                setNewEmployee({
                    name: "",
                    department_id: "",
                    position: "",
                    date_joined: "",
                    password: "",
                    role: "employee"
                });
                fetchEmployees();
            }
        } catch (error) {
            console.error("Error adding employee:", error);
            toast.error("Failed to add employee");
        }
    };

    const handleDeleteEmployee = async (employeeId, employeeName) => {
        if (window.confirm(`Are you sure you want to delete ${employeeName}? This action cannot be undone.`)) {
            try {
                const response = await deleteEmployee(employeeId);
                if (response.data.status === "success") {
                    toast.success(`Employee ${employeeName} deleted successfully!`);
                    fetchEmployees(); // Refresh the list
                }
            } catch (error) {
                console.error("Error deleting employee:", error);
                toast.error("Failed to delete employee");
            }
        }
    };

    const filteredEmployees = employees.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.department_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return '#10b981';
            case 'inactive': return '#f59e0b';
            case 'terminated': return '#ef4444';
            default: return '#6b7280';
        }
    };

    return (
        <>
            <div className="admin-body">
                <AdminSidebar />
                <section className="admin-employees">
                    <div className="page-header">
                        <div>
                            <h1>Employee Management</h1>
                            <p>Manage your organization's employees</p>
                        </div>
                        <button 
                            className="add-employee-btn"
                            onClick={() => setShowAddModal(true)}
                        >
                            <FaPlus size={16} />
                            Add Employee
                        </button>
                    </div>

                    <div className="search-section">
                        <div className="search-box">
                            <FaSearch size={16} />
                            <input
                                type="text"
                                placeholder="Search employees..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="employees-table-container">
                        {loading ? (
                            <div className="loading">Loading employees...</div>
                        ) : (
                            <table className="employees-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Department</th>
                                        <th>Position</th>
                                        <th>Date Joined</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredEmployees.map((employee) => (
                                        <tr key={employee.id}>
                                            <td>{employee.id}</td>
                                            <td className="employee-name">{employee.name}</td>
                                            <td>{employee.department_name}</td>
                                            <td>{employee.position}</td>
                                            <td>{new Date(employee.date_joined).toLocaleDateString()}</td>
                                            <td>
                                                <span 
                                                    className="status-badge"
                                                    style={{ backgroundColor: getStatusColor(employee.status) }}
                                                >
                                                    {employee.status}
                                                </span>
                                            </td>
                                            <td className="actions">
                                                <button className="action-btn view" title="View Details">
                                                    <FaEye size={14} />
                                                </button>
                                                <button className="action-btn edit" title="Edit Employee">
                                                    <FaEdit size={14} />
                                                </button>
                                                <button 
                                                    className="action-btn delete" 
                                                    title="Delete Employee"
                                                    onClick={() => handleDeleteEmployee(employee.id, employee.name)}
                                                >
                                                    <FaTrash size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </section>

                {/* Add Employee Modal */}
                {showAddModal && (
                    <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Add New Employee</h2>
                                <button 
                                    className="close-btn"
                                    onClick={() => setShowAddModal(false)}
                                >
                                    ×
                                </button>
                            </div>
                            <form onSubmit={handleAddEmployee} className="add-employee-form">
                                <div className="form-group">
                                    <label>Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={newEmployee.name}
                                        onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Department ID</label>
                                    <input
                                        type="number"
                                        required
                                        value={newEmployee.department_id}
                                        onChange={(e) => setNewEmployee({...newEmployee, department_id: e.target.value})}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Position</label>
                                    <input
                                        type="text"
                                        required
                                        value={newEmployee.position}
                                        onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Date Joined</label>
                                    <input
                                        type="date"
                                        required
                                        value={newEmployee.date_joined}
                                        onChange={(e) => setNewEmployee({...newEmployee, date_joined: e.target.value})}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        required
                                        value={newEmployee.password}
                                        onChange={(e) => setNewEmployee({...newEmployee, password: e.target.value})}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Role</label>
                                    <select
                                        value={newEmployee.role}
                                        onChange={(e) => setNewEmployee({...newEmployee, role: e.target.value})}
                                    >
                                        <option value="employee">Employee</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div className="modal-actions">
                                    <button type="button" onClick={() => setShowAddModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit">
                                        Add Employee
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
} 