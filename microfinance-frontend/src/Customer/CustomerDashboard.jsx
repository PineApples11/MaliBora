// src/components/CustomerDashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CustomerDashboard.css";
import {
  LayoutDashboard,
  CreditCard,
  Wallet,
  LogOut,
  DollarSign,
  PiggyBank,
  AlertTriangle,
  ArrowDownLeft,
  ArrowUpRight as ArrowUp,
  Clock,
} from "lucide-react";

function CustomerDashboard() {
  const navigate = useNavigate();

  // ✅ State hooks
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Verify session and get current user
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

  // ✅ Fetch dashboard summary data
  useEffect(() => {
    if (!user) return;

    fetch("http://localhost:5555/dashboard-summary", { 
      credentials: "include" 
    })
      .then(res => {
        if (!res.ok) {
          if (res.status === 401) {
            throw new Error("Not authenticated");
          } else if (res.status === 403) {
            throw new Error("Unauthorized access");
          }
          throw new Error("Failed to fetch dashboard data");
        }
        return res.json();
      })
      .then(data => {
        setDashboardData(data);
        setError(null);
      })
      .catch(err => {
        console.error("Dashboard fetch failed:", err);
        setError(err.message);
        
        if (err.message === "Not authenticated") {
          navigate("/login", { replace: true });
        }
      })
      .finally(() => setLoading(false));
  }, [user, navigate]);

  // ✅ Calculate repayment progress
  const repaymentProgress = dashboardData?.active_loan
    ? Math.min(
        (dashboardData.active_loan.amount_paid / dashboardData.active_loan.amount) * 100,
        100
      )
    : 0;

  // ✅ Early return after all hooks
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.2rem',
        color: '#64748b'
      }}>
        Loading your dashboard...
      </div>
    );
  }

  if (!user || !dashboardData) return null;

  const activeLoan = dashboardData.active_loan;
  const totalSavings = dashboardData.total_savings || 0;
  const totalLoanBalance = dashboardData.total_loan_balance || 0;
  const savingsGrowth = dashboardData.savings_growth || 0;

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

          <button onClick={() => navigate("/transactions")}>
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
          {/* Error Message */}
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
              <p className="subtitle">
                {savingsGrowth > 0 ? '+' : ''}{savingsGrowth}% from last month
              </p>
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
                {activeLoan 
                  ? `${dashboardData.total_active_loans} active loan${dashboardData.total_active_loans > 1 ? 's' : ''}`
                  : "No active loans"
                }
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
                  {((activeLoan.amount - activeLoan.amount_paid) / 10).toLocaleString()} TZS
                  {activeLoan.next_payment_date 
                    ? ` is due on ${activeLoan.next_payment_date}` 
                    : ' is due soon'
                  }.
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
                <div style={{ 
                  color: "#64748b", 
                  textAlign: "center", 
                  padding: "2rem 0" 
                }}>
                  <p>No active loans</p>
                  <button 
                    className="primary-btn" 
                    style={{ marginTop: '1rem' }}
                    onClick={() => navigate("/loans")}
                  >
                    Apply for a Loan
                  </button>
                </div>
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
                      <label>Amount Paid</label>
                      <div className="value">
                        {activeLoan.amount_paid.toLocaleString()} TZS
                      </div>
                    </div>
                    <div className="info-item">
                      <label>Next Payment Due</label>
                      <div className="value">
                        {activeLoan.next_payment_date || "Not set"}
                      </div>
                    </div>
                    {activeLoan.interest_rate && (
                      <div className="info-item">
                        <label>Interest Rate</label>
                        <div className="value">
                          {activeLoan.interest_rate}%
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="progress-section">
                    <div className="progress-header">
                      <span>Repayment Progress</span>
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
                    <p style={{ 
                      fontSize: '0.875rem', 
                      color: '#64748b', 
                      marginTop: '0.5rem' 
                    }}>
                      {(activeLoan.amount - activeLoan.amount_paid).toLocaleString()} TZS remaining
                    </p>
                  </div>

                  <button 
                    className="primary-btn"
                    onClick={() => navigate("/repay")}
                  >
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
                  disabled={!activeLoan}
                  style={!activeLoan ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                >
                  <div className="action-icon">
                    <ArrowDownLeft size={24} color="#4b7bec" />
                  </div>
                  Repay Loan
                </button>

                <button 
                  className="action-btn"
                  onClick={() => navigate("/deposit-savings")}
                >
                  <div className="action-icon">
                    <PiggyBank size={24} color="#10b981" />
                  </div>
                  Deposit
                </button>

                <button 
                  className="action-btn"
                  onClick={() => navigate("/savings")}
                >
                  <div className="action-icon">
                    <ArrowUp size={24} color="#f59e0b" />
                  </div>
                  Withdraw
                </button>

                <button 
                  className="action-btn"
                  onClick={() => navigate("/transactions")}
                >
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