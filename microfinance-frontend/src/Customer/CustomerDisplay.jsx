import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react"

function CustomerDisplay() {
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setCustomer(user);
    }
  }, []);

  if (!customer) return <p>Loading customer...</p>;

  const handleLoan = () => {
    navigate('/customer-loans')
  }
  const handleRepayments = () => {
    navigate('/customer-repayments')
  }

    return (
      <>
        <h1>Customer Profile</h1>
        <p>id : {customer.id}</p>
        <p>full_name : {customer.full_name}</p>
        <p>national_id : {customer.national_id}</p>
        <p>savings balance : {customer.savings_balance}</p>
        <p>created at : {customer.created_at}</p>
        <p>admin id : {customer.admin_id}</p>

        <button type="button" onClick={handleLoan} >Take a Loan</button>
        <button onClick={handleRepayments}>Make Repayments </button>

        {/* <Loan customer_id={customer.id}/> */}
      </>
    )
  }
  
  export default CustomerDisplay