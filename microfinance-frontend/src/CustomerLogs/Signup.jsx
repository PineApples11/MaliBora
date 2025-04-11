import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      full_name: '',
      national_id: '',
      phone: '',
      savings_balance: '',
      password: '',
    },
    validationSchema: Yup.object({
      full_name: Yup.string().required('Full name is required'),
      national_id: Yup.string().required('National ID is required'),
      phone: Yup.string().required('Phone number is required'),
      savings_balance: Yup.number().min(0).required('Savings is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    }),
    onSubmit: async (values) => {
      try {
        const res = await fetch('http://127.0.0.1:5555/register-customer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            admin_id: 1, // you can change this later to dynamic admin
            full_name: values.full_name,
            national_id: values.national_id,
            phone: values.phone,
            savings_balance: values.savings_balance,
            created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
            password_hash: values.password,
          }),
        });

        if (!res.ok) {
          const err = await res.json();
          alert(err.error || 'Registration failed');
          return;
        }

        alert("Registration successful! Please log in.");
        navigate('/login');
      } catch (err) {
        console.error('Signup error:', err);
        alert("Something went wrong. Try again.");
      }
    },
  });
  const handleClick = () => {
    navigate('/login')
  }
  return (
    <div>
      <h2>Sign Up</h2>
      <div className="container" height="100px">
        <div className="screen_sign">
          <div className="screen__content">
            <form onSubmit={formik.handleSubmit} className="login">

              <div className="login__field">
                <i className="login__icon fas fa-user"></i>
                <input
                  type="text"
                  name="full_name"
                  className="login__input"
                  placeholder="Full Name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.full_name}
                />
                {formik.touched.full_name && formik.errors.full_name ? <div>{formik.errors.full_name}</div> : null}
              </div>

              <div className="login__field">
                <i className="login__icon fas fa-id-card"></i>
                <input
                  type="text"
                  name="national_id"
                  className="login__input"
                  placeholder="National ID"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.national_id}
                />
                {formik.touched.national_id && formik.errors.national_id ? <div>{formik.errors.national_id}</div> : null}
              </div>

              <div className="login__field">
                <i className="login__icon fas fa-phone"></i>
                <input
                  type="text"
                  name="phone"
                  className="login__input"
                  placeholder="Phone"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.phone}
                />
                {formik.touched.phone && formik.errors.phone ? <div>{formik.errors.phone}</div> : null}
              </div>

              <div className="login__field">
                <i className="login__icon fas fa-wallet"></i>
                <input
                  type="number"
                  name="savings_balance"
                  className="login__input"
                  placeholder="Initial Savings"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.savings_balance}
                />
                {formik.touched.savings_balance && formik.errors.savings_balance ? <div>{formik.errors.savings_balance}</div> : null}
              </div>

              <div className="login__field">
                <i className="login__icon fas fa-lock"></i>
                <input
                  type="password"
                  name="password"
                  className="login__input"
                  placeholder="Password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />
                {formik.touched.password && formik.errors.password ? <div>{formik.errors.password}</div> : null}
              </div>

              <button type="submit" className="button login__submit">
                <span className="button__text">Sign Up Now</span>
                <i className="button__icon fas fa-chevron-right"></i>
              </button>
              <button type='button' onClick={handleClick} className="button login__submit">
                <span className="button__text">Log in Instead</span>
                <i className="button__icon fas fa-chevron-right"></i>
            </button>
            </form>

            <div className="social-login">
              <h3>Sign in via</h3>
              <div className="social-icons">
                <a href="#" className="social-login__icon fab fa-instagram"><img width='20px' src="https://cdn-icons-png.flaticon.com/128/2111/2111463.png" alt="ig" /></a>
                <a href="#" className="social-login__icon fab fa-facebook"><img width='20px' src="https://cdn-icons-png.flaticon.com/128/733/733547.png" alt="fb" /></a>
                <a href="#" className="social-login__icon fab fa-twitter"><img width='20px' src="https://cdn-icons-png.flaticon.com/128/3670/3670151.png" alt="x" /></a>
              </div>
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
};

export default SignUp;
