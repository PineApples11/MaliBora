import { useState, useEffect } from "react"

function CustomerDisplay() {
  const [customer, setCustomer] = useState([])

  useEffect(() => {
    fetch("http://127.0.0.1:5555/customer/1")
      .then(res => res.json())
      .then(customer => setCustomer(customer))
  },[])

    return (
      <>
        <h1>Customer Profile</h1>
        <p>id : {customer.id}</p>
        <p>full_name : {customer.full_name}</p>
        <p>national_id : {customer.national_id}</p>
        <p>savings balance : {customer.savings_balance}</p>
        <p>created at : {customer.created_at}</p>
        <p>admin id : {customer.admin_id}</p>

        <Loan customer_id={customer.id}/>
      </>
    )
  }
  
  export default CustomerDisplay