import { useNavigate } from 'react-router-dom';
import React, { useState,useEffect } from 'react';

function CustomerLoanForm() {
    const navigate = useNavigate();
  function getCurrentDateTime() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so we add 1
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDateTime;
}

const [customer, setCustomer] = useState(null);

useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user) {
    setCustomer(user);
  }
}, []);

  const [formData, setFormData] = useState({
    amount: '',
    customer_id: '',
    interest_rate: 15,
    status: 'pending',
    issued_date: getCurrentDateTime(),
    due_date: getCurrentDateTime(),
  });
  
  useEffect(() => {
    if (customer) {
      setFormData({
        amount: '',
        customer_id: customer.id,
        interest_rate: 15,
        status: 'pending',
        issued_date: getCurrentDateTime(),
        due_date: getCurrentDateTime(),
      });
    }
  }, [customer]);

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');


  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    

    setError(null);
    setSuccessMessage('');

    try {
      const response =await fetch("http://127.0.0.1:5555/loan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(error => console.log("Error:", error));

    alert("Loan Successfully Made")
    navigate('/customer-homepage')

    } catch (e) {
      setError('Failed to submit loan request. Please try again later.');
      console.error('Error submitting loan request:', e);
    }
  }
  const handleGoBack = () => {
    navigate('/customer-homepage')
  }

  return (
<div className='log-container'>
  <h2>Loan Form</h2>
  <div className="container">
    <div className="screen_sign">
      <div className="screen__content">
        <form onSubmit={handleSubmit} className="login">

          <div className="login__field">
            <i className="login__icon fas fa-dollar-sign"></i>
            <input
              type="number"
              name="amount"
              placeholder="Enter amount"
              className="login__input"
              value={formData.amount}
              onChange={handleChange}
              required
              min="1"
              step="0.01"
            />
          </div>

          <div className="login__field">
            <i className="login__icon fas fa-percent"></i>
            <input
              type="number"
              name="interest_rate"
              placeholder="Interest Rate"
              className="login__input"
              value={formData.interest_rate}
              readOnly
            />
          </div>

          <button type="submit" className="button login__submit">
            <span className="button__text">Submit Loan Request</span>
            <i className="button__icon fas fa-chevron-right"></i>
          </button>

          <button type="button" onClick={handleGoBack} className="button login__submit">
            <span className="button__text">Back to Dashboard</span>
            <i className="button__icon fas fa-arrow-left"></i>
          </button>

        </form>

        {error && <p style={{ color: 'red', marginTop: '10px' }}>Error: {error}</p>}
        {successMessage && <p style={{ color: 'green', marginTop: '10px' }}>{successMessage}</p>}
        <div className="social-login">
            <h3>Loan Form</h3>
      </div>
      </div>



      <div className="screen__background">
        <span className="screen__background__shape screen__background__shape4"></span>
        <span className="screen__background__shape screen__background__shape3"></span>
        <span className="screen__background__shape screen__background__shape2"></span>
        <span className="screen__background__shape screen__background__shape1"></span>
      </div>
    </div>
  </div>
</div>

  );
}

export default CustomerLoanForm;