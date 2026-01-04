// src/components/CustomerLoansPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CustomerLoansPage.css";
import {
  LayoutDashboard,
  CreditCard,
  PiggyBank,
  Wallet,
  LogOut,
  Plus,
  Store,
  CreditCard as PaymentIcon,
  Calendar,
  FileText,
  AlertCircle,
  GraduationCap,
  Bike,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

function CustomerLoansPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loans, setLoans] = useState([]);
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

  // Fetch loans for current customer
  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:5555/loans/${user.id}`, {
      credentials: "include"
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Failed to fetch loans");
        }
        return res.json();
      })
      .then(data => {
        setLoans(data.loans || []);
        setError(null);
      })
      .catch(err => {
        console.error("Loan fetch failed:", err);
        setError(err.message);
        setLoans([]);
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        Loading...
      </div>
    );
  }

  if (!user) return null;

  // Calculate summary data
  const activeLoans = loans.filter(l => l.status === "approved");
  const activeLoan = activeLoans[0];
  
  const totalLoanBalance = activeLoans.reduce(
    (sum, loan) => sum + loan.remaining_balance, 
    0
  );
  
  const totalAmountPaid = activeLoans.reduce(
    (sum, loan) => sum + loan.amount_paid, 
    0
  );
  
  const totalAmount = activeLoans.reduce(
    (sum, loan) => sum + loan.total_amount, 
    0
  );
  
  const repaymentProgress = totalAmount > 0 
    ? (totalAmountPaid / totalAmount) * 100 
    : 0;

  // Calculate days until due date
  const calculateDaysUntil = (dateString) => {
    if (!dateString) return null;
    const dueDate = new Date(dateString);
    const today = new Date();
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDue = activeLoan?.due_date 
    ? calculateDaysUntil(activeLoan.due_date) 
    : null;

  return (
    <div className="loans-page-container">
      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">
        <div className="logo">MaliBora</div>

        <nav className="sidebar-nav">
          <button onClick={() => navigate("/customer-dashboard")}>
            <LayoutDashboard size={20} />
            Dashboard
          </button>

          <button className="active">
            <CreditCard size={20} />
            Loans
          </button>

          <button onClick={() => navigate("/customer-savings")}>
            <PiggyBank size={20} />
            Savings
          </button>

          <button onClick={() => navigate("/customer-transactions")}>
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
      <div className="loans-content">
        {/* Header */}
        <header className="loans-header">
          <div className="loans-header-left">
            <h1>My Loans</h1>
            <p>Manage your active loans and view your repayment history.</p>
          </div>
          <button className="apply-loan-btn">
            <Plus size={18} />
            Apply for New Loan
          </button>
        </header>

        {/* Main Content */}
        <main className="loans-main">
          {error && (
            <div style={{
              padding: '1rem',
              background: '#fee',
              color: '#c33',
              borderRadius: '8px',
              marginBottom: '1rem'
            }}>
              Error: {error}
            </div>
          )}

          {/* Summary Cards */}
          <section className="loans-summary-grid">
            <div className="loan-summary-card">
              <h4>Total Active Loan</h4>
              <div className="summary-amount">
                <h3>{totalLoanBalance.toLocaleString()} TZS</h3>
              </div>
              <div className="summary-progress-bar">
                <div
                  className="summary-progress-fill blue"
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            <div className="loan-summary-card">
              <h4>Amount Repaid</h4>
              <div className="summary-amount">
                <h3 style={{ color: "#22c55e" }}>
                  {totalAmountPaid.toLocaleString()} TZS
                </h3>
                <span className="percentage">
                  {Math.round(repaymentProgress)}%
                </span>
              </div>
              <div className="summary-progress-bar">
                <div
                  className="summary-progress-fill green"
                  style={{ width: `${repaymentProgress}%` }}
                />
              </div>
            </div>

            <div className="loan-summary-card">
              <h4>Remaining Balance</h4>
              <div className="summary-amount">
                <h3>{totalLoanBalance.toLocaleString()} TZS</h3>
              </div>
              <div className="summary-progress-bar">
                <div
                  className="summary-progress-fill orange"
                  style={{ width: `${100 - repaymentProgress}%` }}
                />
              </div>
            </div>

            <div className="loan-summary-card">
              <h4>Next Payment Due</h4>
              <div className="next-payment-info">
                <h3>{activeLoan?.due_date || "N/A"}</h3>
                {daysUntilDue !== null && (
                  <span className="due-badge">
                    {daysUntilDue > 0 
                      ? `In ${daysUntilDue} Days` 
                      : daysUntilDue === 0 
                      ? "Due Today"
                      : "Overdue"
                    }
                  </span>
                )}
              </div>
              <p className="payment-amount">
                Remaining:{" "}
                <span>
                  {activeLoan?.remaining_balance?.toLocaleString() || 0} TZS
                </span>
              </p>
            </div>
          </section>

          {/* Active Loans Section */}
          <section className="active-loans-section">
            <h2 className="section-title">Active Loans</h2>

            {activeLoan ? (
              <div className="active-loan-card">
                <div className="loan-status-bar" />
                <div className="loan-card-content">
                  {/* Loan Header */}
                  <div className="loan-header">
                    <div className="loan-title-section">
                      <div className="loan-icon">
                        <Store size={24} />
                      </div>
                      <div>
                        <h3>Business Loan</h3>
                        <p className="loan-id">ID: #LN-{activeLoan.id}</p>
                      </div>
                    </div>
                    <span className="active-badge">Active</span>
                  </div>

                  {/* Loan Details Grid */}
                  <div className="loan-details-grid">
                    <div className="loan-detail-item">
                      <label>Principal Amount</label>
                      <div className="value">
                        {activeLoan.amount.toLocaleString()} TZS
                      </div>
                    </div>
                    <div className="loan-detail-item">
                      <label>Total Amount (with interest)</label>
                      <div className="value">
                        {activeLoan.total_amount.toLocaleString()} TZS
                      </div>
                    </div>
                    <div className="loan-detail-item">
                      <label>Interest Rate</label>
                      <div className="value">
                        {activeLoan.interest_rate}%{" "}
                        <span className="subvalue">/ annum</span>
                      </div>
                    </div>
                    <div className="loan-detail-item">
                      <label>Due Date</label>
                      <div className="value">{activeLoan.due_date}</div>
                      {daysUntilDue !== null && (
                        <p className="due-date">
                          {daysUntilDue > 0 
                            ? `${daysUntilDue} days remaining`
                            : daysUntilDue === 0
                            ? "Due today"
                            : "Overdue"
                          }
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Progress Section */}
                  <div className="loan-progress-section">
                    <div className="progress-info">
                      <div className="paid-info">
                        <span>Paid:</span>
                        <span>{activeLoan.amount_paid.toLocaleString()} TZS</span>
                      </div>
                      <div className="remaining-info">
                        <span>Remaining:</span>
                        <span>
                          {activeLoan.remaining_balance.toLocaleString()} TZS
                        </span>
                      </div>
                      <span className="progress-percentage">
                        {Math.round((activeLoan.amount_paid / activeLoan.total_amount) * 100)}%
                      </span>
                    </div>
                    <div className="loan-progress-bar">
                      <div
                        className="loan-progress-fill"
                        style={{ 
                          width: `${(activeLoan.amount_paid / activeLoan.total_amount) * 100}%` 
                        }}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="loan-actions">
                    <button 
                      className="loan-action-btn primary"
                      onClick={() => navigate("/repay")}
                    >
                      <PaymentIcon size={16} />
                      Repay Loan
                    </button>
                    <button className="loan-action-btn secondary">
                      <Calendar size={16} />
                      View Schedule
                    </button>
                    <button className="loan-action-btn secondary">
                      <FileText size={16} />
                      Download Statement
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '3rem', 
                color: '#64748b' 
              }}>
                <p>No active loans</p>
                <button 
                  className="apply-loan-btn" 
                  style={{ marginTop: '1rem' }}
                >
                  <Plus size={18} />
                  Apply for Your First Loan
                </button>
              </div>
            )}
          </section>

          {/* Loan History Section */}
          <section className="loan-history-section">
            <div className="history-header">
              <h2 className="section-title">Loan History</h2>
              <div className="history-filters">
                <select className="filter-select">
                  <option>All Status</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </select>
                <select className="filter-select">
                  <option>Last 12 Months</option>
                  <option>2024</option>
                  <option>2023</option>
                </select>
              </div>
            </div>

            <div className="loans-table-container">
              <table className="loans-table">
                <thead>
                  <tr>
                    <th>Loan ID</th>
                    <th>Date Applied</th>
                    <th className="text-right">Principal</th>
                    <th className="text-right">Total Amount</th>
                    <th className="text-center">Status</th>
                    <th className="text-right">Due Date</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loans.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                        No loans found
                      </td>
                    </tr>
                  ) : (
                    loans.map((loan) => (
                      <tr key={loan.id}>
                        <td>
                          <div className="loan-type-cell">
                            <div className={`loan-type-icon ${loan.status}`}>
                              {loan.status === "approved" ? (
                                <Store size={18} />
                              ) : loan.status === "pending" ? (
                                <AlertCircle size={18} />
                              ) : (
                                <FileText size={18} />
                              )}
                            </div>
                            <div className="loan-type-info">
                              <p className="loan-name">Loan #{loan.id}</p>
                              <p className="loan-ref">{loan.interest_rate}% interest</p>
                            </div>
                          </div>
                        </td>
                        <td className="table-text-muted">
                          {loan.created_at || "N/A"}
                        </td>
                        <td className="table-text-right">
                          {loan.amount.toLocaleString()} TZS
                        </td>
                        <td className="table-text-right">
                          {loan.total_amount.toLocaleString()} TZS
                        </td>
                        <td className="table-text-center">
                          <span className={`table-status-badge ${loan.status}`}>
                            {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                          </span>
                        </td>
                        <td className="table-text-right table-text-muted">
                          {loan.due_date || "N/A"}
                        </td>
                        <td className="table-text-center">
                          <button className="view-details-btn">
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              <div className="table-footer">
                <p className="table-footer-info">
                  Showing <span>1</span> to <span>{loans.length}</span> of{" "}
                  <span>{loans.length}</span> results
                </p>
                <div className="pagination-controls">
                  <button className="pagination-btn" disabled>
                    <ChevronLeft size={16} />
                  </button>
                  <button className="pagination-btn" disabled>
                    <ChevronRight size={16} />
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

export default CustomerLoansPage;