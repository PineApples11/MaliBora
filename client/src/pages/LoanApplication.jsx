import React, { useState } from 'react';

export default function LoanApplication() {
  const [formData, setFormData] = useState({ amount: '', loan_duration: '' });
  const [response, setResponse] = useState(null);

  const handleChange = (e) => {
    // Convert numeric values if necessary
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Convert fields to proper types (if needed)
    const submission = {
      amount: parseFloat(formData.amount),
      loan_duration: parseInt(formData.loan_duration, 10)
    };

    const res = await fetch('http://localhost:5000/api/loan/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',  // ensures cookies or session info is sent
      body: JSON.stringify(submission)
    });
    const data = await res.json();
    setResponse(data);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">New Loan Application</h2>
        <p className="text-gray-500 mt-1">Fill in the details below to apply</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Loan Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="pl-8 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                placeholder="5000.00"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Duration (months)
            </label>
            <input
              type="number"
              name="loan_duration"
              value={formData.loan_duration}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
              placeholder="12"
              min="1"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          Submit Application
        </button>

        {response && (
          <div className={`mt-6 p-4 rounded-lg ${
            response.error ? 'bg-red-50 border border-red-200 text-red-700' 
            : 'bg-green-50 border border-green-200 text-green-700'
          }`}>
            {response.error ? '⚠️ ' : '✅ '}
            {response.error || response.message}
          </div>
        )}
      </form>
    </div>
  );

}
