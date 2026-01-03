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
  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;

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

    // Simulate loading
    setTimeout(() => setLoading(false), 500);
  }, [user]);

  if (!user || loading) return null;

  // Mock data
  const totalSavingsBalance = 5450000;
  const totalInterestEarned = 324500;
  const monthlyGoal = 400000;
  const monthlyGoalProgress = 90;
  const currentAPY = 8.5;

  const savingsAccounts = [
    {
      id: 1,
      name: "Main Savings",
      type: "Personal Account",
      balance: 2150000,
      lastDeposit: "50k",
      icon: "wallet",
      color: "blue",
    },
    {
      id: 2,
      name: "Emergency Fund",
      type: "High Priority",
      balance: 1800000,
      saved: 1800000,
      target: 3000000,
      progress: 60,
      icon: "alert",
      color: "orange",
    },
    {
      id: 3,
      name: "School Fees",
      type: "Goal",
      balance: 1500000,
      saved: 1500000,
      target: 2000000,
      progress: 75,
      icon: "target",
      color: "purple",
    },
  ];

  const recentTransactions = [
    {
      id: 1,
      name: "Mobile Deposit (M-Pesa)",
      ref: "Ref: WD-28670",
      date: "Oct 24, 2023, 10:30 AM",
      category: "Deposit",
      amount: "+150,000 TZS",
      status: "Completed",
      type: "deposit",
      isPositive: true,
    },
    {
      id: 2,
      name: "Monthly Interest Payout",
      ref: "System Generated",
      date: "Oct 01, 2023, 08:00 AM",
      category: "Interest",
      amount: "+12,450 TZS",
      status: "Completed",
      type: "interest",
      isPositive: true,
    },
    {
      id: 3,
      name: "Withdrawal to Bank",
      ref: "Ref: WD-19220",
      date: "Sep 28, 2023, 02:15 PM",
      category: "Withdrawal",
      amount: "-500,000 TZS",
      status: "Processed",
      type: "withdrawal",
      isPositive: false,
    },
    {
      id: 4,
      name: "Mobile Deposit (Airtel)",
      ref: "Ref: AD-15240",
      date: "Sep 15, 2023, 11:45 AM",
      category: "Deposit",
      amount: "+200,000 TZS",
      status: "Completed",
      type: "deposit",
      isPositive: true,
    },
  ];

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
              localStorage.removeItem("user");
              navigate("/login");
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
            <button className="withdraw-btn">
              <ArrowDown size={18} />
              Withdraw
            </button>
            <button className="deposit-btn">
              <ArrowUp size={18} />
              Deposit Savings
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="savings-main">
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
              <p className="stat-subtitle success">+12% from last month</p>
            </div>

            <div className="savings-stat-card">
              <div className="stat-icon-wrapper green">
                <TrendingUp size={20} />
              </div>
              <h4>Total Interest Earned</h4>
              <div className="stat-value">
                {totalInterestEarned.toLocaleString()} TZS
              </div>
              <p className="stat-subtitle">Earned over 1 year</p>
            </div>

            <div className="savings-stat-card">
              <div className="stat-icon-wrapper purple">
                <Target size={20} />
              </div>
              <h4>This Month's Goal</h4>
              <div className="stat-value">
                {monthlyGoal.toLocaleString()} TZS
              </div>
              <p className="stat-subtitle">Target: 500k</p>
              <div className="stat-progress-wrapper">
                <div className="stat-progress-info">
                  <span>{monthlyGoalProgress}% Reached</span>
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
              <h4>Current APY</h4>
              <div className="stat-value">{currentAPY}%</div>
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

            <div className="accounts-grid">
              {savingsAccounts.map((account) => (
                <div key={account.id} className="savings-account-card">
                  <div className="account-header">
                    <div className="account-icon-title">
                      <div className={`account-icon ${account.color}`}>
                        {account.icon === "wallet" && <WalletIcon size={20} />}
                        {account.icon === "alert" && <AlertCircle size={20} />}
                        {account.icon === "target" && <Target size={20} />}
                      </div>
                      <div className="account-title">
                        <h3>{account.name}</h3>
                        <p>{account.type}</p>
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

                  {account.target ? (
                    <div className="account-meta with-progress">
                      <div className="goal-progress">
                        <div className="goal-progress-header">
                          <div>
                            <span className="saved">Saved: </span>
                            <span className="target">
                              {account.saved.toLocaleString()} /{" "}
                              {account.target.toLocaleString()}
                            </span>
                          </div>
                          <span className="percentage">
                            {account.progress}% Reached
                          </span>
                        </div>
                        <div className="goal-progress-bar">
                          <div
                            className={`goal-progress-fill ${account.color}`}
                            style={{ width: `${account.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="account-meta">
                      <div className="meta-item success">
                        <ArrowUpRight size={14} />
                        Last deposit: {account.lastDeposit}
                      </div>
                      <div className="meta-item">
                        <Calendar size={14} />
                        Oct 26
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Create New Goal Card */}
              <div className="create-goal-card">
                <div className="create-icon">
                  <Plus size={24} />
                </div>
                <span>Create New Savings Goal</span>
              </div>
            </div>
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
                  {recentTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>
                        <div className="transaction-details-cell">
                          <div className={`transaction-icon ${transaction.type}`}>
                            {transaction.type === "deposit" && (
                              <ArrowDownLeft size={18} />
                            )}
                            {transaction.type === "interest" && (
                              <DollarSign size={18} />
                            )}
                            {transaction.type === "withdrawal" && (
                              <ArrowUpRight size={18} />
                            )}
                          </div>
                          <div className="transaction-info">
                            <p className="transaction-name">
                              {transaction.name}
                            </p>
                            <p className="transaction-ref">{transaction.ref}</p>
                          </div>
                        </div>
                      </td>
                      <td className="transaction-date">{transaction.date}</td>
                      <td className="transaction-category">
                        {transaction.category}
                      </td>
                      <td
                        className={`transaction-amount ${
                          transaction.isPositive ? "positive" : "negative"
                        }`}
                      >
                        {transaction.amount}
                      </td>
                      <td className="transaction-status">
                        <span
                          className={`status-badge ${
                            transaction.status === "Completed"
                              ? "completed"
                              : "processed"
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default CustomerSavingsPage;