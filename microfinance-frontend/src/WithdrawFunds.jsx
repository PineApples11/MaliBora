import { useState } from "react";
import "./WithdrawFunds.css";

const WithdrawFunds = () => {
  const [destination, setDestination] = useState("mpesa");
  const [amount, setAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("0755 123 456");

  const fee = amount > 0 ? Math.min(amount * 0.01, 2500) : 0;
  const totalDeducted = Number(amount || 0) + fee;

  return (
    <div className="withdraw-container">
      <header className="withdraw-header">
        <div className="header-left">
          <div className="logo">M</div>
          <h2>MaliBora</h2>
        </div>

        <nav className="nav">
          <a href="#">Dashboard</a>
          <a href="#">Loans</a>
          <a className="active">Savings</a>
          <a href="#">Profile</a>
        </nav>

        <div className="header-right">
          <button className="icon-btn">🔔</button>
          <div className="profile-pic" />
        </div>
      </header>

      <main className="withdraw-main">
        <section className="page-header">
          <h1>Withdraw Funds</h1>
          <p>Select a withdrawal destination and amount.</p>
        </section>

        <div className="content-grid">
          <div className="form-area">
            <div className="balance-card">
              <span>Available Balance</span>
              <h2>450,000 TZS</h2>
            </div>

            <div className="card">
              <h3>1. Select Destination</h3>

              <div className="destination-grid">
                {["mpesa", "tigopesa", "bank"].map((type) => (
                  <label
                    key={type}
                    className={`destination-card ${
                      destination === type ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="destination"
                      checked={destination === type}
                      onChange={() => setDestination(type)}
                    />
                    <span>{type.toUpperCase()}</span>
                  </label>
                ))}
              </div>

              <input
                className="input"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />

              <h3>2. Enter Amount</h3>

              <input
                className="amount-input"
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <div className="quick-amounts">
                {[10000, 50000, 100000].map((v) => (
                  <button key={v} onClick={() => setAmount(v)}>
                    {v.toLocaleString()}
                  </button>
                ))}
                <button onClick={() => setAmount(450000)}>Max</button>
              </div>

              <button className="submit-btn">Confirm Withdrawal</button>
            </div>
          </div>

          <aside className="summary-card">
            <h3>Summary</h3>
            <p>Amount: {Number(amount || 0).toLocaleString()} TZS</p>
            <p>Fee: {fee.toLocaleString()} TZS</p>
            <hr />
            <strong>Total: {totalDeducted.toLocaleString()} TZS</strong>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default WithdrawFunds;
