import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const StaffLogin = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      full_name: '',
      password: '',
    },
    validationSchema: Yup.object({
      full_name: Yup.string().required('Full name is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch('http://127.0.0.1:5555/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            full_name: values.full_name,
            password: values.password,
            role: 'staff',
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Login failed');
        }

        localStorage.setItem('staffUser', JSON.stringify({ full_name: values.full_name }));
        navigate('/staff/dashboard');
      } catch (err) {
        alert(err.message);
      }
    },
  });

  const handleBack = () => {
    navigate('/choice');
  };

  return (
    <div className="log-container">
      <h2>Staff Login</h2>
      <div className="container">
        <div className="screen_sign">
          <div className="screen__content">
            <form onSubmit={formik.handleSubmit} className="login">
              <div className="login__field">
                <i className="login__icon fas fa-user"></i>
                <input
                  name="full_name"
                  type="text"
                  className="login__input"
                  placeholder="Full Name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.full_name}
                />
                {formik.touched.full_name && formik.errors.full_name && (
                  <div className="error-text">{formik.errors.full_name}</div>
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
                  <div className="error-text">{formik.errors.password}</div>
                )}
              </div>

              <button type="submit" className="button login__submit">
                <span className="button__text">Log In</span>
                <i className="button__icon fas fa-chevron-right"></i>
              </button>

              {/* 🔙 Back Button */}
              <button type="button" onClick={handleBack} className="button login__submit">
                <span className="button__text">Back to Choices</span>
                <i className="button__icon fas fa-arrow-left"></i>
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

export default StaffLogin;
