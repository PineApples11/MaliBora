
// src/App.jsx
import { useState, useEffect } from 'react';
import {
  Routes,
  Route,
  BrowserRouter,
  Navigate // Added for redirection
} from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import Signup from './pages/Signup';
import Login from './pages/Login';
import AdminCreateUser from './pages/AdminCreateUser';
import LoanApplication from './pages/LoanApplication';
import LoanRepayment from './pages/LoanRepayment';
import SavingsTransaction from './pages/SavingsTransaction';
import LoanSettings from './pages/LoanSettings';
import LoanApproval from './pages/LoanApproval';
import AdminWithdrawalApproval from './pages/AdminWithdrawalApproval';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  // Check for logged-in user on initial load
  useEffect(() => {
    // Add validation for localStorage data
    const userData = localStorage.getItem('currentUser');
    
    if (userData && userData !== "undefined") {
      try {
        const user = JSON.parse(userData);
        setCurrentUser(user);
      } catch (error) {
        console.error("Failed to parse user data:", error);
        localStorage.removeItem('currentUser');
      }
    }
  }, []);
  useEffect(() => {
    console.log('Current user:', currentUser);
  }, [currentUser]);
  const handleLogout = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/logout', {
        method: 'GET',
        credentials: 'include',
      });
      if (res.ok) {
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/login"
          element={currentUser ? <Navigate to="/dashboard" replace /> : <Login setCurrentUser={setCurrentUser} />}
        />

        {/* Protected Routes */}
        <Route
          element={
            currentUser ? (
              <DashboardLayout currentUser={currentUser} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          {/* Common Route */}
          <Route path="/dashboard" element={<div>Dashboard Home</div>} />

          {/* Customer-only Routes */}
          <Route 
            path="/loan-application" 
            element={
              currentUser?.role === 'customer' 
                ? <LoanApplication /> 
                : <Navigate to="/dashboard" replace />
            }
          />
          <Route 
            path="/loan-repayment" 
            element={
              currentUser?.role === 'customer' 
                ? <LoanRepayment /> 
                : <Navigate to="/dashboard" replace />
            }
          />
          <Route 
            path="/savings-transaction" 
            element={
              currentUser?.role === 'customer' 
                ? <SavingsTransaction /> 
                : <Navigate to="/dashboard" replace />
            }
          />

          {/* Admin-only Routes */}
          <Route 
            path="/admin-create-user" 
            element={
              currentUser?.role === 'admin' 
                ? <AdminCreateUser /> 
                : <Navigate to="/dashboard" replace />
            }
          />
          <Route 
            path="/admin-withdrawals" 
            element={
              currentUser?.role === 'admin' 
                ? <AdminWithdrawalApproval /> 
                : <Navigate to="/dashboard" replace />
            }
          />
          <Route 
            path="/loan-settings" 
            element={
              currentUser?.role === 'admin' 
                ? <LoanSettings /> 
                : <Navigate to="/dashboard" replace />
            }
          />
          <Route 
            path="/loan-approvals" 
            element={
              currentUser?.role === 'admin' 
                ? <LoanApproval /> 
                : <Navigate to="/dashboard" replace />
            }
          />
        </Route>

        {/* Redirection Rules */}
        <Route
          path="/"
          element={<Navigate to={currentUser ? "/dashboard" : "/login"} replace />}
        />
        <Route
          path="*"
          element={<Navigate to={currentUser ? "/dashboard" : "/login"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;