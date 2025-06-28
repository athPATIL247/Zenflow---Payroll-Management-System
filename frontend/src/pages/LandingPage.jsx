import { NavigationBar } from "../components/NavigationBar";
import { Features } from "../components/Features";
import { ShapeDivider } from "../components/ShapeDivider";

export const LandingPage = () => {
    return (
        <>
            <NavigationBar loginState='off' />

            <div className="main-container">
                <h1>ZenRoll: Payroll Management System</h1>
                <h2>Streamline your payroll process with our comprehensive solution. Manage employees, track attendance, and process payroll efficiently.</h2>
            </div>

            <ShapeDivider />

            <Features />
        </>
    );
}