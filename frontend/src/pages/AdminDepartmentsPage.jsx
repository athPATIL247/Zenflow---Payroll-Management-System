import { AdminSidebar } from "../components/AdminSidebar";
import { useEffect, useState } from "react";
import { getDepartmentCountInfo, getPeopleInDepartment } from "../service/adminApi";
import { toast } from "react-toastify";
import { FaUsers, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import "../styling/AdminDepartments.css";

export const AdminDepartmentsPage = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDept, setSelectedDept] = useState(null);
    const [showDeptDetails, setShowDeptDetails] = useState(false);

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            const response = await getDepartmentCountInfo();
            if (response.data.status === "success") {
                setDepartments(response.data.deptIdToCount);
            }
        } catch (error) {
            console.error("Error fetching departments:", error);
            toast.error("Failed to load departments");
        } finally {
            setLoading(false);
        }
    };

    const handleViewDepartment = async (deptId) => {
        try {
            const response = await getPeopleInDepartment(deptId);
            if (response.data.status === "success") {
                setSelectedDept({
                    id: deptId,
                    name: departments.find(d => d.department_id === deptId)?.department_name,
                    employees: response.data.pplInfo
                });
                setShowDeptDetails(true);
            }
        } catch (error) {
            console.error("Error fetching department details:", error);
            toast.error("Failed to load department details");
        }
    };

    const DepartmentCard = ({ department }) => (
        <div className="department-card">
            <div className="dept-header">
                <h3>{department.department_name}</h3>
                <div className="dept-count">
                    <FaUsers size={20} />
                    <span>{department.count} employees</span>
                </div>
            </div>
            <div className="dept-actions">
                <button 
                    className="action-btn view"
                    onClick={() => handleViewDepartment(department.department_id)}
                    title="View Details"
                >
                    <FaEye size={14} />
                    View
                </button>
                <button className="action-btn edit" title="Edit Department">
                    <FaEdit size={14} />
                    Edit
                </button>
                <button className="action-btn delete" title="Delete Department">
                    <FaTrash size={14} />
                    Delete
                </button>
            </div>
        </div>
    );

    return (
        <>
            <div className="admin-body">
                <AdminSidebar />
                <section className="admin-departments">
                    <div className="page-header">
                        <div>
                            <h1>Department Management</h1>
                            <p>Manage your organization's departments and view employee distribution</p>
                        </div>
                    </div>

                    <div className="departments-grid">
                        {loading ? (
                            <div className="loading">Loading departments...</div>
                        ) : (
                            departments.map((department) => (
                                <DepartmentCard key={department.department_id} department={department} />
                            ))
                        )}
                    </div>
                </section>

                {/* Department Details Modal */}
                {showDeptDetails && selectedDept && (
                    <div className="modal-overlay" onClick={() => setShowDeptDetails(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>{selectedDept.name} Department</h2>
                                <button 
                                    className="close-btn"
                                    onClick={() => setShowDeptDetails(false)}
                                >
                                    ×
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="dept-summary">
                                    <p><strong>Total Employees:</strong> {selectedDept.employees.length}</p>
                                </div>
                                <div className="employees-list">
                                    <h3>Employees in this Department</h3>
                                    {selectedDept.employees.length > 0 ? (
                                        <div className="employees-grid">
                                            {selectedDept.employees.map((employee) => (
                                                <div key={employee.id} className="employee-card">
                                                    <div className="employee-info">
                                                        <h4>{employee.name}</h4>
                                                        <p>{employee.position}</p>
                                                        <span className={`status-badge ${employee.status}`}>
                                                            {employee.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="no-employees">No employees in this department</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
} 