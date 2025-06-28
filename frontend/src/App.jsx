import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from './layout/AppLayout';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LandingPage } from './pages/LandingPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { AdminHomePage } from './pages/AdminHomePage';
import { AdminEmployeesPage } from './pages/AdminEmployeesPage';
import { AdminDepartmentsPage } from './pages/AdminDepartmentsPage';
import { AdminPayrollPage } from './pages/AdminPayrollPage';
import { AdminAnalyticsPage } from './pages/AdminAnalyticsPage';
import { EmployeeHomePage } from './pages/EmployeeHomePage';
import "./App.css";
import { EmployeeAttHistory } from './pages/EmployeeAttHistory';
import { EmployeeSalHistory } from './pages/EmployeeSalHistory';
import { Profile } from './pages/Profile';

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "",
        element: <LandingPage />
      },
      {
        path: "/login",
        element: <RegistrationPage />
      },
      {
        path: "/admin",
        element: <AdminHomePage />
      },
      {
        path: "/admin/employees",
        element: <AdminEmployeesPage />
      },
      {
        path: "/admin/departments",
        element: <AdminDepartmentsPage />
      },
      {
        path: "/admin/payroll",
        element: <AdminPayrollPage />
      },
      {
        path: "/admin/analytics",
        element: <AdminAnalyticsPage />
      },
      {
        path: "/employee",
        element: <EmployeeHomePage />
      },
      {
        path: "/employee/att_history",
        element: <EmployeeAttHistory />
      },
      {
        path: "/employee/sal_history",
        element: <EmployeeSalHistory />
      },
      {
        path: "/employee/profile",
        element: <Profile />
      }
    ],
  },
])

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}

export default App;