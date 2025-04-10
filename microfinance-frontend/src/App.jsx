import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import './App.css'
import CustomerDisplay from './Customer/CustomerDisplay'
import SignUp from './SigninsLoginsLogouts/Signup'
import Login from './SigninsLoginsLogouts/Login'
import Homepage from './SigninsLoginsLogouts/Homepage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Homepage />} />
      </Routes>
      {/* <CustomerDisplay /> */}
    </Router>
  )
}

export default App
