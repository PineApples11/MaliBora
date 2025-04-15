import React, { useEffect, useState } from "react";
import SummaryCard from "./summarycard.jsx";
import Loading from "../Loading/Loading.jsx"
import "./dashboard.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    approvedLoans: 0,
    pendingLoans: 0,
    totalRepayments: 0,
    totalSavings: 0,
  });
  const [active, setActive] = useState(true)

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
        setActive(false)
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };


    fetchData();
  }, []);

  return (
<<<<<<< HEAD
    <div className="wrap">
    <div className="dashboard-page">
      {/* <h1 className="dashboard-title">Welcome to the Staff Dashboard</h1> */}
      <div className="card-grid">
        <SummaryCard title="Total Customers" value={stats.totalCustomers} link="/customers" />
        <SummaryCard title="Approved Loans" value={stats.approvedLoans} link="/loans" />
        <SummaryCard title="Pending Loans" value={stats.pendingLoans} link="/loans" />
        <SummaryCard title="Total Repayments" value={stats.totalRepayments} link="/repayments" />
        <SummaryCard
          title="Total Savings (Deposits)"
          value={`KSH ${stats.totalSavings.toLocaleString()}`}
          link="/savings"
        />
=======
    active ? (
     <div className="loader">
       <Loading />
     </div>
    ) : (
      <div className="wrap">
        <div className="dashboard-page">
          <h1 className="dashboard-title">Welcome to the Staff Dashboard</h1>
          <div className="card-grid">
            <SummaryCard title="Total Customers" value={stats.totalCustomers} link="/customers" />
            <SummaryCard title="Approved Loans" value={stats.approvedLoans} link="/loans" />
            <SummaryCard title="Pending Loans" value={stats.pendingLoans} link="/loans" />
            <SummaryCard title="Total Repayments" value={stats.totalRepayments} link="/repayments" />
            <SummaryCard
              title="Total Savings (Deposits)"
              value={`KSH ${stats.totalSavings.toLocaleString()}`}
              link="/savings"
            />
          </div>
        </div>
>>>>>>> 596db710f1b441dc2431cfa5cbc6b852a752996c
      </div>
    )
  );
  
};

export default Dashboard;