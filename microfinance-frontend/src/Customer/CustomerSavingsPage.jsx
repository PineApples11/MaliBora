// src/components/CustomerSavingsPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CustomerSavingsPage.css";
import {
  LayoutDashboard,
  CreditCard,
  PiggyBank,
  Wallet,
  LogOut,
  Wallet as WalletIcon,
  TrendingUp,
  Target,
  Percent,
  ChevronRight,
  MoreVertical,
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  DollarSign,
  AlertCircle,
  Calendar,
  ArrowDown,
  ArrowUp,
} from "lucide-react";

function CustomerSavingsPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [savingsData, setSavingsData] = useState(null);
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

  // Fetch savings data for current customer
  useEffect(() => {
    if (!user) return;

    fetch(`http://localhost:5555/savings/${user.id}`, {
      credentials: "include"
    })
      .then(res => {
        if (!res.ok) {
          if (res.status === 404) {
            // No savings accounts yet
            setSavingsData({
              customer: { id: user.id, full_name: user.full_name },
              total_balance: 0,
              growth_percentage: 0,
              accounts: [],
              recent_transactions: []
            });
            setError(null);
            return null;
          }
          throw new Error("Failed to fetch savings data");
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          setSavingsData(data);
          setError(null);
        }
      })
      .catch(err => {
        console.error("Savings fetch failed:", err);
        setError(err.message);
        // Set empty data structure on error
        setSavingsData({
          customer: { id: user.id, full_name: user.full_name },
          total_balance: 0,
          growth_percentage: 0,
          accounts: [],
          recent_transactions: []
        });
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
        Loading your savings...
      </div>
    );
  }

  if (!user || !savingsData) return null;

  // Extract data from API response
  const totalSavingsBalance = savingsData.total_balance || 0;
  const growthPercentage = savingsData.growth_percentage || 0;
  const savingsAccounts = savingsData.accounts || [];
  const recentTransactions = savingsData.recent_transactions || [];

  // Calculate additional stats
  const totalInterestEarned = savingsAccounts.reduce(
    (sum, account) => sum + (account.interest_rate || 0) * (account.balance || 0) / 100,
    0
  );
  const averageAPY = savingsAccounts.length > 0
    ? savingsAccounts.reduce((sum, acc) => sum + (acc.interest_rate || 0), 0) / savingsAccounts.length
    : 0;

  // Mock monthly goal (you can add this to your backend later)
  const monthlyGoal = 500000;
  const monthlyGoalProgress = Math.min((totalSavingsBalance / monthlyGoal) * 100, 100);

  return (
    <div className="savings-page-container">
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

          <button className="active">
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
      <div className="savings-content">
        {/* Header */}
        <header className="savings-header">
          <div className="savings-header-left">
            <h1>My Savings</h1>
            <p>Track your savings growth and manage your financial goals.</p>
          </div>
          <div className="header-actions">
            <button 
             className="withdraw-btn"
             onClick={() => navigate("/withdraw")}
             >
              <ArrowDown size={18} />
              Withdraw
            </button>
            <button 
            className="deposit-btn"
            onClick={() => navigate("/deposit-savings")}
            >
              <ArrowUp size={18} />
              Deposit Savings
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="savings-main">
          {error && (
            <div style={{
              padding: '1rem',
              background: '#fef3cd',
              color: '#856404',
              borderRadius: '8px',
              marginBottom: '1rem'
            }}>
              {error}
            </div>
          )}

          {/* Summary Stats */}
          <section className="savings-stats-grid">
            <div className="savings-stat-card">
              <div className="stat-icon-wrapper blue">
                <WalletIcon size={20} />
              </div>
              <h4>Total Savings Balance</h4>
              <div className="stat-value">
                {totalSavingsBalance.toLocaleString()} TZS
              </div>
              <p className="stat-subtitle success">
                {growthPercentage > 0 ? '+' : ''}{growthPercentage.toFixed(1)}% from last month
              </p>
            </div>

            <div className="savings-stat-card">
              <div className="stat-icon-wrapper green">
                <TrendingUp size={20} />
              </div>
              <h4>Total Interest Earned</h4>
              <div className="stat-value">
                {Math.round(totalInterestEarned).toLocaleString()} TZS
              </div>
              <p className="stat-subtitle">Estimated annual earnings</p>
            </div>

            <div className="savings-stat-card">
              <div className="stat-icon-wrapper purple">
                <Target size={20} />
              </div>
              <h4>This Month's Goal</h4>
              <div className="stat-value">
                {totalSavingsBalance.toLocaleString()} TZS
              </div>
              <p className="stat-subtitle">Target: {monthlyGoal.toLocaleString()}</p>
              <div className="stat-progress-wrapper">
                <div className="stat-progress-info">
                  <span>{Math.round(monthlyGoalProgress)}% Reached</span>
                </div>
                <div className="stat-progress-bar">
                  <div
                    className="stat-progress-fill purple"
                    style={{ width: `${monthlyGoalProgress}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="savings-stat-card">
              <div className="stat-icon-wrapper orange">
                <Percent size={20} />
              </div>
              <h4>Average APY</h4>
              <div className="stat-value">{averageAPY.toFixed(1)}%</div>
              <p className="stat-subtitle">On annual interest p.a.</p>
            </div>
          </section>

          {/* Savings Accounts & Goals */}
          <section className="savings-accounts-section">
            <div className="section-header">
              <h2 className="section-title">Savings Accounts & Goals</h2>
              <button className="view-all-btn">
                View All
                <ChevronRight size={16} />
              </button>
            </div>

            {savingsAccounts.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                background: '#f8f9fa',
                borderRadius: '12px',
                marginBottom: '2rem'
              }}>
                <PiggyBank size={48} style={{ color: '#94a3b8', marginBottom: '1rem' }} />
                <h3 style={{ color: '#475569', marginBottom: '0.5rem' }}>No Savings Accounts Yet</h3>
                <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
                  Create your first savings account to start building your financial future
                </p>
                <button className="deposit-btn">
                  <Plus size={18} />
                  Create Savings Account
                </button>
              </div>
            ) : (
              <div className="accounts-grid">
                {savingsAccounts.map((account) => {
                  const accountType = account.account_type || "Savings Account";
                  const accountStatus = account.status || "active";
                  
                  return (
                    <div key={account.id} className="savings-account-card">
                      <div className="account-header">
                        <div className="account-icon-title">
                          <div className="account-icon blue">
                            <WalletIcon size={20} />
                          </div>
                          <div className="account-title">
                            <h3>Account #{account.account_number}</h3>
                            <p>{accountType}</p>
                          </div>
                        </div>
                        <button className="account-menu-btn">
                          <MoreVertical size={18} />
                        </button>
                      </div>

                      <div className="account-balance">
                        <div className="balance-label">Current Balance</div>
                        <div className="balance-amount">
                          {account.balance.toLocaleString()} TZS
                        </div>
                      </div>

                      <div className="account-meta">
                        <div className="meta-item">
                          <Percent size={14} />
                          Interest: {account.interest_rate || 0}% p.a.
                        </div>
                        <div className="meta-item">
                          <Calendar size={14} />
                          Since {account.created_at || "N/A"}
                        </div>
                        <div className="meta-item">
                          <span className={`status-badge ${accountStatus}`}>
                            {accountStatus.charAt(0).toUpperCase() + accountStatus.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Create New Account Card */}
                <div className="create-goal-card">
                  <div className="create-icon">
                    <Plus size={24} />
                  </div>
                  <span>Create New Savings Account</span>
                </div>
              </div>
            )}
          </section>

          {/* Recent Transactions */}
          <section className="transactions-section">
            <div className="transactions-header">
              <h2 className="section-title">Recent Transactions</h2>
              <div className="transactions-filter">
                <span style={{ fontSize: "0.875rem", color: "#617289" }}>
                  All Transactions
                </span>
                <select className="filter-dropdown">
                  <option>Last 30 Days</option>
                  <option>Last 3 Months</option>
                  <option>Last Year</option>
                </select>
              </div>
            </div>

            <div className="transactions-table-container">
              {recentTransactions.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '3rem',
                  color: '#64748b'
                }}>
                  <Wallet size={48} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
                  <p>No transactions yet</p>
                  <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    Your savings transactions will appear here
                  </p>
                </div>
              ) : (
                <table className="transactions-table">
                  <thead>
                    <tr>
                      <th>Transaction Details</th>
                      <th>Date</th>
                      <th>Category</th>
                      <th className="text-right">Amount</th>
                      <th className="text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map((transaction) => {
                      const isDeposit = transaction.transaction_type === "deposit";
                      
                      return (
                        <tr key={transaction.id}>
                          <td>
                            <div className="transaction-details-cell">
                              <div className={`transaction-icon ${transaction.transaction_type}`}>
                                {isDeposit ? (
                                  <ArrowDownLeft size={18} />
                                ) : (
                                  <ArrowUpRight size={18} />
                                )}
                              </div>
                              <div className="transaction-info">
                                <p className="transaction-name">
                                  {isDeposit ? "Deposit" : "Withdrawal"}
                                </p>
                                <p className="transaction-ref">
                                  {transaction.reference || `Ref: ${transaction.id}`}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="transaction-date">
                            {transaction.date || "N/A"}
                          </td>
                          <td className="transaction-category">
                            {transaction.transaction_type.charAt(0).toUpperCase() + 
                             transaction.transaction_type.slice(1)}
                          </td>
                          <td className={`transaction-amount ${isDeposit ? "positive" : "negative"}`}>
                            {isDeposit ? "+" : "-"}{transaction.amount.toLocaleString()} TZS
                          </td>
                          <td className="transaction-status">
                            <span className="status-badge completed">
                              Completed
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default CustomerSavingsPage;