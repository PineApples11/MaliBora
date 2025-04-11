// import { useState } from 'react'

import './App.css'
import CustomerLoanform from './CustomerLoanForm.jsx';
import CustomerSavingsForm from './CustomerSavingsForm';


function App() {
 

  return (
    <>
      <h1>MaliBora</h1>
      <div className="card">
        
        <CustomerLoanform />
        <CustomerSavingsForm />
      
     
      </div>
   
    </>
  )
}

export default App
