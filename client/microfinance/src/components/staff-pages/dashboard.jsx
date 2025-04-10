import React, { useEffect, useState } from "react";
import SummaryCard from "./summarycard.jsx";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    approvedLoans: 0,
    pendingLoans: 0,
    totalRepayments: 0,
    totalSavings: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersRes, loansRes, repaymentsRes, savingsRes] = await Promise.all([
          fetch("http://127.0.0.1:5555/customer"),
          fetch("http://127.0.0.1:5555/loan"),
          fetch("http://127.0.0.1:5555/repayment"),
          fetch("http://127.0.0.1:5555/savings-transaction"),
        ]);

        const customers = await customersRes.json();
        const loans = await loansRes.json();
        const repayments = await repaymentsRes.json();
        const savings = await savingsRes.json();

        const approvedLoans = loans.filter((loan) => loan.status === "approved").length;
        const pendingLoans = loans.filter((loan) => loan.status === "pending").length;

        const totalSavings = savings.reduce((sum, tx) => {
          return tx.type === "deposit" ? sum + tx.amount : sum;
        }, 0);

        setStats({
          totalCustomers: customers.length,
          approvedLoans,
          pendingLoans,
          totalRepayments: repayments.length,
          totalSavings,
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Staff Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <SummaryCard title="Total Customers" value={stats.totalCustomers} />
        <SummaryCard title="Approved Loans" value={stats.approvedLoans} />
        <SummaryCard title="Pending Loans" value={stats.pendingLoans} />
        <SummaryCard title="Total Repayments" value={stats.totalRepayments} />
        <SummaryCard
          title="Total Savings (Deposits)"
          value={`KSH ${stats.totalSavings.toLocaleString()}`}
        />
      </div>
    </div>
  );
};

export default Dashboard;
