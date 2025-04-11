import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import './App.css'
import CustomerDisplay from './Customer/CustomerDisplay'
import SignUp from './CustomerLogs/Signup'
import Login from './CustomerLogs/Login'
import CustomerTransactionForm from './Customer/CustomerTransactionForm'
import CustomerLoanForm from './Customer/CustomerLoanForm'

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/customer-repayments" element={<CustomerTransactionForm />} />
        <Route path="/customer-loans" element={<CustomerLoanForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/customer-homepage" element={<CustomerDisplay />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
