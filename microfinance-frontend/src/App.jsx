// import { useState } from 'react'

import './App.css'
import CustomerLoanform from './CustomerLoanForm.jsx';
import CustomerSavingsForm from './CustomerSavingsForm';


function App() {
 

  return (
    <>
      
      <div className="card">
      <h1>MaliBora</h1>
      
        <CustomerLoanform />
        <CustomerSavingsForm />
      
     
      </div>
   
    </>
  )
}

export default App
