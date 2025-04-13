import React, { useState } from 'react';

export default function SavingsTransaction() {
  const [depositData, setDepositData] = useState({ amount: '' });
  const [withdrawData, setWithdrawData] = useState({ amount: '' });
  const [depositResponse, setDepositResponse] = useState(null);
  const [withdrawResponse, setWithdrawResponse] = useState(null);

  const handleDepositChange = (e) => {
    setDepositData({ ...depositData, [e.target.name]: e.target.value });
  };

  const handleWithdrawChange = (e) => {
    setWithdrawData({ ...withdrawData, [e.target.name]: e.target.value });
  };

  const submitDeposit = async (e) => {
    e.preventDefault();
    const submission = {
      amount: parseFloat(depositData.amount)
    };

    const res = await fetch('http://localhost:5000/api/deposit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(submission)
    });
    const data = await res.json();
    setDepositResponse(data);
  };

  const submitWithdrawal = async (e) => {
    e.preventDefault();
    const submission = {
      amount: parseFloat(withdrawData.amount)
    };

    const res = await fetch('http://localhost:5000/api/withdraw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(submission)
    });
    const data = await res.json();
    setWithdrawResponse(data);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <h2 className="text-3xl font-bold mb-6">Savings Account Transactions</h2>

      {/* Deposit Section */}
      <div className="bg-white shadow-md rounded p-6 w-full max-w-md mb-8">
        <h3 className="text-xl font-semibold mb-4">Make a Deposit</h3>
        <form onSubmit={submitDeposit}>
          <label className="block mb-4">
            Amount to Deposit:
            <input
              type="number"
              name="amount"
              value={depositData.amount}
              onChange={handleDepositChange}
              placeholder="Enter deposit amount"
              step="0.01"
              className="w-full p-2 border rounded mt-1"
              required
            />
          </label>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Deposit
          </button>
        </form>
        {depositResponse && (
          <div className="mt-4 p-3 border rounded bg-gray-50">
            {depositResponse.error ? (
              <p className="text-red-500">{depositResponse.error}</p>
            ) : (
              <div>
                <p className="text-green-600">{depositResponse.message}</p>
                {depositResponse.balance && (
                  <p>New Balance: {depositResponse.balance}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Withdrawal Section */}
      <div className="bg-white shadow-md rounded p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Request a Withdrawal</h3>
        <form onSubmit={submitWithdrawal}>
          <label className="block mb-4">
            Amount to Withdraw:
            <input
              type="number"
              name="amount"
              value={withdrawData.amount}
              onChange={handleWithdrawChange}
              placeholder="Enter withdrawal amount"
              step="0.01"
              className="w-full p-2 border rounded mt-1"
              required
            />
          </label>
          <button type="submit" className="w-full bg-red-500 text-white p-2 rounded">
            Withdraw
          </button>
        </form>
        {withdrawResponse && (
          <div className="mt-4 p-3 border rounded bg-gray-50">
            {withdrawResponse.error ? (
              <p className="text-red-500">{withdrawResponse.error}</p>
            ) : (
              <p className="text-green-600">{withdrawResponse.message}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
