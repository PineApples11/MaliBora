import React, { useEffect, useState } from "react";

const LoanRequests = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5555/loan")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch loan requests");
        return res.json();
      })
      .then((data) => {
        setLoans(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleApprove = (id) => {
    fetch(`http://127.0.0.1:5555/loan/${id}/approve`, {
      method: "PATCH",
    }).then(() => {
      setLoans((prev) =>
        prev.map((loan) =>
          loan.id === id ? { ...loan, status: "approved" } : loan
        )
      );
    });
  };

  const handleDeny = (id) => {
    fetch(`http://127.0.0.1:5555/loan/${id}/deny`, {
      method: "PATCH",
    }).then(() => {
      setLoans((prev) =>
        prev.map((loan) =>
          loan.id === id ? { ...loan, status: "denied" } : loan
        )
      );
    });
  };

  return (
    <div>
      <h2>Loan Requests</h2>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      {!loading && !error && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer ID</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => (
              <tr key={loan.id}>
                <td>{loan.id}</td>
                <td>{loan.customer_id}</td>
                <td>KSH {loan.amount.toLocaleString()}</td>
                <td>{loan.status}</td>
                <td>{new Date(loan.due_date).toLocaleDateString()}</td>
                <td>
                  {loan.status === "pending" && (
                    <>
                      <button onClick={() => handleApprove(loan.id)}>Approve</button>
                      <button onClick={() => handleDeny(loan.id)}>Deny</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LoanRequests;
