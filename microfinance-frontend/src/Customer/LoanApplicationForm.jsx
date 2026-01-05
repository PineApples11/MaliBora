import React, { useState, useEffect } from 'react';
import "./LoanApplicationForm.css";

const LoanApplicationForm = () => {
  const [selectedCategory, setSelectedCategory] = useState('business');
  const [loanAmount, setLoanAmount] = useState('2000000');
  const [repaymentPeriod, setRepaymentPeriod] = useState('12');
  const [purpose, setPurpose] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [customerData, setCustomerData] = useState(null);

  const API_BASE_URL = 'http://localhost:5555'; // Adjust port if needed

  // Fetch current customer data on component mount
  useEffect(() => {
    fetchCurrentCustomer();
  }, []);

  const fetchCurrentCustomer = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/current-customer`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCustomerData(data);
      } else {
        setError('Failed to fetch customer data');
      }
    } catch (err) {
      console.error('Error fetching customer:', err);
      setError('Unable to connect to server');
    }
  };

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
    
    if (isNaN(amount) || amount <= 0) return '0.00';
    
    const payment = (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                   (Math.pow(1 + monthlyRate, months) - 1);
    return payment.toFixed(2);
  };

  const handleSubmitLoan = async () => {
    setLoading(true);
    setError(null);

    try {
      // Calculate due date based on repayment period
      const dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() + parseInt(repaymentPeriod));

      const loanData = {
        principal_amount: parseFloat(loanAmount.replace(/,/g, '')),
        interest_rate: 12.0, // 12% annual interest
        loan_term_months: parseInt(repaymentPeriod),
        status: 'pending',
        due_date: dueDate.toISOString(),
        loan_category: selectedCategory,
        purpose: purpose
      };

      const response = await fetch(`${API_BASE_URL}/loan`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loanData)
      });

      if (response.ok) {
        const result = await response.json();
        alert('Loan application submitted successfully!');
        // Redirect to loans page or dashboard
        window.location.href = '/loans'; // Adjust based on your routing
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to submit loan application');
      }
    } catch (err) {
      console.error('Error submitting loan:', err);
      setError('Unable to submit loan application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    const numValue = parseFloat(value.replace(/,/g, ''));
    return isNaN(numValue) ? '0' : numValue.toLocaleString();
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/,/g, '');
    if (!isNaN(value) || value === '') {
      setLoanAmount(value);
    }
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
          <a href="/dashboard" className="nav-link">Dashboard</a>
          <a href="/loans" className="nav-link active">Loans</a>
          <a href="/savings" className="nav-link">Savings</a>
          <a href="/profile" className="nav-link">Profile</a>
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

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {customerData && (
            <div className="customer-info">
              <p><strong>Customer:</strong> {customerData.full_name}</p>
              <p><strong>Phone:</strong> {customerData.phone}</p>
            </div>
          )}

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
              value={formatCurrency(loanAmount)}
              onChange={handleAmountChange}
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
            <button 
              className="cancel-btn"
              onClick={() => window.history.back()}
            >
              Cancel
            </button>
            <button 
              className="next-btn"
              onClick={handleSubmitLoan}
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Application →'}
            </button>
          </div>
        </div>

        <div className="loan-sidebar">
          <div className="summary-card">
            <h3 className="summary-title">REPAYMENT SUMMARY</h3>
            
            <div className="summary-item">
              <span className="summary-label">Principal Amount:</span>
              <span className="summary-value">{formatCurrency(loanAmount)} TZS</span>
            </div>

            <div className="summary-item">
              <span className="summary-label">Interest Rate:</span>
              <span className="summary-value">12% / yr</span>
            </div>

            <div className="summary-item">
              <span className="summary-label">Duration:</span>
              <span className="summary-value">{repaymentPeriod} Months</span>
            </div>

            <div className="monthly-payment">
              <span className="payment-label">Estimated Monthly Payment</span>
              <span className="payment-amount">
                {parseFloat(calculateMonthlyPayment()).toLocaleString()} TZS
              </span>
            </div>

            <div className="info-note">
              <span>ℹ️</span>
              <p>This is an estimate. Final interest rate may depend on your credit history.</p>
            </div>
          </div>

          <div className="amount-deposit-card">
            <h4>Savings Information</h4>
            <p className="savings-info">
              Current Savings Balance: <strong>{customerData?.savings_balance?.toLocaleString() || '0'} TZS</strong>
            </p>
            <p className="savings-note">
              Having sufficient savings may improve your loan approval chances and interest rates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanApplicationForm;