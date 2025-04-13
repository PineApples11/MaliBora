import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import "./customer.css";

function CustomerDisplay() {
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [loans, setLoans] = useState(null);
  const [transactions, setTransactions] = useState(null);
  const [repayments, setRepayments] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setCustomer(user);
    }
  }, []);

  useEffect(() => {
    fetch('http://127.0.0.1:5555/loan') 
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not OK');
        }
        return response.json();
      })
      .then(data => {
        setLoans(data)
      })
      .catch(err => {
        console.error('Error submitting transaction:', err);
      });
  }, []);

  useEffect(() => {
    fetch('http://127.0.0.1:5555/savings-transaction') 
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not OK');
        }
        return response.json();
      })
      .then(data => {
        setTransactions(data)
      })
      .catch(err => {
        console.error('Error submitting transaction:', err);
      });
  }, []);

  useEffect(() => {
    fetch('http://127.0.0.1:5555/repayment') 
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not OK');
        }
        return response.json();
      })
      .then(data => {
        setRepayments(data)
      })
      .catch(err => {
        console.error('Error submitting transaction:', err);
      });
  }, []);

  
  

  const handleLoan = () => {
    navigate('/customer-loans')
  }
  const handleTransaction = () => {
    navigate('/customer-transactions')
  }
  const handleRepayments = () => {
    navigate('/customer-repayments')
  }
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate('/login');
  };

   if (!customer) return (
    <div className="customer-container">
      <p>You are Logged Out</p>
      <button className="primary-btn" type="button" onClick={handleLogout}>Login</button>
    </div>
   ); 
   
   return (
    <div className="customer-container">
      <div className="profile-header">
        <h1>{customer.full_name}'s Profile</h1>
        <div className="profile-details">
          <p><strong>ID:</strong> {customer.id}</p>
          <p><strong>National ID:</strong> {customer.national_id}</p>
          <p><strong>Savings Balance:</strong> KES {customer.savings_balance}</p>
          <p><strong>Member Since:</strong> {new Date(customer.created_at).toLocaleDateString()}</p>
        </div>
        
        <div className="button-group">
          <button className="primary-btn" type="button" onClick={handleLoan}>Take a Loan</button>
          <button className="primary-btn" onClick={handleTransaction}>View Transactions</button>
          <button className="primary-btn" onClick={handleRepayments}>View Repayments</button>
          <button className="secondary-btn" type="button" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {loans && (
        <div className="data-section">
          <h2>Your Loans</h2>
          {(() => {
            const customerLoans = loans.filter(loan => loan.customer_id === customer.id);
            return customerLoans.length > 0 ? (
              <ul className="data-list">
                {customerLoans.map(loan => (
                  <li key={loan.id}>
                    <strong>Amount:</strong> KES {loan.amount} | 
                    <strong>Status:</strong> {loan.status} | 
                    <strong>Interest:</strong> {loan.interest_rate}% | 
                    <strong>Issued:</strong> {new Date(loan.issued_date).toLocaleDateString()} | 
                    <strong>Due:</strong> {new Date(loan.due_date).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-data">No loans found.</p>
            );
          })()}
        </div>
      )}


      {transactions && (
        <div className="data-section">
          <h2>Recent Transactions</h2>
          {(() => {
            const customerTransactions = transactions.filter(
              transaction => transaction.customer_id === customer.id
            );
            return customerTransactions.length > 0 ? (
              <ul className="data-list">
                {customerTransactions.map(transaction => (
                  <li key={transaction.id}>
                    <strong>Amount:</strong> KES {transaction.amount} | 
                    <strong>Type:</strong> {transaction.type} | 
                    <strong>Date:</strong> {new Date(transaction.transaction_date).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-data">No transactions found.</p>
            );
          })()}
        </div>
      )}


      {repayments && (
        <div className="data-section">
          <h2>Your Repayments</h2>
          {(() => {
            const customerRepayments = repayments.filter(
              r => r.customer_id === customer.id
            );
            return customerRepayments.length > 0 ? (
              <ul className="data-list">
                {customerRepayments.map(repayment => (
                  <li key={repayment.id}>
                    <strong>Amount:</strong> KES {repayment.amount} | 
                    <strong>Date Paid:</strong> {new Date(repayment.date_paid).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-data">No repayments found.</p>
            );
          })()}
        </div>
      )}
    </div>
    )
  }
  
  export default CustomerDisplay