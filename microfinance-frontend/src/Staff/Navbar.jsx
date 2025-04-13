import { NavLink } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-title">MaliBora</div>
      <div className="navbar-links">
        <NavLink to="/staff/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
          Dashboard
        </NavLink>
        <NavLink to="/staff/customers" className={({ isActive }) => (isActive ? "active" : "")}>
          Customers
        </NavLink>
        <NavLink to="/staff/loans" className={({ isActive }) => (isActive ? "active" : "")}>
          Loans
        </NavLink>
        <NavLink to="/staff/repayments" className={({ isActive }) => (isActive ? "active" : "")}>
          Repayments
        </NavLink>
        <NavLink to="/staff/savings" className={({ isActive }) => (isActive ? "active" : "")}>
          Savings
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;