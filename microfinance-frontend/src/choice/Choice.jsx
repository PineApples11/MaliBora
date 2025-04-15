import { useNavigate } from 'react-router-dom';
function Choice() {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/')
    }
    const isAdmin = () => {
      navigate("/admin/*")
    }
    const isCustomer = () => {
        navigate('/signup')
    }
    const isStaff = () => {
      navigate("/staff/dashboard")
    }
    return (
      <>
        <div className='main-con'>
            <div className="MaliBora">
               <h1>MALIBORA</h1>
            </div>
            <div className="MaliBora">
               <h3>What is your role?</h3>
            </div>
            <div class="container">
                <div class="btn" onClick={isAdmin}><a href="#">Admin</a></div>
                <div class="btn" onClick={isStaff}><a href="#" >Staff</a></div>
                <div class="btn" onClick={isCustomer}><a href="#" >Customer</a></div>
            </div>
            <div className="MaliBora">
               <button type="button"onClick={handleClick} >Back</button> 
            </div>	
        </div>

      </>
    )
  }
  
  export default Choice
  