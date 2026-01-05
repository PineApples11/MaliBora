import React, { useState, useEffect } from 'react';
import './StaffCustomers.css';

const StaffCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [sortBy, setSortBy] = useState('Name (A-Z)');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('http://localhost:5000/assigned-customers', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.customers) {
        setCustomers(data.customers);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setLoading(false);
    }
  };

  const fetchCustomerDetails = async (customerId) => {
    try {
      const [loansRes, savingsRes] = await Promise.all([
        fetch(`http://localhost:5000/loans/${customerId}`, { credentials: 'include' }),
        fetch(`http://localhost:5000/savings/${customerId}`, { credentials: 'include' })
      ]);

      const loansData = await loansRes.json();
      const savingsData = await savingsRes.json();

      setSelectedCustomer({
        ...loansData.customer,
        loans: loansData.loans || [],
        savings_transactions: savingsData.savings_transactions || []
      });
    } catch (error) {
      console.error('Error fetching customer details:', error);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'approved': { label: 'Active', class: 'status-active' },
      'pending': { label: 'Pending', class: 'status-pending' },
      'overdue': { label: 'Overdue', class: 'status-overdue' },
      'closed': { label: 'Closed', class: 'status-closed' }
    };
    return statusConfig[status] || { label: status, class: 'status-default' };
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length > 2) {
      try {
        const response = await fetch(`http://localhost:5000/customer-search?q=${query}`, {
          credentials: 'include'
        });
        const data = await response.json();
        if (data.customers) {
          setCustomers(data.customers);
        }
      } catch (error) {
        console.error('Error searching customers:', error);
      }
    } else if (query.length === 0) {
      fetchCustomers();
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.national_id?.includes(searchQuery) ||
                         customer.phone?.includes(searchQuery);
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="staff-dashboard">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="brand">
            <span className="brand-icon">M</span>
            <span className="brand-name">Malibora</span>
          </div>
          <span className="portal-label">Staff Portal</span>
        </div>
        
        <nav className="sidebar-nav">
          <a href="/dashboard" className="nav-item">
            <i className="icon-dashboard"></i>
            Dashboard
          </a>
          <a href="/customers" className="nav-item active">
            <i className="icon-customers"></i>
            Customers
          </a>
          <a href="/loans" className="nav-item">
            <i className="icon-loans"></i>
            Loans
          </a>
          <a href="/repayments" className="nav-item">
            <i className="icon-repayments"></i>
            Repayments
          </a>
          <a href="/settings" className="nav-item">
            <i className="icon-settings"></i>
            Settings
          </a>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <img src="/api/placeholder/32/32" alt="User" className="user-avatar" />
            <div className="user-info">
              <span className="user-name">Sarah Jensen</span>
              <span className="user-role">Loan Officer</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="page-header">
          <div className="breadcrumb">
            <span>Staff Portal</span>
            <span className="separator">/</span>
            <span className="current">Customers</span>
          </div>
          <button className="btn-add-customer">
            <i className="icon-plus"></i>
            Add Customer
          </button>
        </header>

        <div className="content-wrapper">
          <div className="page-title-section">
            <div>
              <h1 className="page-title">Assigned Customers</h1>
              <p className="page-subtitle">Manage and monitor {filteredCustomers.length} customers.</p>
            </div>
            <button className="btn-export">
              <i className="icon-download"></i>
              Export List
            </button>
          </div>

          <div className="filters-section">
            <div className="search-box">
              <i className="icon-search"></i>
              <input
                type="text"
                placeholder="Search by name, national ID or phone..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <select 
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Statuses</option>
              <option>Active</option>
              <option>Pending</option>
              <option>Overdue</option>
            </select>
            <select 
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option>Sort by: Name (A-Z)</option>
              <option>Name (Z-A)</option>
              <option>Recent First</option>
              <option>Oldest First</option>
            </select>
          </div>

          <div className="customers-table">
            <table>
              <thead>
                <tr>
                  <th>CUSTOMER</th>
                  <th>CONTACT / ID</th>
                  <th>LOAN STATUS</th>
                  <th>BALANCE</th>
                  <th>NEXT DUE / NOTE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {displayedCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <div className="customer-cell">
                        <div className="customer-avatar">
                          {customer.full_name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div className="customer-name">{customer.full_name}</div>
                          <div className="customer-date">Joined {customer.created_at || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="contact-cell">
                        <div>{customer.phone || 'N/A'}</div>
                        <div className="customer-id">ID: {customer.national_id || 'N/A'}</div>
                      </div>
                    </td>
                    <td>
                      <span className="status-badge status-active">
                        Active
                      </span>
                    </td>
                    <td>
                      <div className="balance-cell">
                        <div className="balance-amount">KES 0.00</div>
                        <div className="balance-note">of KES 0.00</div>
                      </div>
                    </td>
                    <td>
                      <div className="due-cell">
                        <div className="due-date">No active loan</div>
                      </div>
                    </td>
                    <td>
                      <button 
                        className="btn-view-details"
                        onClick={() => fetchCustomerDetails(customer.id)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <span className="pagination-info">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredCustomers.length)} of {filteredCustomers.length} results
            </span>
            <div className="pagination-controls">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                &lt;
              </button>
              {[...Array(Math.min(5, totalPages))].map((_, i) => (
                <button
                  key={i + 1}
                  className={currentPage === i + 1 ? 'active' : ''}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              {totalPages > 5 && <span>...</span>}
              {totalPages > 5 && (
                <button onClick={() => setCurrentPage(totalPages)}>
                  {totalPages}
                </button>
              )}
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </main>

      {selectedCustomer && (
        <aside className="customer-details-panel">
          <div className="panel-header">
            <button 
              className="btn-close"
              onClick={() => setSelectedCustomer(null)}
            >
              ×
            </button>
          </div>
          
          <div className="customer-details-content">
            <div className="customer-profile">
              <div className="profile-avatar large">
                {selectedCustomer.full_name?.split(' ').map(n => n[0]).join('') || 'UK'}
              </div>
              <h2 className="profile-name">{selectedCustomer.full_name}</h2>
              <span className="profile-status active">Active</span>
              <p className="profile-joined">Joined Jan 15, 2024 • 2 weeks ago</p>
            </div>

            <div className="details-section">
              <div className="section-header">
                <h3>Personal Information</h3>
                <button className="btn-edit">Edit</button>
              </div>
              <div className="info-grid">
                <div className="info-item">
                  <label>Email Address</label>
                  <p>{selectedCustomer.email || 'Not provided'}</p>
                </div>
                <div className="info-item">
                  <label>Phone Number</label>
                  <p>{selectedCustomer.phone || 'N/A'}</p>
                </div>
                <div className="info-item">
                  <label>Residential Address</label>
                  <p>Nairobi, Kenya</p>
                </div>
                <div className="info-item">
                  <label>Occupation</label>
                  <p>Small Business Owner</p>
                </div>
              </div>
            </div>

            <div className="details-section">
              <h3>Financial Overview</h3>
              <div className="financial-card">
                <div className="financial-item">
                  <label>TOTAL SAVINGS</label>
                  <p className="amount success">KES 65,000</p>
                  <span className="growth">Available for withdrawal: KES 60,000</span>
                </div>
              </div>
              <div className="financial-card">
                <div className="financial-item">
                  <label>Total Loan Balance</label>
                  <p className="amount">KES 0.00</p>
                </div>
                <div className="financial-item">
                  <label>Next Repayment Amount</label>
                  <p className="amount">KES 0.00</p>
                </div>
                <div className="financial-item">
                  <label>Credit Score</label>
                  <div className="credit-score">
                    <div className="score-bar">
                      <div className="score-fill good" style={{width: '75%'}}></div>
                    </div>
                    <span>Good</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <button className="btn-primary">View Full Profile</button>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};

export default StaffCustomers;