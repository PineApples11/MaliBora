import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/staff/dashboard";
import Customers from "./components/staff/customers";
import Loans from "./components/staff/loans";
import Repayments from "./components/staff/repayments";
import Savings from "./components/staff/savings";
import Navbar from "./components/staff/navbar";

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
