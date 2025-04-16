import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import "./customerdisplay.css";

function CustomerDisplay() {
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [loans, setLoans] = useState(null);
  const [transactions, setTransactions] = useState(null);
  const [repayments, setRepayments] = useState(null);
  const [anyLoans, setAnyLoans] = useState(false);
  const [activeLoans, setActiveLoans] = useState(false);
  const [activeTransactions, setActiveTransactions] = useState(false);
  const [activeRepayments, setActiveRepayments] = useState(false);

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

  useEffect(() => {
    if (loans && customer) {
      const hasApprovedLoan = loans.find(
        loan => loan.customer_id === customer.id && loan.status === "approved"
      )
      if (hasApprovedLoan) {
        setAnyLoans(true)
      } else {
        setAnyLoans(false)
      }
    }
    
  }, [loans, customer])

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
  const showLoans = () => {
    setActiveLoans(active => !active)
  }
  const showRepayments = () => {
    setActiveRepayments(active => !active)
  }
  const showTransactions = () => {
    setActiveTransactions(active => !active)
  }

   if (!customer) return (
    <div className="customer-container">
      <p>You are Logged Out</p>
      <button className="primary-btn" type="button" onClick={handleLogout}>Login</button>
    </div>
   ); 
   
   return (
      <div class="customer-display-body">
      <div class="app">
          <div className='xx'>
            <div class="app-header-logo">
              <div class="logo">
                <h1 class="logo-title">
                  <span>MALIBORA</span>
                </h1>
              </div>
            
            </div>
            <div class="app-header-navigation">
              <div class="tabs">
                <a href="#" className='dash-active'>
                  Dashboard
                </a>
                <a href="#" onClick={handleTransaction}>
                  Desposit/Withdrawal
                </a>
                <a href="#" onClick={handleLoan}>
                  Take a Loan
                </a>
                <a href="#" onClick={e => {
                          if (!anyLoans) {
                            e.preventDefault();
                            return;
                          }
                          handleRepayments()
                          }}>
                  Make a Repayment
                </a>
                
              </div>
            </div>
            <div class="app-header-actions">
              <button class="user-profile">
                <span>{customer.full_name}</span>
                <span>
                  <img src="https://assets.codepen.io/285131/almeria-avatar.jpeg" />
                </span>
              </button>
              <div class="log-tabs">
                <a href="#" onClick={handleLogout}>
                  Log Out
                </a>
                </div>
            </div>
	        </div>
          <div class="app-body">
	
		<div class="app-body-main-content" >
			<section class="service-section">
      <div class="transfer-section-header">
					<h2 onClick={showLoans}>Your Loans</h2>
					<div class="filter-options">
						<p>Empowering dreams, one loan at a time.</p>
					</div>
				</div>
        
				<div class="service-section-header">
					
				</div>
				<div class="mobile-only">
					<button class="flat-button">
						Toggle search
					</button>
				</div>
				
        {loans && (
  <div className="data-section" style={{display : activeLoans ? "none" : "block"}}>
    {(() => {
      const customerLoans = loans.filter(loan => loan.customer_id === customer.id);
      return customerLoans.length > 0 ? (
        <div className="loan-list">
          {customerLoans.map(loan => (
            <div key={loan.id} className="transfer">
              <div className="transfer-logo">
              {loan.status === "pending" ? (
              <img src="https://cdn-icons-png.flaticon.com/128/16265/16265301.png" alt="Loan Pending" />
            ) : loan.status === "approved" ? (
              <img src="https://cdn-icons-png.flaticon.com/128/16208/16208195.png" alt="Loan Approved" />
            ) : loan.status === "rejected" ? (
              <img src="https://cdn-icons-png.flaticon.com/128/11373/11373685.png" alt="Loan Rejected" />
            ) : null}
              </div>
              <dl className="transfer-details">
                <div>
                  <dt>{loan.status}</dt>
                </div>
                <div>
                  <dt>{loan.interest_rate}%</dt>
                  <dd>Interest rate</dd>
                </div>
                <div>
                  <dt>{new Date(loan.issued_date).toLocaleDateString()}</dt>
                  <dd>Issued date</dd>
                </div>
                <div>
                  <dt>{new Date(loan.due_date).toLocaleDateString()}</dt>
                  <dd>Due date</dd>
                </div>
              </dl>
              <div className="transfer-number">
                Kshs {loan.amount}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-data">No loans found.</p>
      );
    })()}
  </div>
)}
			</section>



			<section class="transfer-section">
				<div class="transfer-section-header">
					<h2 onClick={showTransactions}>Recent Transactions</h2>
					<div class="filter-options">
						<p>Smooth transactions. Stronger connections.</p>
					</div>
				</div>
				<div class="transfers">
        {transactions && (
  <div className="data-section" style={{display : activeTransactions ? "none" : "block"}}>
    {(() => {
              const customerTransactions = transactions.filter(
                transaction => transaction.customer_id === customer.id
              );
              return customerTransactions.length > 0 ? (
                <div className="transaction-list">
                  {customerTransactions.map(transaction => (
                    <div key={transaction.id} className="transfer">
                      <div className="transfer-logo">
                        {transaction.type === "deposit"? 
                        (<img
                          src="https://cdn-icons-png.flaticon.com/128/10998/10998135.png"
                          alt="Transaction"
                        />) : (
                          <img
                          src="https://cdn-icons-png.flaticon.com/128/13207/13207403.png"
                          alt="Transaction"
                        />
                        )}
                      </div>
                      <dl className="transfer-details">
                        <div>
                          <dt>{transaction.type}</dt>
                        </div>
                        <div>
                          <dt>{new Date(transaction.transaction_date).toLocaleDateString()}</dt>
                          <dd>Date payment</dd>
                        </div>
                      </dl>
                      <div className="transfer-number">
                        Kshs {transaction.amount}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-data">No transactions found.</p>
              );
            })()}
          </div>
        )}
					</div>		
			</section>

      <section class="payment-section">
      <div class="transfer-section-header">
					<h2 onClick={showRepayments}>Your Payments</h2>
					<div class="filter-options">
						<p>Clearing the way to your goals.</p>
					</div>
				</div>
				<div class="payment-section-header">
					
				</div>
				{repayments && (
              <div className="data-section" style={{display : activeRepayments ? "none" : "block"}}>
                {(() => {
                  const customerRepayments = repayments.filter(
                    r => r.customer_id === customer.id
                  );
                  return customerRepayments.length > 0 ? (
                    <div className="payments">
                      {customerRepayments.map(repayment => (
                        <div key={repayment.id} className="payment">
                          <div className="card gray">
                            <span>Repaid</span>
                            <span>{new Date(repayment.date_paid).toLocaleDateString()}</span>
                          </div>
                          <div className="payment-details">
                            <div>
                              <span>KES {repayment.amount}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-data">No repayments found.</p>
                  );
                })()}
              </div>
            )}

			</section>


		</div>
		<div class="app-body-sidebar">
	
		</div>
	</div>
</div>
      </div>
    )
  }
  
  export default CustomerDisplay