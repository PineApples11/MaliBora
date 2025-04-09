import { useState } from 'react'
import './App.css'
import Login from './components/login'
import Dashboard from './components/staff-pages/dashboard'

function App() {
  const [count, setCount] = useState(0)

  return (
    
      <div className='App'>
        <Dashboard />

      </div>
    
    
  )
}

export default App
