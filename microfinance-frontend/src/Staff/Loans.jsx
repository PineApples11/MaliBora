import React, { useEffect, useState } from "react";
import "./loans.css";
import Loading from "../Loading/Loading";

const Loans = () => {
  const [loans, setLoans] = useState([]);
  const [active, setActive] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [loansRes, customersRes] = await Promise.all([
          fetch("http://127.0.0.1:5555/loan"),
          fetch("http://127.0.0.1:5555/customer"),
        ]);

        if (!loansRes.ok || !customersRes.ok)
          throw new Error("Failed to fetch data");

        const loansData = await loansRes.json();
        const customersData = await customersRes.json();

        setLoans(loansData);
        setCustomers(customersData);
        setLoading(false);
        setActive(false)
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCustomerName = (customerId) => {
    const customer = customers.find((cust) => cust.id === customerId);
    return customer ? customer.full_name : "Unknown";
  };

  const filteredLoans = loans.filter((loan) => {
    const customerName = getCustomerName(loan.customer_id).toLowerCase();
    return customerName.includes(searchTerm.toLowerCase());
  });

  return (
    active ? (
      <div className="loader">
        <Loading />
      </div>
    ) : (
    <div className="loans-page">
      <h1 className="page-title">Loan Management</h1>

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
          <table className="loan-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Due Date</th>
                <th>Issued Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredLoans.map((loan) => (
                <tr key={loan.id}>
                  <td>{getCustomerName(loan.customer_id)}</td>
                  <td>KSH {loan.amount.toLocaleString()}</td>
                  <td>{loan.status}</td>
                  <td>{new Date(loan.due_date).toLocaleDateString()}</td>
                  <td>{new Date(loan.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  ))
};

export default Loans;