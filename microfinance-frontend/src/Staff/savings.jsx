import React, { useEffect, useState } from "react";
import "./savings.css";

const Savings = () => {
  const [transactions, setTransactions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchSavingsAndCustomers = async () => {
      try {
        const [txRes, custRes] = await Promise.all([
          fetch("http://127.0.0.1:5555/savings-transaction"),
          fetch("http://127.0.0.1:5555/customer"),
        ]);

        if (!txRes.ok || !custRes.ok) throw new Error("Failed to fetch data");

        const transactionsData = await txRes.json();
        const customersData = await custRes.json();

        setTransactions(transactionsData);
        setCustomers(customersData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSavingsAndCustomers();
  }, []);

  const getCustomerName = (customerId) => {
    const customer = customers.find((c) => c.id === customerId);
    return customer ? customer.full_name : "Unknown";
  };

  const filteredTransactions = transactions.filter((tx) => {
    const name = getCustomerName(tx.customer_id).toLowerCase();
    return name.includes(search.toLowerCase());
  });

  return (
    <div className="savings-page">
      <h1 className="page-title">Savings Transactions</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="Search by customer name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error-text">Error: {error}</p>}

      {!loading && !error && (
        <div className="table-container">
          <table className="savings-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Transaction Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx) => (
                <tr key={tx.id}>
                  <td>{getCustomerName(tx.customer_id)}</td>
                  <td>{tx.type}</td>
                  <td>KSH {tx.amount.toLocaleString()}</td>
                  <td>{new Date(tx.transaction_date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Savings;