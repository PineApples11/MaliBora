import React, { useState } from 'react';

export default function LoanRepayment() {
  const [formData, setFormData] = useState({
    loan_id: '',
    amount: '',
    payment_method: '',
    reference: ''
  });
  const [response, setResponse] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // If applicable convert loan_id and amount to numeric types
    const submission = {
      loan_id: parseInt(formData.loan_id, 10),
      amount: parseFloat(formData.amount),
      payment_method: formData.payment_method,
      reference: formData.reference
    };

    const res = await fetch('http://localhost:5000/api/repay-loan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(submission)
    });
    const data = await res.json();
    setResponse(data);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Loan Repayment</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-4">
            Loan ID:
            <input
              type="number"
              name="loan_id"
              value={formData.loan_id}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
              placeholder="Enter your Loan ID"
              required
            />
          </label>
          <label className="block mb-4">
            Repayment Amount:
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
              placeholder="Enter amount"
              step="0.01"
              required
            />
          </label>
          <label className="block mb-4">
            Payment Method (Optional):
            <input
              type="text"
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
              placeholder="e.g., bank transfer, cash"
            />
          </label>
          <label className="block mb-4">
            Reference (Optional):
            <input
              type="text"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
              placeholder="Enter reference ID"
            />
          </label>
          <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">
            Repay Loan
          </button>
        </form>
        {response && (
          <div className="mt-4 p-4 border rounded bg-gray-50">
            {response.error ? (
              <p className="text-red-500">{response.error}</p>
            ) : (
              <div>
                <p className="text-green-600">{response.message}</p>
                {response.remaining_due && (
                  <p className="mt-2">Remaining Due: {response.remaining_due}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
