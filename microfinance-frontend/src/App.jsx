<<<<<<< HEAD
import React from "react";
=======
// src/App.jsx
>>>>>>> 49b61567851c6e59759180f0a551d21ee1bc9353
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import CustomerDisplay from './Customer/CustomerDisplay';
import SignUp from './CustomerLogs/Signup';
import Login from './CustomerLogs/Login';
import CustomerTransactionForm from './Customer/CustomerTransactionForm';
import CustomerLoanForm from './Customer/CustomerLoanForm';
import CustomerRepaymentsForm from './Customer/CustomerRepayments';
import Home from './Home';
import Choice from './choice/Choice';
import Staff from './Staff/staff.jsx';
import Admin from './Admin/Admin.jsx';
import StaffLogin from './Staff/stafflogin.jsx';

import './App.css';



function App() {
  return (
<<<<<<< HEAD
    <Router>  {/* Wrap Routes with Router */}
=======
    <Router>
>>>>>>> 49b61567851c6e59759180f0a551d21ee1bc9353
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/choice" element={<Choice />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/stafflogin" element={<StaffLogin />} />
        <Route path="/customer-homepage" element={<CustomerDisplay />} />
        <Route path="/customer-repayments" element={<CustomerRepaymentsForm />} />
        <Route path="/customer-transactions" element={<CustomerTransactionForm />} />
        <Route path="/customer-loans" element={<CustomerLoanForm />} />
        <Route path="/staff/*" element={<Staff />} />
        <Route path="/admin/*" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
