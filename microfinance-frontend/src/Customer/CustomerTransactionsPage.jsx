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
  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [statusFilter, setStatusFilter] = useState("Any Status");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    // Simulate loading
    setTimeout(() => setLoading(false), 500);
  }, [user]);

  if (!user || loading) return null;

  // Mock transactions data
  const transactions = [
    {
      id: 1,
      date: "Oct 24, 2023",
      time: "10:30 AM",
      title: "Mobile Deposit",
      subtitle: "Via M-Pesa",
      account: "Main Savings",
      reference: "DP-28526",
      amount: "+150,000 TZS",
      status: "Completed",
      type: "deposit",
      isPositive: true,
    },
    {
      id: 2,
      date: "Oct 22, 2023",
      time: "09:15 AM",
      title: "Loan Repayment",
      subtitle: "Weekly Installment",
      account: "Business Loan #4302",
      reference: "LR-19321",
      amount: "-45,000 TZS",
      status: "Completed",
      type: "withdrawal",
      isPositive: false,
    },
    {
      id: 3,
      date: "Oct 01, 2023",
      time: "08:00 AM",
      title: "Interest Payout",
      subtitle: "Monthly Interest",
      account: "Main Savings",
      reference: "SYS-INT-OCT",
      amount: "+12,450 TZS",
      status: "Completed",
      type: "interest",
      isPositive: true,
    },
    {
      id: 4,
      date: "Sep 28, 2023",
      time: "02:15 PM",
      title: "Withdrawal",
      subtitle: "Transfer to CRDB Bank",
      account: "Emergency Fund",
      reference: "WD-19220",
      amount: "-500,000 TZS",
      status: "Processed",
      type: "withdrawal",
      isPositive: false,
    },
    {
      id: 5,
      date: "Sep 25, 2023",
      time: "11:45 AM",
      title: "Internal Transfer",
      subtitle: "To School Fees Goal",
      account: "Main Savings",
      reference: "TRF-14021",
      amount: "-200,000 TZS",
      status: "Completed",
      type: "transfer",
      isPositive: false,
    },
    {
      id: 6,
      date: "Sep 15, 2023",
      time: "01:45 PM",
      title: "Mobile Deposit",
      subtitle: "Via Airtel Money",
      account: "Main Savings",
      reference: "AB-11298",
      amount: "+200,000 TZS",
      status: "Completed",
      type: "deposit",
      isPositive: true,
    },
    {
      id: 7,
      date: "Sep 10, 2023",
      time: "03:30 PM",
      title: "Failed Deposit",
      subtitle: "Network Error",
      account: "Main Savings",
      reference: "FL-09901",
      amount: "50,000 TZS",
      status: "Failed",
      type: "failed",
      isPositive: false,
    },
    {
      id: 8,
      date: "Sep 01, 2023",
      time: "10:00 AM",
      title: "Scheduled Deposit",
      subtitle: "Standing Order",
      account: "School Fees Goal",
      reference: "SD-21198",
      amount: "+100,000 TZS",
      status: "Pending",
      type: "scheduled",
      isPositive: true,
    },
  ];

  const activeFilters = [];
  if (typeFilter !== "All Types") activeFilters.push({ key: "type", value: typeFilter });
  if (dateRange !== "Last 30 Days") activeFilters.push({ key: "date", value: dateRange });

  const removeFilter = (key) => {
    if (key === "type") setTypeFilter("All Types");
    if (key === "date") setDateRange("Last 30 Days");
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setTypeFilter("All Types");
    setDateRange("Last 30 Days");
    setStatusFilter("Any Status");
  };

  const totalPages = Math.ceil(transactions.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, transactions.length);
  const currentTransactions = transactions.slice(startIndex, endIndex);

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
              localStorage.removeItem("user");
              navigate("/login");
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

            {activeFilters.length > 0 && (
              <div className="active-filters">
                <span style={{ fontSize: "0.75rem", color: "#617289" }}>
                  Type: All
                </span>
                {activeFilters.map((filter) => (
                  <div key={filter.key} className="filter-tag">
                    {filter.key === "type" && `Type: ${filter.value}`}
                    {filter.key === "date" && `Date: ${filter.value}`}
                    <button
                      className="filter-tag-close"
                      onClick={() => removeFilter(filter.key)}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                <button className="clear-all-filters" onClick={clearAllFilters}>
                  Clear all filters
                </button>
              </div>
            )}
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
                  {currentTransactions.map((transaction) => (
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
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="table-footer">
              <div className="footer-info">
                Showing <span>{startIndex + 1}</span> to <span>{endIndex}</span> of{" "}
                <span>{transactions.length}</span> transactions
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