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
  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;

  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

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

    // Mock data - replace with actual API call
    setLoans([
      {
        id: "LN-2023-8842",
        type: "Business Expansion Loan",
        amount: 2000000,
        amountPaid: 800000,
        interestRate: 12,
        nextPaymentAmount: 150000,
        nextPaymentDate: "Oct 25, 2023",
        status: "active",
        dateApplied: "Jun 10, 2023",
      },
    ]);
    setLoading(false);
  }, [user]);

  if (!user || loading) return null;

  const activeLoan = loans.find((l) => l.status === "active");
  const totalLoanBalance = loans.reduce((sum, loan) => sum + loan.amount, 0);
  const amountPaid = activeLoan?.amountPaid || 0;
  const remainingBalance = activeLoan
    ? activeLoan.amount - activeLoan.amountPaid
    : 0;
  const repaymentProgress = activeLoan
    ? (activeLoan.amountPaid / activeLoan.amount) * 100
    : 0;

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
              localStorage.removeItem("user");
              navigate("/login");
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
                  {amountPaid.toLocaleString()} TZS
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
                <h3>{remainingBalance.toLocaleString()} TZS</h3>
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
                <h3>{activeLoan?.nextPaymentDate?.split(",")[0] || "N/A"}</h3>
                <span className="due-badge">In 5 Days</span>
              </div>
              <p className="payment-amount">
                Amount:{" "}
                <span>
                  {activeLoan?.nextPaymentAmount?.toLocaleString() || 0} TZS
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
                        <h3>{activeLoan.type}</h3>
                        <p className="loan-id">ID: #{activeLoan.id}</p>
                      </div>
                    </div>
                    <span className="active-badge">Active</span>
                  </div>

                  {/* Loan Details Grid */}
                  <div className="loan-details-grid">
                    <div className="loan-detail-item">
                      <label>Total Loan Amount</label>
                      <div className="value">
                        {activeLoan.amount.toLocaleString()} TZS
                      </div>
                    </div>
                    <div className="loan-detail-item">
                      <label>Interest Rate</label>
                      <div className="value">
                        {activeLoan.interestRate}%{" "}
                        <span className="subvalue">/ annum</span>
                      </div>
                    </div>
                    <div className="loan-detail-item">
                      <label>Next Payment</label>
                      <div className="value">
                        {activeLoan.nextPaymentAmount.toLocaleString()} TZS
                      </div>
                      <p className="due-date">
                        Due {activeLoan.nextPaymentDate}
                      </p>
                    </div>
                  </div>

                  {/* Progress Section */}
                  <div className="loan-progress-section">
                    <div className="progress-info">
                      <div className="paid-info">
                        <span>Paid:</span>
                        <span>{activeLoan.amountPaid.toLocaleString()} TZS</span>
                      </div>
                      <div className="remaining-info">
                        <span>Remaining:</span>
                        <span>
                          {(
                            activeLoan.amount - activeLoan.amountPaid
                          ).toLocaleString()}{" "}
                          TZS
                        </span>
                      </div>
                      <span className="progress-percentage">
                        {Math.round(repaymentProgress)}%
                      </span>
                    </div>
                    <div className="loan-progress-bar">
                      <div
                        className="loan-progress-fill"
                        style={{ width: `${repaymentProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="loan-actions">
                    <button className="loan-action-btn primary">
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
              <p>No active loans</p>
            )}
          </section>

          {/* Loan History Section */}
          <section className="loan-history-section">
            <div className="history-header">
              <h2 className="section-title">Loan History</h2>
              <div className="history-filters">
                <select className="filter-select">
                  <option>All Status</option>
                  <option>Completed</option>
                  <option>Pending</option>
                </select>
                <select className="filter-select">
                  <option>Last 12 Months</option>
                  <option>2022</option>
                  <option>2021</option>
                </select>
              </div>
            </div>

            <div className="loans-table-container">
              <table className="loans-table">
                <thead>
                  <tr>
                    <th>Loan Type</th>
                    <th>Date Applied</th>
                    <th className="text-right">Amount</th>
                    <th className="text-center">Status</th>
                    <th className="text-right">Repayment Date</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="loan-type-cell">
                        <div className="loan-type-icon pending">
                          <AlertCircle size={18} />
                        </div>
                        <div className="loan-type-info">
                          <p className="loan-name">Emergency Loan</p>
                          <p className="loan-ref">#LN-APP-009</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-text-muted">Oct 18, 2023</td>
                    <td className="table-text-right">500,000 TZS</td>
                    <td className="table-text-center">
                      <span className="table-status-badge pending">
                        Pending Approval
                      </span>
                    </td>
                    <td className="table-text-right table-text-muted">-</td>
                    <td className="table-text-center">
                      <button className="view-details-btn">View Details</button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="loan-type-cell">
                        <div className="loan-type-icon education">
                          <GraduationCap size={18} />
                        </div>
                        <div className="loan-type-info">
                          <p className="loan-name">Education Loan</p>
                          <p className="loan-ref">#LN-2022-5501</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-text-muted">Jan 10, 2023</td>
                    <td className="table-text-right">1,500,000 TZS</td>
                    <td className="table-text-center">
                      <span className="table-status-badge completed">
                        Fully Paid
                      </span>
                    </td>
                    <td className="table-text-right table-text-muted">
                      Jun 15, 2023
                    </td>
                    <td className="table-text-center">
                      <button className="view-details-btn">Receipt</button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="loan-type-cell">
                        <div className="loan-type-icon asset">
                          <Bike size={18} />
                        </div>
                        <div className="loan-type-info">
                          <p className="loan-name">Asset Financing</p>
                          <p className="loan-ref">#LN-2021-1120</p>
                        </div>
                      </div>
                    </td>
                    <td className="table-text-muted">Mar 05, 2021</td>
                    <td className="table-text-right">3,000,000 TZS</td>
                    <td className="table-text-center">
                      <span className="table-status-badge completed">
                        Fully Paid
                      </span>
                    </td>
                    <td className="table-text-right table-text-muted">
                      Dec 01, 2021
                    </td>
                    <td className="table-text-center">
                      <button className="view-details-btn">Receipt</button>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="table-footer">
                <p className="table-footer-info">
                  Showing <span>1</span> to <span>3</span> of <span>3</span>{" "}
                  results
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