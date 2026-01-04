// src/components/CustomerTransactionsPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CustomerTransactionsPage.css";
import {
  LayoutDashboard,
  CreditCard,
  PiggyBank,
  Wallet,
  LogOut,
  Download,
  Printer,
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  DollarSign,
  RefreshCw,
  AlertTriangle,
  Clock,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

function CustomerTransactionsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [transactionsData, setTransactionsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [statusFilter, setStatusFilter] = useState("Any Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verify session and get current user
  useEffect(() => {
    fetch("http://localhost:5555/me", { credentials: "include" })
      .then(res => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then(data => {
        setUser(data);
      })
      .catch(err => {
        console.error("Session check failed:", err);
        navigate("/login", { replace: true });
      });
  }, [navigate]);

  useEffect(() => {
    if (!user?.id) return;

    setLoading(true);
    fetch(`http://localhost:5555/transactions/${user.id}`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch transactions");
        return res.json();
      })
      .then((data) => {
        console.log("Received data:", data);
        // Transform backend data to match frontend expectations
        const transformedTransactions = (data.savings_transactions || []).map(tx => ({
          id: tx.id,
          date: tx.date || "N/A",
          time: "12:00 PM", // Backend doesn't provide time
          title: tx.transaction_type === "deposit" ? "Deposit" : "Withdrawal",
          subtitle: tx.description || "No description",
          account: "Savings Account",
          reference: `TXN-${tx.id}`,
          amount: tx.transaction_type === "deposit" ? `+KSh ${tx.amount}` : `-KSh ${tx.amount}`,
          isPositive: tx.transaction_type === "deposit",
          status: "Completed", // Backend doesn't provide status
          type: tx.transaction_type
        }));
        setTransactionsData(transformedTransactions);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching transactions:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [user]);

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        Loading transactions...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
        Error: {error}
      </div>
    );
  }

  // Filtering logic
  const filteredTransactions = transactionsData.filter((transaction) => {
    const matchesSearch =
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.subtitle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      typeFilter === "All Types" ||
      transaction.type === typeFilter.toLowerCase();

    const matchesStatus =
      statusFilter === "Any Status" ||
      transaction.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredTransactions.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredTransactions.length);
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  return (
    <div className="transactions-page-container">
      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">
        <div className="logo">MaliBora</div>

        <nav className="sidebar-nav">
          <button onClick={() => navigate("/customer-dashboard")}>
            <LayoutDashboard size={20} />
            Dashboard
          </button>

          <button onClick={() => navigate("/customer-loans")}>
            <CreditCard size={20} />
            Loans
          </button>

          <button onClick={() => navigate("/customer-savings")}>
            <PiggyBank size={20} />
            Savings
          </button>

          <button className="active">
            <Wallet size={20} />
            Transactions
          </button>
        </nav>

        <div className="sidebar-profile">
          <span>{user.full_name}</span>
          <button
            className="logout-btn"
            onClick={() => {
              fetch("http://localhost:5555/logout", { 
                method: "POST",
                credentials: "include" 
              }).then(() => {
                navigate("/login");
              });
            }}
          >
            <LogOut size={14} />
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="transactions-content">
        {/* Header */}
        <header className="transactions-header">
          <div className="transactions-header-left">
            <h1>Transactions</h1>
            <p>View and filter your complete financial history across all accounts.</p>
          </div>
          <div className="header-actions">
            <button className="export-csv-btn">
              <Download size={16} />
              Export CSV
            </button>
            <button className="print-statement-btn">
              <Printer size={16} />
              Print Statement
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="transactions-main">
          {/* Filters Section */}
          <section className="filters-section">
            <div className="filters-grid">
              <div className="filter-group">
                <label className="filter-label">Search Transactions</label>
                <input
                  type="text"
                  className="filter-input"
                  placeholder="Search by ID, recipient, or note..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="filter-group">
                <label className="filter-label">Type</label>
                <select
                  className="filter-select"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option>All Types</option>
                  <option>Deposit</option>
                  <option>Withdrawal</option>
                  <option>Transfer</option>
                  <option>Interest</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Date Range</label>
                <select
                  className="filter-select"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option>Last 30 Days</option>
                  <option>Last 3 Months</option>
                  <option>Last 6 Months</option>
                  <option>Last Year</option>
                  <option>All Time</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Status</label>
                <select
                  className="filter-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option>Any Status</option>
                  <option>Completed</option>
                  <option>Pending</option>
                  <option>Failed</option>
                </select>
              </div>

              <button className="filter-btn">Filter</button>
            </div>
          </section>

          {/* Transactions Table */}
          <section className="transactions-table-section">
            <div className="table-wrapper">
              <table className="transactions-data-table">
                <thead>
                  <tr>
                    <th>DATE</th>
                    <th>DESCRIPTION</th>
                    <th>ACCOUNT / LOAN</th>
                    <th>REFERENCE</th>
                    <th style={{ textAlign: "right" }}>AMOUNT</th>
                    <th style={{ textAlign: "center" }}>STATUS</th>
                    <th style={{ textAlign: "center" }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTransactions.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center", padding: "2rem" }}>
                        No transactions found
                      </td>
                    </tr>
                  ) : (
                    currentTransactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td>
                          <div className="date-cell">
                            {transaction.date}
                            <span className="date-time">{transaction.time}</span>
                          </div>
                        </td>
                        <td>
                          <div className="description-cell">
                            <div className={`transaction-type-icon ${transaction.type}`}>
                              {transaction.type === "deposit" && (
                                <ArrowDownLeft size={18} />
                              )}
                              {transaction.type === "withdrawal" && (
                                <ArrowUpRight size={18} />
                              )}
                              {transaction.type === "interest" && (
                                <DollarSign size={18} />
                              )}
                              {transaction.type === "transfer" && (
                                <RefreshCw size={18} />
                              )}
                              {transaction.type === "failed" && (
                                <AlertTriangle size={18} />
                              )}
                              {transaction.type === "scheduled" && (
                                <Clock size={18} />
                              )}
                            </div>
                            <div className="transaction-details">
                              <div className="transaction-title">
                                {transaction.title}
                              </div>
                              <div className="transaction-subtitle">
                                {transaction.subtitle}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="account-cell">{transaction.account}</td>
                        <td className="reference-cell">{transaction.reference}</td>
                        <td
                          className={`amount-cell ${
                            transaction.isPositive ? "positive" : "negative"
                          }`}
                        >
                          {transaction.amount}
                        </td>
                        <td className="status-cell">
                          <span
                            className={`transaction-status-badge ${transaction.status.toLowerCase()}`}
                          >
                            {transaction.status}
                          </span>
                        </td>
                        <td className="actions-cell">
                          <button className="view-action-btn">
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="table-footer">
              <div className="footer-info">
                Showing <span>{filteredTransactions.length > 0 ? startIndex + 1 : 0}</span> to <span>{endIndex}</span> of{" "}
                <span>{filteredTransactions.length}</span> transactions
              </div>

              <div className="pagination-controls">
                <div className="rows-per-page">
                  <span style={{ fontSize: "0.75rem", color: "#617289" }}>
                    Rows per page:
                  </span>
                  <select
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>

                <div className="pagination-buttons">
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronsLeft size={16} />
                  </button>
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight size={16} />
                  </button>
                  <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronsRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default CustomerTransactionsPage;