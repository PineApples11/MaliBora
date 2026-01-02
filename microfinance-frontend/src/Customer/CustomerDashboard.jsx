import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardShell from "../DashboardShell";
import LoansSection from "../LoanSection";

function CustomerDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("me"));
  const [loans, setLoans] = useState([]);

  // Redirect SAFELY
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;

    fetch("/loan", { credentials: "include" })
      .then(res => res.json())
      .then(data =>
        setLoans(data.filter(l => l.customer_id === user.id))
      );
  }, [user]);

  return (
    <DashboardShell
      user={user}
      onLogout={() => {
        localStorage.removeItem("user");
        navigate("/login");
      }}
      navigation={[
        { label: "Dashboard", active: true },
        { label: "Transactions", onClick: () => navigate("/customer-transactions") },
        { label: "Take Loan", onClick: () => navigate("/customer-loans") },
      ]}
    >
      <LoansSection loans={loans} />
    </DashboardShell>
  );
}

export default CustomerDashboard;
