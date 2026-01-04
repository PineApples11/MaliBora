import  { useState } from 'react';
import "./LoanRepayment.css"
import { useNavigate } from 'react-router-dom';

const RepayLoan = () => {
  const [amount, setAmount] = useState('150,000');
  const [paymentMethod, setPaymentMethod] = useState('mobile');
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate();

  return (
    
     

      <div className="repay-loan-container">
        <div className="main-content">
          <div className="header">
            <button
                className="back-button"
                onClick={() => navigate("/customer-homepage")}
                >
                ← Back to Dashboard
                </button>

            <h1>Repay Loan</h1>
            <p className="subtitle">
              Complete your loan repayment securely. Select your active loan and preferred payment
              method below.
            </p>
          </div>

          <div className="form-section">
            <div className="step">
              <span className="step-number">1</span>
              <h3>Select Active Loan</h3>
            </div>
            
            <div className="loan-selector">
              <div className="loan-option selected">
                <input type="radio" name="loan" id="loan1" checked readOnly />
                <label htmlFor="loan1">
                  <span className="loan-name">Business Expansion Loan (Balance: 1,500,000 TZS)</span>
                </label>
              </div>
              <div className="loan-meta">
                <span className="dot"></span>
                <span>Next due date: Oct 25, 2023</span>
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="step">
              <span className="step-number">2</span>
              <h3>Enter Amount</h3>
            </div>
            
            <div className="amount-input-wrapper">
              <div className="amount-display">
                <span className="currency">TZS</span>
                <input 
                  type="text" 
                  className="amount-input" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="amount-options">
                <button className="amount-btn">Pay Minimum Due (10%)</button>
                <button className="amount-btn">Pay 50%</button>
                <button className="amount-btn">Clear Full Balance</button>
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="step">
              <span className="step-number">3</span>
              <h3>Payment Method</h3>
            </div>
            
            <div className="payment-methods">
              <div 
                className={`payment-card ${paymentMethod === 'mobile' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('mobile')}
              >
                <input type="radio" name="payment" checked={paymentMethod === 'mobile'} readOnly />
                <div className="payment-info">
                  <div className="payment-icon mobile-icon">📱</div>
                  <div>
                    <div className="payment-title">Mobile Money</div>
                    <div className="payment-desc">Pay with Mobile Money (Tigo)</div>
                  </div>
                </div>
              </div>

              <div 
                className={`payment-card ${paymentMethod === 'savings' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('savings')}
              >
                <input type="radio" name="payment" checked={paymentMethod === 'savings'} readOnly />
                <div className="payment-info">
                  <div className="payment-icon wallet-icon">💰</div>
                  <div>
                    <div className="payment-title">Savings Wallet</div>
                    <div className="payment-desc">Use your wallet (3M TZS)</div>
                  </div>
                </div>
              </div>

              <div 
                className={`payment-card ${paymentMethod === 'bank' ? 'selected' : ''}`}
                onClick={() => setPaymentMethod('bank')}
              >
                <input type="radio" name="payment" checked={paymentMethod === 'bank'} readOnly />
                <div className="payment-info">
                  <div className="payment-icon bank-icon">🏦</div>
                  <div>
                    <div className="payment-title">Bank Transfer</div>
                    <div className="payment-desc">Transfer bank via CRDB/NMB</div>
                  </div>
                </div>
              </div>
            </div>

            {paymentMethod === 'mobile' && (
              <div className="phone-input-section">
                <label htmlFor="phone">Phone Number</label>
                <input 
                  type="text" 
                  id="phone"
                  className="phone-input"
                  placeholder="07XX XXX XXX"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <p className="input-help">
                  You will receive a prompt on your device to complete the transaction
                </p>
              </div>
            )}
          </div>

          <button className="confirm-button">
            🔒 Confirm Payment of 150,000 TZS
          </button>
        </div>

        <div className="sidebar">
          <div className="loan-snapshot">
            <h3>Loan Snapshot</h3>
            
            <div className="snapshot-item">
              <span className="label">Total Loan</span>
              <span className="value">2,000,000 TZS</span>
            </div>
            
            <div className="snapshot-item">
              <span className="label">Amount Paid</span>
              <span className="value paid">800,000 TZS</span>
            </div>
            
            <div className="snapshot-item">
              <span className="label">Remaining Balance</span>
              <span className="value balance">1,200,000 TZS</span>
            </div>

            <div className="progress-section">
              <div className="progress-label">
                <span>Progress</span>
                <span className="percentage">48%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: '48%'}}></div>
              </div>
            </div>

            <div className="security-badge">
              <span className="shield-icon">🛡️</span>
              <div>
                <div className="security-title">Secure Transaction</div>
                <div className="security-text">
                  Your payment is processed securely via SSL encryption. Confirmation is instant.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    
  );
};

export default RepayLoan;