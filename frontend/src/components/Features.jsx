import { FeatureCard } from "../components/FeatureCard";
import "../styling/LandingPage.css";
import { BsPeopleFill } from "react-icons/bs";
import { FaClock } from "react-icons/fa6";
import { MdPayments } from "react-icons/md";

export const Features = () => {
    const featuresArray = [
        { icon: <BsPeopleFill size={45} />, title: "Employee Management", info: "Efficiently manage employee information, departments, and roles." },
        { icon: <FaClock size={45} />, title: "Attendance Tracking", info: "Track employee attendance and manage leave requests." },
        { icon: <MdPayments size={45} />, title: "Payroll Processing", info: "Automated salary calculations and payslip generation." }
    ]
    return <div className="features-container">
        <h2>Key Features</h2>
        <ul>
            {featuresArray.map((curr, indx) => {
                return <li key={indx}><FeatureCard icon={curr.icon} title={curr.title} info={curr.info} /></li>
            })}
        </ul>
    </div>
}