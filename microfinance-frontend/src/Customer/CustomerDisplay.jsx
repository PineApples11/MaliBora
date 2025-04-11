import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react"

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

   if (!customer) return 
   <>
      <p>You are Logged Out</p>
      <button type="button" onClick={handleLogout} >Login</button>
    </>; 
    return (
      <>
        <h1>{customer.full_name} Profile</h1>
        <p>id : {customer.id}</p>
        <p>full_name : {customer.full_name}</p>
        <p>national_id : {customer.national_id}</p>
        <p>savings balance : {customer.savings_balance}</p>
        <p>created at : {customer.created_at}</p>
        <p>admin id : {customer.admin_id}</p>

        <button type="button" onClick={handleLogout} >Logout</button>
        <button type="button" onClick={handleLoan} >Take a Loan</button>
        <button onClick={handleTransaction}>Transactions </button>
        <button onClick={handleRepayments}>Repayments</button>

        {loans && (
          <div>
            <h2>Your Loans</h2>
            {(() => {
              const customerLoans = loans.filter(loan => loan.customer_id === customer.id);

              return customerLoans.length > 0 ? (
                <ul>
                  {customerLoans.map(loan => (
                    <li key={loan.id}>
                      Amount: {loan.amount} | Status: {loan.status} | Interest rate: {loan.interest_rate}% | Issued Date: {loan.issued_date} | Due Date: {loan.due_date}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No loans found.</p>
              );
            })()}
          </div>
        )}


      {transactions && (
        <div>
          <h2>Your Transactions</h2>
          {(() => {
            const customerTransactions = transactions.filter(
              transaction => transaction.customer_id === customer.id
            );

            return customerTransactions.length > 0 ? (
              <ul>
                {customerTransactions.map(transaction => (
                  <li key={transaction.id}>
                    Amount: {transaction.amount} | Type: {transaction.type} | Transaction Date: {transaction.transaction_date}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No transactions found.</p>
            );
          })()}
        </div>
      )}


      {repayments && (
            <div>
              <h2>Your Repayments</h2>
              {(() => {
                  const customerRepayments = repayments.filter(
                    r => r.customer_id === customer.id
                  );
                  return customerRepayments.length > 0 ? (
                    <ul>
                      {customerRepayments.map(repayment => (
                        <li key={repayment.id}>
                          Amount: {repayment.amount} | Date Paid: {repayment.date_paid}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No repayments found.</p>
                  );
                })()}
            </div>
        )}
      </>
    )
  }
  
  export default CustomerDisplay