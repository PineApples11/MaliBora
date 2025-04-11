import React, { useEffect, useState } from "react";
import "./repayments.css";

const Repayments = () => {
  const [repayments, setRepayments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [repRes, custRes] = await Promise.all([
          fetch("http://127.0.0.1:5555/repayment"),
          fetch("http://127.0.0.1:5555/customer"),
        ]);

        if (!repRes.ok || !custRes.ok) throw new Error("Failed to fetch data");

        const repData = await repRes.json();
        const custData = await custRes.json();

        setRepayments(repData);
        setCustomers(custData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCustomerName = (customerId) => {
    const customer = customers.find((c) => c.id === customerId);
    return customer ? customer.full_name : "Unknown";
  };

  const filteredRepayments = repayments.filter((rep) =>
    getCustomerName(rep.customer_id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="repayments-page">
      <h1 className="page-title">Repayment Records</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search by customer name..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error-text">Error: {error}</p>}

      {!loading && !error && (
        <div className="table-container">
          <table className="repayments-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Amount Paid</th>
                <th>Date Paid</th>
              </tr>
            </thead>
            <tbody>
              {filteredRepayments.map((rep) => (
                <tr key={rep.id}>
                  <td>{getCustomerName(rep.customer_id)}</td>
                  <td>KSH {rep.amount.toLocaleString()}</td>
                  <td>{new Date(rep.date_paid).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Repayments;
