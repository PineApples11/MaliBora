import React, { useEffect, useState } from "react";
import "./customers.css";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCustomerId, setExpandedCustomerId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customerRes, loansRes] = await Promise.all([
          fetch("http://127.0.0.1:5555/customer"),
          fetch("http://127.0.0.1:5555/loan"),
        ]);

        if (!customerRes.ok || !loansRes.ok)
          throw new Error("Failed to fetch data");

        const customerData = await customerRes.json();
        const loansData = await loansRes.json();

        setCustomers(customerData);
        setLoans(loansData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggleDetails = (id) => {
    setExpandedCustomerId((prevId) => (prevId === id ? null : id));
  };

  const filteredCustomers = customers.filter((cust) =>
    cust.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="customers-page">
      <h1 className="page-title">Customer Management</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search by full name..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error-text">Error: {error}</p>}

      {!loading && !error && (
        <div className="table-container">
          <table className="customer-table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>National ID</th>
                <th>Phone</th>
                <th>Loans Taken</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((cust) => {
                const customerLoans = loans.filter(
                  (loan) => loan.customer_id === cust.id
                );

                return (
                  <React.Fragment key={cust.id}>
                    <tr>
                      <td>{cust.full_name}</td>
                      <td>{cust.national_id}</td>
                      <td>+254 {cust.phone}</td>
                      <td>{customerLoans.length}</td>
                      <td className="actions">
                        <button onClick={() => handleToggleDetails(cust.id)}>
                          {expandedCustomerId === cust.id ? "Hide" : "View"}
                        </button>
                      </td>
                    </tr>

                    {expandedCustomerId === cust.id && (
                      <tr className="expanded-row">
                        <td colSpan="5">
                          <div className="details-box">
                            <p>
                              <strong>Customer ID:</strong> {cust.id}
                            </p>
                            <p>
                              <strong>Created At:</strong>{" "}
                              {new Date(cust.created_at).toLocaleString()}
                            </p>
                            <p>
                              <strong>Savings Balance:</strong> KSH{" "}
                              {cust.savings_balance.toLocaleString()}
                            </p>
                            <p>
                              <strong>Loans:</strong>{" "}
                              {customerLoans.length > 0 ? (
                                <ul>
                                  {customerLoans.map((loan) => (
                                    <li key={loan.id}>
                                      KSH {loan.amount.toLocaleString()} -{" "}
                                      {loan.status} (Due:{" "}
                                      {new Date(loan.due_date).toLocaleDateString()})
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                "No loans"
                              )}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Customers;