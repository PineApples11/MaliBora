import React, { useEffect, useState } from 'react';

export default function LoanApproval() {
  const [pendingLoans, setPendingLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

  // Fetch pending loans on mount
  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/loans?status=pending', {
          method: 'GET',
          credentials: 'include',
        });
        const data = await res.json();
        setPendingLoans(data.loans || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching loans:', error);
        setLoading(false);
      }
    };

    fetchLoans();
  }, []);

  const handleAction = async (loanId, action) => {
    try {
      const res = await fetch(`http://localhost:5000/api/loan/${loanId}/manage`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: action }),
      });

      const data = await res.json();
      if (res.ok) {
        setActionMessage(`Loan #${loanId} ${action} successfully`);
        setPendingLoans(prev => prev.filter(loan => loan.id !== loanId));
      } else {
        setActionMessage(data.error || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Action error:', error);
      setActionMessage('Error occurred while processing loan.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <h2 className="text-3xl font-bold mb-6 text-center">Pending Loan Approvals</h2>

      {loading ? (
        <p className="text-center">Loading loans...</p>
      ) : pendingLoans.length === 0 ? (
        <p className="text-center text-gray-600">No pending loans.</p>
      ) : (
        <div className="grid gap-4 max-w-4xl mx-auto">
          {pendingLoans.map((loan) => (
            <div key={loan.id} className="bg-white p-4 shadow rounded">
              <p><strong>Loan ID:</strong> {loan.id}</p>
              <p><strong>Customer ID:</strong> {loan.customer_id}</p>
              <p><strong>Amount:</strong> ${loan.amount}</p>
              <p><strong>Interest Rate:</strong> {loan.interest_rate}%</p>
              <p><strong>Duration:</strong> {loan.loan_duration} months</p>

              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => handleAction(loan.id, 'approved')}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleAction(loan.id, 'rejected')}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {actionMessage && (
        <div className="mt-6 text-center text-blue-600 font-medium">{actionMessage}</div>
      )}
    </div>
  );
}
