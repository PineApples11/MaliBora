import React, { useState } from "react";
import StaffList from "./StaffList";
import Customers from "./Customers";
import LoanRequests from "./LoanRequests";

const Dashboard = () => {
  const [view, setView] = useState("staff");

  const handleLogout = () => {
    
    alert("Logged out successfully!");
    
    window.location.href = "/";
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <nav>
        <button onClick={() => setView("staff")}>Staff List</button>
        <button onClick={() => setView("customers")}>Customer List</button>
        <button onClick={() => setView("loans")}>Loan Requests</button>
        <button onClick={handleLogout}>Logout</button>
      </nav>

      <hr />

      <div>
        {view === "staff" && <StaffList />}
        {view === "customers" && <Customers />}
        {view === "loans" && <LoanRequests />}
      </div>
    </div>
  );
};

export default Dashboard;
