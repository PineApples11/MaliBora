import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './login.css'

const Login = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      full_name: '',
      password: '',
    },
    validationSchema: Yup.object({
      full_name: Yup.string().required('Username is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch('http://127.0.0.1:5555/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            full_name: values.full_name,
            password: values.password,
            role: 'customer',
          }),
        });
    
        if (!response.ok) {
          throw new Error('Login failed');
        }
    
        const result = await response.json();
        alert(result.Message);
    
        // Now fetch the logged-in customer's data
        const customerRes = await fetch("http://127.0.0.1:5555/customer", {
          credentials: 'include',
        });
    
        const customers = await customerRes.json();
        const customer = customers.find(c => c.full_name === values.full_name);
    
        if (!customer) {
          alert("Customer details not found.");
          return;
        }
    
        localStorage.setItem("user", JSON.stringify(customer));
        navigate('/customer-homepage', { state: { user: customer } });
    
      } catch (err) {
        console.error(err);
        alert('Login failed. Check credentials.');
      }
    }    
  });

  const handleClick = () => {
    navigate('/signup')
  }

  return (
    <div className='log-container'>
    <div className="container">
      <h2>Login Form</h2>
      <div className="screen_log">
        <div className="screen__content">
          <form onSubmit={formik.handleSubmit} className="login">
  
            <div className="login__field">
              <i className="login__icon fas fa-user"></i>
              <input
                name="full_name"
                type="text"
                className="login__input"
                placeholder="Username"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.full_name}
              />
              {formik.touched.full_name && formik.errors.full_name && (
                <div>{formik.errors.full_name}</div>
              )}
            </div>
  
            <div className="login__field">
              <i className="login__icon fas fa-lock"></i>
              <input
                name="password"
                type="password"
                className="login__input"
                placeholder="Password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {formik.touched.password && formik.errors.password && (
                <div>{formik.errors.password}</div>
              )}
            </div>
  
            <button type="submit" className="button login__submit">
              <span className="button__text">Log In</span>
              <i className="button__icon fas fa-chevron-right"></i>
            </button>
            <button type='button' onClick={handleClick} className="button login__submit">
              <span className="button__text">Sign up Instead</span>
              <i className="button__icon fas fa-chevron-right"></i>
            </button>
          </form>
  
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
};

export default Login;
