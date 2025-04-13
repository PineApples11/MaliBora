import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./dashboard";
import Customers from "./customers";
import Loans from "./loans.jsx";
import Repayments from "./repayments";
import Savings from "./savings";
import Navbar from "./Navbar.jsx";
import "./staff.css";


const Staff = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="customers" element={<Customers />} />
        <Route path="loans" element={<Loans />} />
        <Route path="repayments" element={<Repayments />} />
        <Route path="savings" element={<Savings />} />
        <Route path="/" element={<Navigate to="dashboard" />} />
      </Routes>
    </>
  );
};

export default Staff;