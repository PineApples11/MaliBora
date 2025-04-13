import React from "react";
import { Routes, Route, NavLink } from "react-router-dom";

import StaffList from "./StaffList";
import CustomerList from "./CustomerList"
import LoanRequests from "./LoanRequest";


const Admin = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>

      <nav>
  <NavLink to="/admin/staff-list">Staff List</NavLink> |{" "}
  <NavLink to="/admin/customers">Customer List</NavLink> |{" "}
  <NavLink to="/admin/loan-requests">Loan Requests</NavLink> |{" "}
  <NavLink to="/">Logout</NavLink>
</nav>
      <hr />
      <Routes>
        <Route path="staff-list" element={<StaffList />} />
        <Route path="customers" element={<CustomerList />} />
        <Route path="loan-requests" element={<LoanRequests />} />
        <Route path="/" element={<p>Select an option from above.</p>} />
      </Routes>
    </div>
  );
};

export default Admin;