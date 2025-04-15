import { Routes, Route } from 'react-router-dom';

import CustomerDisplay from './Customer/CustomerDisplay'
import SignUp from './CustomerLogs/Signup'
import Login from './CustomerLogs/Login'
import CustomerTransactionForm from './Customer/CustomerTransactionForm'
import CustomerLoanForm from './Customer/CustomerLoanForm'
import Home from './Home'
import Choice from './choice/Choice'
import CustomerRepaymentsForm from './Customer/CustomerRepayments'
import Staff from './Staff/staff.jsx'
// import { useState } from 'react'

// import './App.css'
import Admin from './Admin/Admin.jsx';
import StaffLogin from './Staff/stafflogin.jsx';

import './App.css';

function App() {
  return (
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
  );
}

export default App;
