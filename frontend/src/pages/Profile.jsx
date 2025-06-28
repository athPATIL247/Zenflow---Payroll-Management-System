import { NavigationBar } from "../components/NavigationBar";
import { departmentName, fetchProfile, updateProfile } from "../service/employeeApi";
import "../styling/EmployeeHomePage.css";
import { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Profile = () => {
    const [profileData, setProfileData] = useState({});
    const [editMode, setEditMode] = useState(false);
    const [editFields, setEditFields] = useState({ address: "", email: "", phone: "" });
    const [loading, setLoading] = useState(false);
    const [deptName, setDeptName] = useState("");

    const handleGetProfileData = async () => {
        try {
            const res = await fetchProfile();
            const data = res.data.profileData[0][0];
            setProfileData(data);
            setEditFields({
                address: data.address || "",
                email: data.email || "",
                phone: data.phone || ""
            });
        } catch (error) {
            console.log("API Error:", error);
        }
    };

    const handleFetchDeptName = async () => {
        try {
            const res = await departmentName();
            setDeptName(res.data.deptName);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        handleGetProfileData();
        handleFetchDeptName();
    }, []);

    const handleEditClick = () => {
        setEditMode(true);
    };

    const handleCancel = () => {
        setEditFields({
            address: profileData.address || "",
            email: profileData.email || "",
            phone: profileData.phone || ""
        });
        setEditMode(false);
    };

    const handleChange = (e) => {
        setEditFields({ ...editFields, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            console.log(editFields);
            await updateProfile(editFields);
            setProfileData({ ...profileData, ...editFields });
            setEditMode(false);
            toast.success("Profile Updated");
        } catch (error) {
            toast.warn("Failed to update profile");
        }
        setLoading(false);
    };

    return (
        <>
            <NavigationBar loginState='on' />
            <section className="dashboard-container">
                <div className="container-header">
                    <CgProfile size={40} />
                    <h1>Profile</h1>
                </div>
                <div className="profile-photo">
                    <img src="/1.png" alt="" />
                </div>
                <div className="profile-container">
                    <div className="profile-info"><h2>Employee ID </h2> <p>{profileData.id}</p></div>
                    <div className="profile-info"><h2>Name </h2> <p>{profileData.name}</p></div>
                    <div className="profile-info"><h2>Address </h2> {editMode ? <input name="address" value={editFields.address} onChange={handleChange} /> : <p>{profileData.address}</p>}</div>
                    <div className="profile-info"><h2>Date Joined </h2> <p>{profileData.date_joined?.slice(0, 10)}</p></div>
                    <div className="profile-info"><h2>DOB </h2> <p>{profileData.date_of_birth?.slice(0, 10)}</p></div>
                    <div className="profile-info"><h2>Department ID </h2> <p>{profileData.department_id}</p></div>
                    <div className="profile-info"><h2>Department Name </h2> <p>{deptName}</p></div>
                    <div className="profile-info"><h2>Position </h2> <p>{profileData.position}</p></div>
                    <div className="profile-info"><h2>Gender </h2> <p>{profileData.gender}</p></div>
                    <div className="profile-info"><h2>Email </h2> {editMode ? <input name="email" value={editFields.email} onChange={handleChange} /> : <p>{profileData.email}</p>}</div>
                    <div className="profile-info"><h2>Phone </h2> {editMode ? <input name="phone" value={editFields.phone} onChange={handleChange} /> : <p>{profileData.phone}</p>}</div>
                    <div className="profile-info"><h2>Status </h2> <p>{profileData.status}</p></div>
                    <div className="profile-info" style={{ justifyContent: 'flex-end', borderBottom: 'none' }}>
                        {editMode ? (
                            <>
                                <button onClick={handleSave} disabled={loading} style={{ marginRight: '1rem', background: '#26a744', color: 'white', border: 'none', borderRadius: '6px', padding: '0.5rem 1.2rem', fontWeight: 'bold', cursor: 'pointer' }}>{loading ? 'Saving...' : 'Save'}</button>
                                <button onClick={handleCancel} style={{ background: '#ff1f35', color: 'white', border: 'none', borderRadius: '6px', padding: '0.5rem 1.2rem', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
                            </>
                        ) : (
                            <button onClick={handleEditClick} style={{ background: '#007bff', color: 'white', border: 'none', borderRadius: '6px', padding: '0.5rem 1.2rem', fontWeight: 'bold', cursor: 'pointer' }}>Edit</button>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}