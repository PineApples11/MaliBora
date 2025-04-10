import React, { useState } from 'react';

function CustomerLoanForm() {
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

console.log(getCurrentDateTime());

  const [formData, setFormData] = useState({
    amount: '',
    customer_id: 1,
    interest_rate: 15,
    status: 'pending',
    issued_date: getCurrentDateTime(),
    due_date: getCurrentDateTime(),
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
      const response =await fetch("http://127.0.0.1:5555/loan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(error => console.log("Error:", error));
//       const response = await fetch('http://localhost:5555/loans', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });
// console.log (formData)
//       const data = await response.json();

     //if (!response.ok) {
        //setError(data.error || 'Something went wrong.');
     // } else {
        //setSuccessMessage('Loan request submitted successfully.');
        
        
      //}
    } catch (e) {
      setError('Failed to submit loan request. Please try again later.');
      console.error('Error submitting loan request:', e);
    }
  }

  return (
    <div className="loan-form" style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2>Customer Loan Form</h2>

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
          <label htmlFor="interest_rate">Interest Rate (%):</label>
          <input
            type="number"
            name="interest_rate"
            id="interest_rate"
            value={formData.interest_rate}
            readOnly
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              backgroundColor: '#f0f0f0',
              cursor: 'not-allowed',
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Submit Loan Request
        </button>
      </form>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>Error: {error}</p>}
      {successMessage && <p style={{ color: 'green', marginTop: '10px' }}>{successMessage}</p>}
    </div>
  );
}

export default CustomerLoanForm;
