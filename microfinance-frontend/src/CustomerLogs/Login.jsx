import { data, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './login.css';

const Login = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      full_name: '',
      password: '',
    },
    validationSchema: Yup.object({
      full_name: Yup.string().required('Username is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    }),
    onSubmit: async (values) => {
      try {
        // ✅ Send login request
        const response = await fetch('http://localhost:5555/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          credentials: 'include', // important for session cookie
          body: JSON.stringify({
            username: values.full_name.trim(), // trim spaces
            password: values.password,
            role: 'staff', // must match backend model_map keys
          }),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Login failed');
        }

        // ✅ Login successful, now check session
        const meRes = await fetch('http://localhost:5555/me', {
          credentials: 'include',
        });

        if (!meRes.ok) {
          throw new Error('Failed to fetch session');
        }

        const me = await meRes.json();
        localStorage.setItem('user', JSON.stringify(me));

        // ✅ Role-based routing
        switch (me.role) {
          case 'staff':
            navigate('/staff-homepage');
            break;
          case 'customer':
            navigate('/customer-homepage');
            break;
          case 'admin':
            navigate('/admin-dashboard');
            break;
          default:
            alert('Unknown role, cannot route');
        }
      } catch (err) {
        console.error(err);
        alert(err.message || 'Login failed. Check credentials.');
      }
    },
  });

  const handleClick = () => {
    navigate('/signup');
  };

  return (
    <div className="log-container">
      <div className="l-container">
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
              <button
                type="button"
                onClick={handleClick}
                className="button login__submit"
              >
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