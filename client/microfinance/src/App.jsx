import { useState } from 'react'
import './App.css'
import Login from './components/login'
import Dashboard from './components/staff-pages/dashboard'
import Customers from './components/staff-pages/customers'

function App() {
  const [count, setCount] = useState(0)

  return (
    
      <div className='App'>
        <Dashboard />
        <Customers />

      </div>
    
    
  )
}

export default App


