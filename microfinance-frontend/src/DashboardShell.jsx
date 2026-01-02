import { LogOut, User } from "lucide-react";
import "./DashboardShell.css";

function DashboardShell({ user, navigation = [], onLogout, children }) {
  if (!user) {
    return (
      <div className="dashboard-loading">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="dashboard-shell">
      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">
        <h1>Loan System</h1>
        <nav>
          {navigation.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className={item.active ? "active" : ""}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-main">
        {/* TOP BAR */}
        <div className="dashboard-topbar">
          <div>
            <p>Welcome back</p>
            <h2>{user.full_name}</h2>
          </div>

          <div className="dashboard-user-controls">
            <User />
            <button className="dashboard-logout" onClick={onLogout}>
              <LogOut />
              Logout
            </button>
          </div>
        </div>

        {/* PAGE CONTENT */}
        {children}
      </main>
    </div>
  );
}

export default DashboardShell;
