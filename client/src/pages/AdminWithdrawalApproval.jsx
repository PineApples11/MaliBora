import React, { useEffect, useState } from 'react';

export default function AdminWithdrawalApproval() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Fetch pending withdrawal transactions on component mount.
  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/withdrawal-transactions', {
          method: 'GET',
          credentials: 'include'
        });
        const data = await res.json();
        if (res.ok) {
          setWithdrawals(data.withdrawals || []);
        } else {
          setMessage(data.error || 'Failed to fetch withdrawal requests.');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching withdrawals:', error);
        setMessage('An error occurred while fetching withdrawal requests.');
        setLoading(false);
      }
    };

    fetchWithdrawals();
  }, []);

  // Function to handle approval or rejection.
  const handleAction = async (transactionId, action) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/withdrawal-transaction/${transactionId}/${action}`,
        {
          method: 'PUT',
          credentials: 'include'
        }
      );
      const data = await res.json();
      if (res.ok) {
        setMessage(`Transaction #${transactionId} ${action}d successfully.`);
        // Remove the processed transaction from the list.
        setWithdrawals((prev) => prev.filter((t) => t.id !== transactionId));
      } else {
        setMessage(data.error || 'Failed to process the transaction.');
      }
    } catch (error) {
      console.error('Error processing transaction:', error);
      setMessage('An error occurred while processing the transaction.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <h2 className="text-3xl font-bold text-center mb-6">Pending Withdrawal Approvals</h2>
      {loading ? (
        <p className="text-center">Loading pending withdrawals...</p>
      ) : (
        <div className="max-w-4xl mx-auto">
          {withdrawals.length === 0 ? (
            <p className="text-center text-gray-600">No pending withdrawal requests.</p>
          ) : (
            <div className="grid gap-4">
              {withdrawals.map((transaction) => (
                <div key={transaction.id} className="bg-white p-4 rounded shadow">
                  <p>
                    <span className="font-semibold">Transaction ID:</span> {transaction.id}
                  </p>
                  <p>
                    <span className="font-semibold">Customer ID:</span> {transaction.customer_id}
                  </p>
                  <p>
                    <span className="font-semibold">Amount:</span> ${transaction.amount}
                  </p>
                  <p>
                    <span className="font-semibold">Reference:</span> {transaction.reference || 'N/A'}
                  </p>
                  <div className="mt-4 flex gap-4">
                    <button
                      onClick={() => handleAction(transaction.id, 'approve')}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(transaction.id, 'reject')}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {message && <p className="text-center mt-4 text-blue-500 font-medium">{message}</p>}
        </div>
      )}
    </div>
  );
}
