import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import CustomerDashboard from './Customer/CustomerDashboard.jsx'
import SignUp from './CustomerLogs/Signup'
import Login from './CustomerLogs/Login'
import Home from './Home'
import Staff from './Staff/staff.jsx'
// import { useState } from 'react'

// import './App.css'
import Admin from './Admin/Admin.jsx';
import CustomerLoansPage from './Customer/CustomerLoansPage.jsx'
import CustomerSavingsPage from './Customer/CustomerSavingsPage.jsx'
import CustomerTransactionsPage from './Customer/CustomerTransactionsPage.jsx'
import StaffDashboard from './Staff/StaffDashboard.jsx'
import RepayLoan from './Customer/LoanRepayment.jsx'
import DepositSavings from './Customer/DepositSavings.jsx'
import WithdrawFunds from './WithdrawFunds.jsx'
import LoanApplicationForm from './Customer/LoanApplicationForm.jsx'
import CreateSavingsGoal from './Customer/CreateSavingsGoal.jsx'





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
        <Route path="/transactions" element={<CustomerTransactionsPage />} />
        <Route path="/repay" element={<RepayLoan />} />
        <Route path="/deposit-savings" element={<DepositSavings />} />
        <Route path="/withdraw" element={<WithdrawFunds />} />
        <Route path="/apply-loan" element={<LoanApplicationForm />} />
        <Route path="/create-savings" element={<CreateSavingsGoal />} />

        <Route path="/staff-homepage" element={<StaffDashboard />} />
 
        <Route path="/staff/*" element={<Staff />} />
        <Route path="/admin/*" element={<Admin />} />
      </Routes>
    </Router>   
    </>
  )
}

export default App
