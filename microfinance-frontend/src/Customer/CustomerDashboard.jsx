// src/components/CustomerDashboard.jsx
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./CustomerDashboard.css";
import {
  LayoutDashboard,
  CreditCard,
  Wallet,
  LogOut,
  ArrowUpRight,
  DollarSign,
  PiggyBank,
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight as ArrowUp,
  Clock,
} from "lucide-react";

function CustomerDashboard() {
  const navigate = useNavigate();

  // ✅ Parse user safely from localStorage
  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;

  // ✅ State hooks
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  // ✅ Fetch loans
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    fetch("http://localhost:5000/loan", { credentials: "include" })
      .then(res => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then(data => {
        const customerLoans = data.filter(
          loan => loan.customer_id === user.id
        );
        setLoans(customerLoans);
      })
      .catch(err => {
        console.error("Loan fetch failed:", err);
        setLoans([]);
      })
      .finally(() => setLoading(false));
  }, [user]);

  // ✅ Derived data
  const activeLoan = useMemo(
    () => loans.find(l => l.status === "active"),
    [loans]
  );

  const totalLoanBalance = useMemo(
    () => loans.reduce((sum, loan) => sum + loan.amount, 0),
    [loans]
  );

  const amountPaid = activeLoan?.amount_paid || 0;
  const repaymentProgress = activeLoan
    ? Math.min((amountPaid / activeLoan.amount) * 100, 100)
    : 0;

  // Mock savings data - replace with actual API
  const totalSavings = 450000;

  // ✅ Early return after all hooks
  if (!user || loading) return null;

  return (
    <div className="dashboard">
      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">
        <div className="logo">MaliBora</div>

        <nav className="sidebar-nav">
          <button className="active">
            <LayoutDashboard size={20} />
            Dashboard
          </button>

          <button onClick={() => navigate("/loans")}>
            <CreditCard size={20} />
            Loans
          </button>

          <button onClick={() => navigate("/savings")}>
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
      <div className="dashboard-content">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <h1>Welcome back, {user.full_name.split(' ')[0]}</h1>
            <p>Here is your financial overview for today</p>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="dashboard-main">
          {/* Stats Cards */}
          <section className="stats">
            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon green">
                  <PiggyBank size={22} />
                </div>
              </div>
              <h4>Total Savings</h4>
              <p className="amount">{totalSavings.toLocaleString()} TZS</p>
              <p className="subtitle">+12% from last month</p>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <div className="stat-icon blue">
                  <DollarSign size={22} />
                </div>
              </div>
              <h4>Active Loan Balance</h4>
              <p className="amount">{totalLoanBalance.toLocaleString()} TZS</p>
              <p className="subtitle">
                {activeLoan ? activeLoan.status : "No active loans"}
              </p>
            </div>
          </section>

          {/* Alert Box */}
          {activeLoan && (
            <div className="alert-box">
              <div className="alert-icon">
                <AlertTriangle size={20} />
              </div>
              <div className="alert-content">
                <h5>Upcoming Payment</h5>
                <p>
                  Your loan repayment of{" "}
                  {((activeLoan.amount - amountPaid) / 10).toLocaleString()} TZS
                  is due in 2 days.
                </p>
              </div>
            </div>
          )}

          {/* Content Grid */}
          <div className="content-grid">
            {/* Active Loan Details */}
            <section className="section-card">
              <div className="section-header">
                <h2>Active Loan Details</h2>
                {activeLoan && (
                  <span className="status-badge">ACTIVE</span>
                )}
              </div>

              {!activeLoan ? (
                <p style={{ color: "#64748b", textAlign: "center", padding: "2rem 0" }}>
                  No active loans
                </p>
              ) : (
                <>
                  <div className="loan-info">
                    <div className="info-item">
                      <label>Total Loan Amount</label>
                      <div className="value">
                        {activeLoan.amount.toLocaleString()} TZS
                      </div>
                    </div>
                    <div className="info-item">
                      <label>Next Payment Due</label>
                      <div className="value">
                        {activeLoan.next_payment_date || "Oct 25, 2023"}
                      </div>
                    </div>
                  </div>

                  <div className="progress-section">
                    <div className="progress-header">
                      <span>Repaid: {amountPaid.toLocaleString()} TZS</span>
                      <span className="percentage">
                        {Math.round(repaymentProgress)}%
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${repaymentProgress}%` }}
                      />
                    </div>
                  </div>

                  <button className="primary-btn">
                    <DollarSign size={18} />
                    Make Repayment
                  </button>
                </>
              )}
            </section>

            {/* Quick Actions */}
            <section className="quick-actions">
              <h3>Quick Actions</h3>
              <div className="actions-grid">
                <button
                  className="action-btn"
                  onClick={() => navigate("/repay")}
                >
                  <div className="action-icon">
                    <ArrowDownLeft size={24} color="#4b7bec" />
                  </div>
                  Repay Loan
                </button>

                <button className="action-btn">
                  <div className="action-icon">
                    <PiggyBank size={24} color="#10b981" />
                  </div>
                  Deposit
                </button>

                <button className="action-btn">
                  <div className="action-icon">
                    <ArrowUp size={24} color="#f59e0b" />
                  </div>
                  Withdraw
                </button>

                <button className="action-btn">
                  <div className="action-icon">
                    <Clock size={24} color="#8b5cf6" />
                  </div>
                  History
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default CustomerDashboard;