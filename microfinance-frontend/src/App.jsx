import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import CustomerDisplay from './Customer/CustomerDisplay'
import SignUp from './CustomerLogs/Signup'
import Login from './CustomerLogs/Login'
import CustomerTransactionForm from './Customer/CustomerTransactionForm'
import CustomerLoanForm from './Customer/CustomerLoanForm'
import Home from './Home'
import Choice from './choice/Choice'
import CustomerRepaymentsForm from './Customer/CustomerRepayments'
// import { useState } from 'react'

import './App.css'
import CustomerLoanform from './CustomerLoanForm.jsx';
import CustomerSavingsForm from './CustomerSavingsForm';


function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/choice" element={<Choice />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/customer-homepage" element={<CustomerDisplay />} />
        <Route path="/customer-repayments" element={<CustomerRepaymentsForm />} />
        <Route path="/customer-transactions" element={<CustomerTransactionForm />} />
        <Route path="/customer-loans" element={<CustomerLoanForm />} />
      </Routes>
    </Router>
      
   
    </>
  )
}

export default App
