import { useState } from 'react';

export default function LoanSettings() {
  const [interestRate, setInterestRate] = useState('');
  const [response, setResponse] = useState(null);

  const handleChange = (e) => {
    setInterestRate(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that the interest rate is a positive number
    const newRate = parseFloat(interestRate);
    if (isNaN(newRate) || newRate <= 0) {
      setResponse({ error: 'Please enter a valid interest rate greater than 0' });
      return;
    }

    const res = await fetch('http://localhost:5000/api/admin/loan-settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // include session cookies
      body: JSON.stringify({ interest_rate: newRate })
    });

    const data = await res.json();
    setResponse(data);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Update Loan Settings</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-4">
            Default Interest Rate (%):
            <input
              type="number"
              step="0.01"
              name="interest_rate"
              value={interestRate}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
              placeholder="e.g., 5.5"
              required
            />
          </label>
          <button type="submit" className="w-full bg-purple-500 text-white p-2 rounded">
            Update Settings
          </button>
        </form>
        {response && (
          <div className="mt-4 p-4 border rounded bg-gray-50">
            {response.error ? (
              <p className="text-red-500">{response.error}</p>
            ) : (
              <p className="text-green-600">{response.message}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
