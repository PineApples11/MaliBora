import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import CustomerDashboard from './Customer/CustomerDashboard.jsx'
import SignUp from './CustomerLogs/Signup'
import Login from './CustomerLogs/Login'
import CustomerTransactionForm from './Customer/CustomerTransactionForm'
import CustomerLoanForm from './Customer/CustomerLoanForm'
import Home from './Home'
import CustomerRepaymentsForm from './Customer/CustomerRepayments'
import Staff from './Staff/staff.jsx'
// import { useState } from 'react'

// import './App.css'
import Admin from './Admin/Admin.jsx';
import Dashboard from './Staff/dashboard.jsx'



function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/customer-homepage" element={<CustomerDashboard />} />
        <Route path="/staff-homepage" element={<CustomerDashboard />} />
        <Route path="/customer-repayments" element={<CustomerRepaymentsForm />} />
        <Route path="/customer-transactions" element={<CustomerTransactionForm />} />
        <Route path="/customer-loans" element={<CustomerLoanForm />} />
        <Route path="/staff/*" element={<Staff />} />
        <Route path="/admin/*" element={<Admin />} />
      </Routes>
    </Router>   
    </>
  )
}

export default App
