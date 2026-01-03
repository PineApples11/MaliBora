// src/components/StaffDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./StaffDashboard.css";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  DollarSign,
  Settings,
  Bell,
  Plus,
  MoreHorizontal,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ArrowDownLeft,
  UserPlus,
  FileText,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

function StaffDashboard() {
  const navigate = useNavigate();
  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;

  const [loading, setLoading] = useState(true);
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

    setTimeout(() => setLoading(false), 500);
  }, [user]);

  if (!user || loading) return null;

  // Mock data
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const metrics = {
    assignedCustomers: 142,
    customersGrowth: "+12% vs last month",
    overdueLoans: 5,
    actionRequired: "Action Required",
    dueThisWeek: "KES 124,500",
    repaymentsExpected: "18 Repayments expected",
    collectionRate: 85,
    rateChange: "+5%",
  };

  const activeLoans = [
    {
      id: 1,
      customer: "John Doe",
      customerId: "ID: 452003",
      avatar: "JD",
      avatarColor: "#a78bfa",
      loanId: "#LN-2023-88",
      loanType: "Personal",
      balance: "KES 18,000",
      balanceDetail: "of 50,000",
      nextDue: "Oct 30, 2023",
      daysLate: "5 days late",
      isOverdue: true,
    },
    {
      id: 2,
      customer: "Mary Kimani",
      customerId: "ID: 987653",
      avatar: "MK",
      avatarColor: "#60a5fa",
      loanId: "#LN-2023-92",
      loanType: "Business",
      balance: "KES 8,500",
      balanceDetail: "of 30,000",
      nextDue: "Oct 26, 2023",
      daysRemaining: "Due in 4 days",
      isOverdue: false,
    },
    {
      id: 3,
      customer: "Peter Omondi",
      customerId: "ID: 196098",
      avatar: "PO",
      avatarColor: "#fb923c",
      loanId: "#LN-2023-75",
      loanType: "Agriculture",
      balance: "KES 42,000",
      balanceDetail: "of 100,000",
      nextDue: "Oct 28, 2023",
      daysRemaining: "Due in 6 days",
      isOverdue: false,
    },
    {
      id: 4,
      customer: "Alice Mwangi",
      customerId: "ID: 354012",
      avatar: "AM",
      avatarColor: "#a3e635",
      loanId: "#LN-2023-101",
      loanType: "Business",
      balance: "KES 30,000",
      balanceDetail: "of 75,000",
      nextDue: "Nov 02, 2023",
      daysRemaining: "Approved",
      isOverdue: false,
    },
  ];

  const recentRepayments = [
    {
      id: 1,
      name: "Jane Smith",
      account: "MPESA",
      time: "2 min ago",
      amount: "+KES 200",
    },
    {
      id: 2,
      name: "David Kamau",
      account: "Cash",
      time: "43 min ago",
      amount: "+KES 1,000",
    },
    {
      id: 3,
      name: "Grace Wanjiku",
      account: "MPESA",
      time: "2 hours ago",
      amount: "+KES 800",
    },
    {
      id: 4,
      name: "Tom Otieno",
      account: "MPESA",
      time: "5 hours ago",
      amount: "+KES 500",
    },
  ];

  return (
    <div className="staff-dashboard-container">
      {/* SIDEBAR */}
      <aside className="staff-sidebar">
        <div className="staff-logo-section">
          <div className="staff-logo-header">
            <div className="staff-logo-icon">
              <LayoutDashboard size={18} />
            </div>
            <div className="staff-logo">MaliBora</div>
          </div>
          <div className="staff-portal-label">Staff Portal</div>
        </div>

        <nav className="staff-nav">
          <button className="staff-nav-btn active">
            <LayoutDashboard size={18} />
            Dashboard
          </button>
          <button className="staff-nav-btn">
            <Users size={18} />
            Customers
          </button>
          <button className="staff-nav-btn">
            <CreditCard size={18} />
            Loans
          </button>
          <button className="staff-nav-btn">
            <DollarSign size={18} />
            Repayments
          </button>
          <button className="staff-nav-btn">
            <Settings size={18} />
            Settings
          </button>
        </nav>

        <div className="staff-profile-section">
          <div className="staff-profile-avatar">
            <img
              src="https://i.pravatar.cc/150?img=47"
              alt="Sarah Jensen"
            />
          </div>
          <div className="staff-profile-info">
            <div className="staff-profile-name">Sarah Jensen</div>
            <div className="staff-profile-role">Loan Officer</div>
          </div>
          <button className="staff-profile-menu">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="staff-content">
        {/* Header */}
        <header className="staff-header">
          <div className="staff-header-left">
            <div className="staff-date">{currentDate}</div>
            <h1 className="staff-greeting">Good morning, Sarah</h1>
            <p className="staff-subtitle">
              Here is your portfolio overview for today.
            </p>
          </div>
          <div className="staff-header-right">
            <button className="notification-btn">
              <Bell size={20} />
            </button>
            <button className="new-loan-btn">
              <Plus size={18} />
              New Loan Application
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="staff-main">
          {/* Metrics Cards */}
          <section className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon-wrapper blue">
                <Users size={20} />
              </div>
              <div className="metric-label">Assigned Customers</div>
              <div className="metric-value">{metrics.assignedCustomers}</div>
              <div className="metric-subtitle">
                <TrendingUp size={12} />
                {metrics.customersGrowth}
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-wrapper red">
                <TrendingDown size={20} />
              </div>
              <div className="metric-label">Overdue Loans</div>
              <div className="metric-value">{metrics.overdueLoans}</div>
              <div className="metric-subtitle warning">
                {metrics.actionRequired}
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-wrapper green">
                <DollarSign size={20} />
              </div>
              <div className="metric-label">Due This Week</div>
              <div className="metric-value">{metrics.dueThisWeek}</div>
              <div className="metric-subtitle">
                {metrics.repaymentsExpected}
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon-wrapper purple">
                <TrendingUp size={20} />
              </div>
              <div className="metric-label">Collection Rate</div>
              <div className="metric-value">{metrics.collectionRate}%</div>
              <div className="metric-progress">
                <div className="metric-progress-bar">
                  <div
                    className="metric-progress-fill"
                    style={{ width: `${metrics.collectionRate}%` }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Content Grid */}
          <div className="staff-content-grid">
            {/* Active Loans */}
            <section className="active-loans-section">
              <div className="section-header">
                <h2 className="section-title">Active Loans</h2>
                <div className="section-actions">
                  <button className="search-filter-btn">
                    <Search size={16} />
                    Search customer, ID, or Loan #
                  </button>
                  <button className="filter-btn">
                    <Filter size={16} />
                    Filter
                  </button>
                </div>
              </div>

              <div className="loans-table-wrapper">
                <table className="loans-data-table">
                  <thead>
                    <tr>
                      <th>CUSTOMERS</th>
                      <th>LOAN ID</th>
                      <th>BALANCE</th>
                      <th>NEXT DUE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeLoans.map((loan) => (
                      <tr key={loan.id}>
                        <td>
                          <div className="customer-cell">
                            <div
                              className="customer-avatar"
                              style={{ backgroundColor: loan.avatarColor }}
                            >
                              {loan.avatar}
                            </div>
                            <div className="customer-info">
                              <div className="customer-name">
                                {loan.customer}
                              </div>
                              <div className="customer-id">
                                {loan.customerId}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="loan-id-cell">{loan.loanId}</div>
                          <div className="loan-type-cell">{loan.loanType}</div>
                        </td>
                        <td>
                          <div className="balance-cell">{loan.balance}</div>
                          <div className="loan-type-cell">
                            {loan.balanceDetail}
                          </div>
                        </td>
                        <td>
                          <div className="due-date-cell">
                            <div className="due-date">{loan.nextDue}</div>
                            {loan.isOverdue ? (
                              <div className="days-late">{loan.daysLate}</div>
                            ) : (
                              <div className="days-remaining">
                                {loan.daysRemaining}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="table-footer">
                <div className="footer-text">
                  Showing 1 to 4 of 42 results
                </div>
                <div className="pagination-controls">
                  <button className="page-btn" disabled>
                    <ChevronLeft size={16} />
                  </button>
                  <button className="page-btn active">1</button>
                  <button className="page-btn">2</button>
                  <button className="page-btn">3</button>
                  <button className="page-btn">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </section>

            {/* Right Sidebar Content */}
            <div className="right-sidebar-content">
              {/* Recent Repayments */}
              <section className="recent-repayments-section">
                <div className="repayments-header">
                  <h3 className="section-title">Recent Repayments</h3>
                  <button className="view-all-link">View All</button>
                </div>
                <div className="repayments-list">
                  {recentRepayments.map((repayment) => (
                    <div key={repayment.id} className="repayment-item">
                      <div className="repayment-icon">
                        <ArrowDownLeft size={18} />
                      </div>
                      <div className="repayment-info">
                        <div className="repayment-name">{repayment.name}</div>
                        <div className="repayment-details">
                          {repayment.account} • {repayment.time}
                        </div>
                      </div>
                      <div className="repayment-amount">
                        {repayment.amount}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Quick Actions */}
              <section className="quick-actions-section">
                <h3 className="section-title">Quick Actions</h3>
                <div className="quick-actions-grid">
                  <button className="quick-action-btn">
                    <div className="quick-action-icon blue">
                      <UserPlus size={20} />
                    </div>
                    <div className="quick-action-label">Add Customer</div>
                  </button>
                  <button className="quick-action-btn">
                    <div className="quick-action-icon green">
                      <FileText size={20} />
                    </div>
                    <div className="quick-action-label">Log Payment</div>
                  </button>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default StaffDashboard;