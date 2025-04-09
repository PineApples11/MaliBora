import React, { useEffect, useState } from "react";
import SummaryCard from "./summarycard";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    activeLoans: 0,
    pendingLoans: 0,
    totalRepayments: 0,
    totalSavings: 0,
  });

  const fetchStats = async () => {
    try {
      const [customersRes, loansRes, repaymentsRes, savingsRes] = await Promise.all([
        fetch("http://127.0.0.1:5555/customers"),
        fetch("http://127.0.0.1:5555/loans"),
        fetch("http://127.0.0.1:5555/repayments"),
        fetch("http://127.0.0.1:5555/savings-transactions"),
      ]);

      const customers = customersRes.ok ? await customersRes.json() : [];
      const loans = loansRes.ok ? await loansRes.json() : [];
      const repayments = repaymentsRes.ok ? await repaymentsRes.json() : [];
      const savings = savingsRes.ok ? await savingsRes.json() : [];

      console.log({ customers, loans, repayments, savings }); // Debug

      setStats({
        totalCustomers: customers.length,
        activeLoans: loans.filter((loan) => loan.status === "approved").length,
        pendingLoans: loans.filter((loan) => loan.status === "pending").length,
        totalRepayments: repayments.length,
        totalSavings: savings.reduce((sum, tx) => {
          return tx.type === "deposit" ? sum + tx.amount : sum;
        }, 0),
      });
    } catch (error) {
      console.error("Failed to fetch dashboard stats", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Staff Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SummaryCard title="Total Customers" value={stats.totalCustomers} />
        <SummaryCard title="Active Loans" value={stats.activeLoans} />
        <SummaryCard title="Pending Loans" value={stats.pendingLoans} />
        <SummaryCard title="Repayments Made" value={stats.totalRepayments} />
        <SummaryCard title="Total Savings" value={`KSH ${stats.totalSavings}`} />
      </div>
    </div>
  );
};

export default Dashboard;
