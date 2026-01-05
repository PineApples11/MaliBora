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

const API_BASE_URL = "http://localhost:5555"; // Update this to match your Flask port

function StaffDashboard() {
  const navigate = useNavigate();
  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;

  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [loans, setLoans] = useState([]);
  const [stats, setStats] = useState(null);
  const [recentRepayments, setRecentRepayments] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  // Fetch all data
useEffect(() => {
  if (!user) return;

  const fetchLoans = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/loans`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setLoans(data.loans || []);
      }
    } catch (err) {
      console.error("Loans fetch error:", err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/staff-dashboard-stats`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error("Stats fetch error:", err);
    }
  };

  const fetchRepayments = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/recent-repayments`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setRecentRepayments(data.recent_repayments || []);
      }
    } catch (err) {
      console.error("Repayments fetch error:", err);
    }
  };

  fetchLoans();
  fetchStats();
  fetchRepayments();
}, [user]);



  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#e74c3c'
      }}>
        <div>Error: {error}</div>
        <button 
          onClick={() => window.location.reload()} 
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  // Use stats from API
  const metrics = {
    assignedCustomers: stats?.assigned_customers || 0,
    customersGrowth: stats?.customers_growth || "+0%",
    overdueLoans: stats?.overdue_loans || 0,
    actionRequired: "Action Required",
    dueThisWeek: `KES ${(stats?.due_this_week_amount || 0).toLocaleString()}`,
    repaymentsExpected: `${stats?.due_this_week_count || 0} Repayments expected`,
    collectionRate: stats?.collection_rate || 0,
    rateChange: "+5%",
  };

  // Transform loans data for display
  const activeLoans = loans
    .filter(loan => loan.status === 'approved')
    .slice((currentPage - 1) * 4, currentPage * 4)
    .map((loan, index) => {
      const isOverdue = loan.due_date && new Date(loan.due_date) < new Date() && loan.remaining_balance > 0;
      const dueDate = loan.due_date ? new Date(loan.due_date) : null;
      const today = new Date();
      const daysUntilDue = dueDate ? Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24)) : null;
      
      // Generate avatar initials from customer name
      const nameParts = (loan.customer_name || "Unknown").split(" ");
      const initials = nameParts.map(part => part[0]).join("").toUpperCase().slice(0, 2);
      
      const colors = ["#a78bfa", "#60a5fa", "#fb923c", "#a3e635", "#f472b6", "#facc15"];
      
      return {
        id: loan.id,
        customer: loan.customer_name || "Unknown",
        customerId: `ID: ${loan.customer_id}`,
        avatar: initials,
        avatarColor: colors[index % colors.length],
        loanId: `#LN-${loan.id}`,
        loanType: "Personal",
        balance: `KES ${loan.remaining_balance?.toLocaleString() || 0}`,
        balanceDetail: `of ${loan.total_amount?.toLocaleString() || 0}`,
        nextDue: loan.due_date || "N/A",
        daysLate: isOverdue ? `${Math.abs(daysUntilDue)} days late` : null,
        daysRemaining: !isOverdue && daysUntilDue !== null ? 
          (daysUntilDue > 0 ? `Due in ${daysUntilDue} days` : "Due today") : "Approved",
        isOverdue: isOverdue,
      };
    });

  const totalActiveLoans = loans.filter(l => l.status === 'approved').length;
  const totalPages = Math.ceil(totalActiveLoans / 4);

  // Transform repayments for display
  const displayRepayments = recentRepayments.slice(0, 4).map(rep => ({
    id: rep.id,
    name: rep.customer_name,
    account: rep.payment_method || "MPESA",
    time: rep.date,
    amount: `+KES ${rep.amount.toLocaleString()}`,
  }));

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
          <button 
          className="staff-nav-btn"
          onClick={() => navigate("/customer-list")}
          >
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
              alt={user?.full_name || "Staff"}
            />
          </div>
          <div className="staff-profile-info">
            <div className="staff-profile-name">{user?.full_name || "Staff Member"}</div>
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
            <h1 className="staff-greeting">
              Good morning, {user?.full_name?.split(' ')[0] || "Staff"}
            </h1>
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
                {activeLoans.length > 0 ? (
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
                ) : (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                    No active loans found
                  </div>
                )}
              </div>

              <div className="table-footer">
                <div className="footer-text">
                  Showing {(currentPage - 1) * 4 + 1} to {Math.min(currentPage * 4, totalActiveLoans)} of {totalActiveLoans} results
                </div>
                <div className="pagination-controls">
                  <button 
                    className="page-btn" 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {[...Array(Math.min(3, totalPages))].map((_, i) => (
                    <button 
                      key={i + 1}
                      className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button 
                    className="page-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  >
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
                  {displayRepayments.length > 0 ? (
                    displayRepayments.map((repayment) => (
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
                    ))
                  ) : (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                      No recent repayments
                    </div>
                  )}
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