function LoansSection({ loans, title = "Loans", emptyText }) {
  if (!loans || loans.length === 0) {
    return <p className="no-data">{emptyText}</p>;
  }

  return (
    <section className="service-section">
      <div className="transfer-section-header">
        <h2>{title}</h2>
        <p>Empowering dreams, one loan at a time.</p>
      </div>

      <div className="loan-list">
        {loans.map(loan => (
          <div key={loan.id} className="transfer">
            <div className="transfer-logo">
              {loan.status === "approved" && (
                <img src="https://cdn-icons-png.flaticon.com/128/16208/16208195.png" />
              )}
              {loan.status === "pending" && (
                <img src="https://cdn-icons-png.flaticon.com/128/16265/16265301.png" />
              )}
              {loan.status === "rejected" && (
                <img src="https://cdn-icons-png.flaticon.com/128/11373/11373685.png" />
              )}
            </div>

            <dl className="transfer-details">
              <div>
                <dt>{loan.status}</dt>
              </div>
              <div>
                <dt>{loan.interest_rate}%</dt>
                <dd>Interest</dd>
              </div>
              <div>
                <dt>{new Date(loan.issued_date).toLocaleDateString()}</dt>
                <dd>Issued</dd>
              </div>
            </dl>

            <div className="transfer-number">
              KES {loan.amount}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default LoansSection;
