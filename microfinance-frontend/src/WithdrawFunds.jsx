import React, { useState } from 'react';
import './WithdrawFunds.css';
import { useNavigate } from 'react-router-dom';

const WithdrawDashboard = () => {
  
  const [amount, setAmount] = useState('0.00');
  const [selectedDestination, setSelectedDestination] = useState(null);
  

  const destinations = [
    { id: 'tigo', name: 'Tigo', subtitle: 'Instantly to mobile', icon: '📱', color: '#dc2626' },
    { id: 'tigopesa', name: 'Tigo Pesa', subtitle: 'Instantly to mobile', icon: '💳', color: '#3b82f6' },
    { id: 'bank', name: 'Bank Transfer', subtitle: '1-3 Business Days', icon: '🏦', color: '#10b981' }
  ];

  const quickAmounts = [10000, 50000, 100000];

  const handleQuickAmount = (value) => {
    setAmount(value.toFixed(2));
  };
  
  const navigate = useNavigate();
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="logo">
          <button className="beta-badge"
          onClick={() => navigate('/savings')}
          
          
          >Back To Savings</button>
        </div>
        <h2 className="page-title">Withdraw Funds</h2>
       
      </header>

      <div className="main-content">
        <div className="content-wrapper">
          <div className="withdraw-section">
            <div className="section-label">Available Funds</div>
            <h1 className="balance">450,000 TZS</h1>
            <p className="balance-subtitle">Select a withdrawal method and amount to proceed.</p>

            <div className="form-section">
              <div className="section-header">
                <span className="step-number">1</span>
                <h3>Select Destination</h3>
              </div>

              <div className="destination-grid">
                {destinations.map((dest) => (
                  <button
                    key={dest.id}
                    className={`destination-card ${selectedDestination === dest.id ? 'selected' : ''}`}
                    onClick={() => setSelectedDestination(dest.id)}
                    style={{ '--card-color': dest.color }}
                  >
                    <div className="destination-icon" style={{ backgroundColor: dest.color }}>
                      {dest.icon}
                    </div>
                    <div className="destination-info">
                      <div className="destination-name">{dest.name}</div>
                      <div className="destination-subtitle">{dest.subtitle}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="phone-input-section">
                <label>Phone Number / Account Number</label>
                <input
                  type="text"
                  className="phone-input"
                  placeholder="0755 123 456"
                  defaultValue="0755 123 456"
                />
              </div>

              <div className="section-header mt-4">
                <span className="step-number">2</span>
                <h3>Enter Amount</h3>
              </div>

              <div className="amount-input-wrapper">
                <span className="currency">TZS</span>
                <input
                  type="text"
                  className="amount-input"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="quick-amounts">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    className="quick-amount-btn"
                    onClick={() => handleQuickAmount(amt)}
                  >
                    {amt.toLocaleString()}
                  </button>
                ))}
                <button className="quick-amount-btn max-btn">Max</button>
              </div>

              <button className="confirm-btn">
                Confirm Withdrawal →
              </button>

              <p className="disclaimer">
                ⓘ Withdrawals to mobile money wallets are processed instantly. Banks take upto 3 business days. A nominal fee
                equivalent to 3% may be applied by operator. <a href="#">View Fees</a>
              </p>
            </div>
          </div>

          <div className="sidebar">
            <div className="transaction-summary">
              <h4>Transaction Summary</h4>
              <div className="summary-row">
                <span>Withdrawal Amount</span>
                <span>0.00 TZS</span>
              </div>
              <div className="summary-row">
                <span>Transaction Fee</span>
                <span>0.00 TZS</span>
              </div>
              <div className="summary-row total">
                <span>Total Deducted</span>
                <span>0.00 TZS</span>
              </div>
            </div>

            <div className="recent-withdrawals">
              <h4>Recent Withdrawals</h4>
              <div className="withdrawal-item">
                <div className="withdrawal-icon">💰</div>
                <div className="withdrawal-details">
                  <div className="withdrawal-name">M-Pesa Withdrawal</div>
                  <div className="withdrawal-date">Nov 28, 2024</div>
                </div>
                <div className="withdrawal-amount">-60,000</div>
              </div>
              <div className="withdrawal-item">
                <div className="withdrawal-icon">💳</div>
                <div className="withdrawal-details">
                  <div className="withdrawal-name">Bank Transfer</div>
                  <div className="withdrawal-date">Nov 25, 2024</div>
                </div>
                <div className="withdrawal-amount">-200,000</div>
              </div>
              <a href="#" className="view-history">VIEW FULL HISTORY →</a>
            </div>

            <div className="need-help">
              <div className="help-icon">💬</div>
              <div className="help-content">
                <h4>Need Help?</h4>
                <p>If you have issues withdrawing funds, please contact our support team.</p>
                <a href="#">Contact Support</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawDashboard;