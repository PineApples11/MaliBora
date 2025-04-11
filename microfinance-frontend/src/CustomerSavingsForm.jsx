import React, { useState } from 'react';

function CustomerTransactionForm() {
  function getCurrentDateTime() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so we add 1
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDateTime;
  }

  const [formData, setFormData] = useState({
    customer_id: 1,
    type: 'deposit',
    amount: '',
    transaction_date: getCurrentDateTime(),
    interest_rate: 15,  // Assuming a default interest rate of 15%
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setError(null);
    setSuccessMessage('');

    try {
      const response = await fetch("http://127.0.0.1:5555/savings-transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccessMessage('Transaction Successful!');
        console.log(data);
      } else {
        throw new Error('Failed to process transaction');
      }
    } catch (e) {
      setError('Failed to submit transaction. Please try again later.');
      console.error('Error submitting transaction:', e);
    }
  }

  return (
    <div className="savings-form" style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2>Savings Transaction Form</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            name="amount"
            id="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            min="1"
            step="0.01"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="type">Transaction Type:</label>
          <select
            name="type"
            id="type"
            value={formData.type}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          >
            <option value="deposit">Deposit</option>
            <option value="withdrawal">Withdrawal</option>
          </select>
        </div>

        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: formData.type === 'deposit' ? '#007bff' : '#dc3545',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Submit {formData.type === 'deposit' ? 'Deposit' : 'Withdrawal'}
        </button>
      </form>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>Error: {error}</p>}
      {successMessage && (
        <p style={{ color: 'green', marginTop: '10px' }}>{successMessage}</p>
      )}
    </div>
  );
}

export default CustomerTransactionForm;
