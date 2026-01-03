import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import CustomerDashboard from './Customer/CustomerDashboard.jsx'
import SignUp from './CustomerLogs/Signup'
import Login from './CustomerLogs/Login'
import CustomerTransactionForm from './Customer/CustomerTransactionForm'

import Home from './Home'
import CustomerRepaymentsForm from './Customer/CustomerRepayments'
import Staff from './Staff/staff.jsx'
// import { useState } from 'react'

// import './App.css'
import Admin from './Admin/Admin.jsx';
import CustomerLoansPage from './Customer/CustomerLoansPage.jsx'
import CustomerSavingsPage from './Customer/CustomerSavingsPage.jsx'




function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        <Route path="/customer-homepage" element={<CustomerDashboard />} />
        <Route path="/loans" element={<CustomerLoansPage />} />
        <Route path="/savings" element={<CustomerSavingsPage />} />

        <Route path="/staff-homepage" element={<CustomerDashboard />} />
        <Route path="/customer-repayments" element={<CustomerRepaymentsForm />} />
        <Route path="/customer-transactions" element={<CustomerTransactionForm />} />

        <Route path="/staff/*" element={<Staff />} />
        <Route path="/admin/*" element={<Admin />} />
      </Routes>
    </Router>   
    </>
  )
}

export default App
