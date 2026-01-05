import React, { useState } from 'react';
import "./LoanApplicationForm.css";

const LoanApplicationForm = () => {
  const [selectedCategory, setSelectedCategory] = useState('business');
  const [loanAmount, setLoanAmount] = useState('2,000,000');
  const [repaymentPeriod, setRepaymentPeriod] = useState('12');
  const [purpose, setPurpose] = useState('');

  const loanCategories = [
    { id: 'business', name: 'Business', icon: '💼', color: '#3b82f6' },
    { id: 'personal', name: 'Personal', icon: '👤', color: '#10b981' },
    { id: 'emergency', name: 'Emergency', icon: '🚨', color: '#ef4444' }
  ];

  const repaymentOptions = [
    { value: '3', label: '3 Months' },
    { value: '6', label: '6 Months' },
    { value: '12', label: '12 Months' },
    { value: '24', label: '24 Months' }
  ];

  const calculateMonthlyPayment = () => {
    const amount = parseFloat(loanAmount.replace(/,/g, ''));
    const months = parseInt(repaymentPeriod);
    const interestRate = 0.12; // 12% annual interest
    const monthlyRate = interestRate / 12;
    const payment = (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                   (Math.pow(1 + monthlyRate, months) - 1);
    return payment.toFixed(2);
  };

  return (
    <div className="loan-app-container">
      <header className="loan-header">
        <div className="header-left">
          <button
           className="back-btn"
           onClick={() => window.history.back()}
           >← Back to My Loans</button>
        </div>
        <div className="logo">MaliBora</div>
        <nav className="nav-menu">
          <a href="#" className="nav-link">Dashboard</a>
          <a href="#" className="nav-link active">Loans</a>
          <a href="#" className="nav-link">Savings</a>
          <a href="#" className="nav-link">Profile</a>
        </nav>
        <div className="header-right">
          <span className="notification-icon">🔔</span>
          <span className="user-avatar">👤</span>
        </div>
      </header>

      <div className="loan-content">
        <div className="loan-form-card">
          <h1 className="form-title">Apply for New Loan</h1>
          <p className="form-subtitle">
            Complete the application below to request funding. Our automated system will review your eligibility instantly.
          </p>

          <div className="progress-steps">
            <div className="step active">
              <div className="step-number">1</div>
              <div className="step-info">
                <div className="step-title">Loan Details</div>
                <div className="step-subtitle">Amount & Purpose</div>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-info">
                <div className="step-title">Documents</div>
                <div className="step-subtitle">ID & Business</div>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-info">
                <div className="step-title">Review</div>
                <div className="step-subtitle">Confirm & Submit</div>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Select Loan Category</h3>
            <div className="category-grid">
              {loanCategories.map((category) => (
                <button
                  key={category.id}
                  className={`category-card ${selectedCategory === category.id ? 'selected' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                  style={{ '--category-color': category.color }}
                >
                  <div className="category-icon" style={{ backgroundColor: category.color }}>
                    {category.icon}
                  </div>
                  <div className="category-name">{category.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="form-section">
            <label className="form-label">Loan Amount (TZS)</label>
            <input
              type="text"
              className="form-input"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
            />
            <div className="input-hint">
              <span>Min: 10,000 TZS</span>
              <span>Max: 10,000,000 TZS</span>
            </div>
          </div>

          <div className="form-section">
            <label className="form-label">Repayment Period</label>
            <div className="period-buttons">
              {repaymentOptions.map((option) => (
                <button
                  key={option.value}
                  className={`period-btn ${repaymentPeriod === option.value ? 'active' : ''}`}
                  onClick={() => setRepaymentPeriod(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-section">
            <label className="form-label">Purpose of Loan</label>
            <textarea
              className="form-textarea"
              placeholder="Please describe briefly how you plan to use this loan..."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              rows="4"
            />
          </div>

          <div className="help-section">
            <div className="help-icon">ℹ️</div>
            <div className="help-text">
              <strong>Need Help?</strong>
              <p>Our support team is available to assist you with your application.</p>
              <a href="#">Chat with Support</a>
            </div>
          </div>

          <div className="form-actions">
            <button className="cancel-btn">Cancel</button>
            <button className="next-btn">Next Step →</button>
          </div>
        </div>

        <div className="loan-sidebar">
          <div className="summary-card">
            <h3 className="summary-title">REPAYMENT SUMMARY</h3>
            
            <div className="summary-item">
              <span className="summary-label">Principal Amount:</span>
              <span className="summary-value">2,000,000 TZS</span>
            </div>

            <div className="summary-item">
              <span className="summary-label">Interest Rate:</span>
              <span className="summary-value">12% / yr</span>
            </div>

            <div className="summary-item">
              <span className="summary-label">Duration:</span>
              <span className="summary-value">12 Months</span>
            </div>

            <div className="monthly-payment">
              <span className="payment-label">Estimated Monthly Payment</span>
              <span className="payment-amount">{calculateMonthlyPayment().toLocaleString()} TZS</span>
            </div>

            <div className="info-note">
              <span>ℹ️</span>
              <p>This is an estimate. Final interest rate may depend on your credit history.</p>
            </div>
          </div>

          <div className="amount-deposit-card">
            <h4>Amount to Deposit</h4>
            <input
              type="text"
              className="deposit-input"
              placeholder="0.00"
              defaultValue="TZS"
            />
            <div className="deposit-amounts">
              <button className="deposit-btn">+ 10,000</button>
              <button className="deposit-btn">+ 50,000</button>
              <button className="deposit-btn">+ 100,000</button>
            </div>
            <div className="phone-input-group">
              <label>Phone Number</label>
              <input
                type="text"
                placeholder="+255 712 345 678"
                className="phone-input"
              />
            </div>
            <button className="confirm-deposit-btn">Confirm</button>
            <p className="deposit-note">
              By clicking confirm, you agree to the terms...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanApplicationForm;