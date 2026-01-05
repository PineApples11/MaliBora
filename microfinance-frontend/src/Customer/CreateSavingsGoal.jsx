import React, { useState, useEffect } from 'react';
import './CreateSavingsGoal.css';

const CreateSavingsGoal = () => {
  const [goalName, setGoalName] = useState('');
  const [category, setCategory] = useState('General Savings');
  const [selectedIcon, setSelectedIcon] = useState('💰');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [initialDeposit, setInitialDeposit] = useState('');
  const [recurringEnabled, setRecurringEnabled] = useState(false);
  const [frequency, setFrequency] = useState('Monthly');
  const [recurringAmount, setRecurringAmount] = useState('50000');
  const [fundingSource, setFundingSource] = useState('M-Pesa (*** 6901)');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [customerData, setCustomerData] = useState(null);

  const API_BASE_URL = 'http://localhost:5555';

  useEffect(() => {
    fetchCurrentCustomer();
  }, []);

  const fetchCurrentCustomer = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/me`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCustomerData(data);
      }
    } catch (err) {
      console.error('Error fetching customer:', err);
    }
  };

  const categories = [
    'General Savings',
    'Emergency Fund',
    'Vacation',
    'Home Purchase',
    'Education',
    'Retirement',
    'Vehicle',
    'Business',
    'Other'
  ];

  const icons = ['💰', '✈️', '👁️', '🏠', '➕'];

  const frequencies = ['Daily', 'Weekly', 'Monthly', 'Quarterly'];

  const calculateMonthlyContribution = () => {
    if (!targetAmount || !targetDate) return '0';
    
    const target = parseFloat(targetAmount.replace(/,/g, ''));
    const today = new Date();
    const goalDate = new Date(targetDate);
    const monthsDiff = Math.max(1, Math.round((goalDate - today) / (1000 * 60 * 60 * 24 * 30)));
    
    return (target / monthsDiff).toFixed(2);
  };

  const calculateProgress = () => {
    if (!targetAmount || !initialDeposit) return 0;
    const target = parseFloat(targetAmount.replace(/,/g, ''));
    const deposit = parseFloat(initialDeposit.replace(/,/g, ''));
    return Math.min(100, (deposit / target) * 100).toFixed(1);
  };

  const handleSubmit = async () => {
    if (!goalName || !targetAmount || !targetDate) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const savingsGoalData = {
        goal_name: goalName,
        category: category,
        icon: selectedIcon,
        target_amount: parseFloat(targetAmount.replace(/,/g, '')),
        target_date: targetDate,
        initial_deposit: initialDeposit ? parseFloat(initialDeposit.replace(/,/g, '')) : 0,
        recurring_enabled: recurringEnabled,
        frequency: recurringEnabled ? frequency : null,
        recurring_amount: recurringEnabled ? parseFloat(recurringAmount.replace(/,/g, '')) : null,
        funding_source: fundingSource
      };

      // This endpoint should be created in your backend
      const response = await fetch(`${API_BASE_URL}/savings-goal`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(savingsGoalData)
      });

      if (response.ok) {
        const result = await response.json();
        alert('Savings goal created successfully!');
        window.location.href = '/savings';
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create savings goal');
      }
    } catch (err) {
      console.error('Error creating savings goal:', err);
      setError('Unable to create savings goal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    const numValue = parseFloat(value.replace(/,/g, ''));
    return isNaN(numValue) ? '' : numValue.toLocaleString();
  };

  const handleAmountChange = (setter) => (e) => {
    const value = e.target.value.replace(/,/g, '');
    if (!isNaN(value) || value === '') {
      setter(value);
    }
  };

  return (
    <div className="savings-goal-container">
      <header className="savings-header">
        <div className="logo">MaliBora</div>
        <nav className="nav-menu">
          <a href="/dashboard" className="nav-link">Dashboard</a>
          <a href="/loans" className="nav-link">Loans</a>
          <a href="/savings" className="nav-link active">Savings</a>
          <a href="/profile" className="nav-link">Profile</a>
        </nav>
        <div className="header-icons">
          <span className="notification-icon">🔔</span>
          <span className="user-avatar">👤</span>
        </div>
      </header>

      <div className="savings-content">
        <div className="form-container">
          <button 
            className="back-button"
            onClick={() => window.history.back()}
          >
            ← Back to Savings Dashboard
          </button>

          <h1 className="page-title">Create New Savings Goal</h1>
          <p className="page-subtitle">
            Set a target, define your timeline, and start saving for your future.
          </p>

          {error && (
            <div className="error-banner">
              {error}
            </div>
          )}

          <div className="form-card">
            <div className="section-header">
              <span className="section-number">1</span>
              <h2 className="section-title">Goal Details</h2>
            </div>

            <div className="form-group">
              <label className="form-label">Goal Name</label>
              <input
                type="text"
                className="text-input"
                placeholder="e.g. New Laptop, Dream Wedding"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="select-input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Goal Icon</label>
                <div className="icon-selector">
                  {icons.map((icon) => (
                    <button
                      key={icon}
                      className={`icon-btn ${selectedIcon === icon ? 'selected' : ''}`}
                      onClick={() => setSelectedIcon(icon)}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="section-header mt-3">
              <span className="section-number">2</span>
              <h2 className="section-title">Financial Targets</h2>
            </div>

            <div className="form-group">
              <label className="form-label">Target Amount (TZS)</label>
              <input
                type="text"
                className="text-input amount-input"
                placeholder="TZS 500,000"
                value={formatCurrency(targetAmount)}
                onChange={handleAmountChange(setTargetAmount)}
              />
              <small className="input-hint">
                Leave empty if this goal doesn't have a specific limit.
              </small>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Target Date</label>
                <input
                  type="date"
                  className="text-input"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Initial Deposit (Optional)</label>
                <input
                  type="text"
                  className="text-input"
                  placeholder="TZS 0.00"
                  value={formatCurrency(initialDeposit)}
                  onChange={handleAmountChange(setInitialDeposit)}
                />
              </div>
            </div>

            <div className="section-header mt-3">
              <span className="section-number">3</span>
              <h2 className="section-title">Recurring Deposit</h2>
            </div>

            <div className="toggle-section">
              <div className="toggle-header">
                <div className="toggle-info">
                  <span className="toggle-icon">📈</span>
                  <div>
                    <div className="toggle-title">Grow your savings automatically</div>
                    <div className="toggle-subtitle">
                      Setting up a recurring deposit helps you reach your goal 2x faster on average
                    </div>
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={recurringEnabled}
                    onChange={(e) => setRecurringEnabled(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              {recurringEnabled && (
                <div className="recurring-details">
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Frequency</label>
                      <select
                        className="select-input"
                        value={frequency}
                        onChange={(e) => setFrequency(e.target.value)}
                      >
                        {frequencies.map((freq) => (
                          <option key={freq} value={freq}>{freq}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Recurring Amount</label>
                      <input
                        type="text"
                        className="text-input"
                        placeholder="TZS 50,000"
                        value={formatCurrency(recurringAmount)}
                        onChange={handleAmountChange(setRecurringAmount)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Funding Source</label>
                    <select
                      className="select-input"
                      value={fundingSource}
                      onChange={(e) => setFundingSource(e.target.value)}
                    >
                      <option value="M-Pesa (*** 6901)">M-Pesa (*** 6901)</option>
                      <option value="Bank Account">Bank Account</option>
                      <option value="Tigo Pesa">Tigo Pesa</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="form-actions">
              <button 
                className="cancel-button"
                onClick={() => window.history.back()}
              >
                Cancel
              </button>
              <button 
                className="create-button"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Goal →'}
              </button>
            </div>
          </div>
        </div>

        <div className="preview-sidebar">
          <div className="preview-card">
            <h3 className="preview-header">GOAL PREVIEW</h3>
            
            <div className="goal-preview">
              <div className="goal-icon-large">{selectedIcon}</div>
              <h4 className="goal-name-preview">
                {goalName || 'New Savings Goal'}
              </h4>
              <p className="goal-category-preview">{category}</p>
            </div>

            <div className="preview-details">
              <div className="preview-row">
                <span className="preview-label">Target</span>
                <span className="preview-value">
                  {targetAmount ? `${formatCurrency(targetAmount)} TZS` : '-'}
                </span>
              </div>
              <div className="preview-row">
                <span className="preview-label">Date</span>
                <span className="preview-value">
                  {targetDate || '-'}
                </span>
              </div>
              <div className="preview-row">
                <span className="preview-label">Recurring</span>
                <span className="preview-value">
                  {recurringEnabled ? `${formatCurrency(recurringAmount)} TZS/mo` : 'No'}
                </span>
              </div>
            </div>

            {targetAmount && targetDate && (
              <div className="suggested-contribution">
                <span className="contribution-icon">ℹ️</span>
                <div>
                  <div className="contribution-label">
                    By creating this goal, you agree to our Terms of Service for automated savings.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateSavingsGoal;