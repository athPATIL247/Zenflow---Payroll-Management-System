import { useState } from "react";
import "../styling/RegistrationPage.css";
import { loginUser } from "../service/api";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from "react";

export const RegistrationPage = () => {
    const navigate = useNavigate();
    const [active, setActive] = useState("employee");
    const [loginData, setLoginData] = useState({
        employeeID: "",
        password: ""
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setLoginData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const clearPasswordField = () => {
        setLoginData({ ...loginData, password: "" });
    }

    useEffect(() => {
        clearPasswordField();
    }, [active]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        console.log({ role: active, employeeID: loginData.employeeID, password: loginData.password });
        try {
            const res = await loginUser({ role: active, employeeID: loginData.employeeID, password: loginData.password });
            if (res.data.status === "success") {
                toast.success("Login Successful");
                active === 'employee' ? navigate("/employee") : navigate("/admin");
            }
            clearPasswordField();
        } catch (error) {
            clearPasswordField();
            toast.error("Invalid Credentials");
            // console.log("Error Logging In");
        }
    }

    return (
        <section className="registration-container">
            <div className="login-box">
                <div className="login-header">Log In</div>
                <div className="sel-bar">
                    <h3
                        className={active === "employee" ? "active" : ""}
                        onClick={() => setActive("employee")}
                    >
                        Employee
                    </h3>
                    <h3
                        className={active === "admin" ? "active" : ""}
                        onClick={() => setActive("admin")}
                    >
                        Admin
                    </h3>
                </div>
                <form>
                    <p>ID</p>
                    <input
                        type="number"
                        id="employeeID"
                        value={loginData.employeeID}
                        onChange={handleChange}
                    />
                    <p>Password</p>
                    <input
                        type="password"
                        id="password"
                        value={loginData.password}
                        onChange={handleChange}
                    />
                    <button type="submit" onClick={(e) => handleFormSubmit(e)}>LogIn</button>
                </form>
            </div>
        </section>
    );
};
