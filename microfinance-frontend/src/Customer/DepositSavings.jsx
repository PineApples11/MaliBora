import { useState } from 'react';
import './DepositSavings.css';
import { useNavigate } from 'react-router-dom';

const DepositSavings = () => {
  const [fundingSource, setFundingSource] = useState('mobile');
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+255 72 345 678');
  const [networkProvider, setNetworkProvider] = useState('Vodacom M-Pesa');
  const navigate = useNavigate();

  // Format number with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Handle amount input change
  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/,/g, '');
    if (!isNaN(value) || value === '') {
      setAmount(value);
    }
  };

  // Quick amount buttons
  const handleQuickAmount = (value) => {
    setAmount(value.toString());
  };

  // Handle deposit confirmation
  const handleConfirmDeposit = () => {
    // Add your deposit logic here
    console.log('Deposit confirmed:', {
      fundingSource,
      amount,
      phoneNumber,
      networkProvider
    });
  };

  return (
    <div className="deposit-savings-container">
      <div className="deposit-main-content">
        <button 
          className="back-to-dashboard"
          onClick={() => navigate('/savings')}
        >
          ← Back to Savings
        </button>

        <div className="deposit-header">
          <h1>Deposit Savings</h1>
          <p className="deposit-subtitle">Add funds securely to your savings account.</p>
        </div>

        <div className="deposit-form">
          <div className="funding-source-section">
            <label className="section-label">Funding Source</label>
            <div className="funding-options">
              <button 
                className={`funding-option ${fundingSource === 'mobile' ? 'active' : ''}`}
                onClick={() => setFundingSource('mobile')}
              >
                <span className="funding-icon">📱</span>
                <span className="funding-text">Mobile Money</span>
              </button>
              <button 
                className={`funding-option ${fundingSource === 'bank' ? 'active' : ''}`}
                onClick={() => setFundingSource('bank')}
              >
                <span className="funding-icon">🏦</span>
                <span className="funding-text">Bank Transfer</span>
              </button>
              <button 
                className={`funding-option ${fundingSource === 'card' ? 'active' : ''}`}
                onClick={() => setFundingSource('card')}
              >
                <span className="funding-icon">💳</span>
                <span className="funding-text">Card</span>
              </button>
            </div>
          </div>

          <div className="amount-section">
            <label className="section-label">Amount to Deposit</label>
            <div className="amount-input-container">
              <span className="currency-prefix">TZS</span>
              <input 
                type="text"
                className="amount-input-field"
                placeholder="0.00"
                value={amount ? formatNumber(amount) : ''}
                onChange={handleAmountChange}
              />
            </div>
            <div className="quick-amount-buttons">
              <button 
                className="quick-amount-btn"
                onClick={() => handleQuickAmount(10000)}
              >
                + 10,000
              </button>
              <button 
                className="quick-amount-btn"
                onClick={() => handleQuickAmount(50000)}
              >
                + 50,000
              </button>
              <button 
                className="quick-amount-btn"
                onClick={() => handleQuickAmount(100000)}
              >
                + 100,000
              </button>
            </div>
          </div>

          <div className="contact-info-section">
            <div className="input-group">
              <label className="input-label">Phone Number</label>
              <input 
                type="text"
                className="text-input"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Network Provider</label>
              <select 
                className="select-input"
                value={networkProvider}
                onChange={(e) => setNetworkProvider(e.target.value)}
              >
                <option value="Vodacom M-Pesa">Vodacom M-Pesa</option>
                <option value="Tigo Pesa">Tigo Pesa</option>
                <option value="Airtel Money">Airtel Money</option>
                <option value="Halotel">Halotel</option>
              </select>
            </div>
          </div>

          <button 
            className="confirm-deposit-btn"
            onClick={handleConfirmDeposit}
          >
            Confirm Deposit →
          </button>

          <p className="terms-text">
            By clicking confirm, you agree to the transaction terms. Read our current fee structure{' '}
            <a href="#" className="terms-link">here</a>.
          </p>
        </div>
      </div>

      <div className="deposit-sidebar">
        <div className="balance-card">
          <div className="balance-header">
            <span className="balance-icon">💰</span>
            <span className="balance-label">CURRENT BALANCE</span>
          </div>
          <div className="balance-amount">450,000 TZS</div>
          <div className="balance-note">Available for withdrawal</div>
        </div>

        <div className="info-card">
          <div className="info-row">
            <span className="info-label">Interest Rate</span>
            <span className="info-value">4.5% p.a</span>
          </div>
          <div className="info-row">
            <span className="info-label">Accrued Interest</span>
            <span className="info-value green">+1,550 TZS</span>
          </div>
        </div>

        <div className="security-info-card">
          <div className="security-header">
            <span className="security-icon">🛡️</span>
            <span className="security-title">Secure Transaction</span>
          </div>
          <p className="security-text">
            Your deposit is processed securely. Funds will reflect immediately upon payment confirmation from your mobile provider.
          </p>
        </div>

        <div className="help-card">
          <div className="help-title">Need Help?</div>
          <p className="help-text">
            Trouble making your deposit? Contact our support team.
          </p>
          <button className="contact-support-btn">Contact Support</button>
        </div>
      </div>
    </div>
  );
};

export default DepositSavings;