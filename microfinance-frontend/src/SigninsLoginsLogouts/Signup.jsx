import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom'; 

const SignUp = () => {
  const navigate = useNavigate(); 

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    }),
    onSubmit: async (values) => {
      try {
        console.log('User signed up with:', values);

        navigate('/login'); //redirect to login page
      } catch (err) {
        console.log('Error during signup:', err);
      }
    },
  });

  return (
    <div>
      <h2>Sign Up</h2>
      {/* <form onSubmit={formik.handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
          {formik.touched.name && formik.errors.name ? <div>{formik.errors.name}</div> : null}
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email ? <div>{formik.errors.email}</div> : null}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password ? <div>{formik.errors.password}</div> : null}
        </div>
        <button type="submit">Sign Up</button>
      </form> */}
 <div class="container">
	<div class="screen">
		<div class="screen__content">
    <form onSubmit={formik.handleSubmit} className="login">
  <div className="login__field">
    <i className="login__icon fas fa-user"></i>
    <input
      type="text"
      id="name"
      name="name"
      className="login__input"
      placeholder="Full Name"
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      value={formik.values.name}
    />
    {formik.touched.name && formik.errors.name ? <div>{formik.errors.name}</div> : null}
  </div>
  <div className="login__field">
    <i className="login__icon fas fa-envelope"></i>
    <input
      type="email"
      id="email"
      name="email"
      className="login__input"
      placeholder="User name / Email"
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      value={formik.values.email}
    />
    {formik.touched.email && formik.errors.email ? <div>{formik.errors.email}</div> : null}
  </div>
  <div className="login__field">
    <i className="login__icon fas fa-lock"></i>
    <input
      type="password"
      id="password"
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
</form>


			<div class="social-login">
				<h3>log in via</h3>
				<div class="social-icons">
					<a href="#" class="social-login__icon fab fa-instagram"></a>
					<a href="#" class="social-login__icon fab fa-facebook"></a>
					<a href="#" class="social-login__icon fab fa-twitter"></a>
				</div>
			</div>
		</div>
		<div class="screen__background">
			<span class="screen__background__shape screen__background__shape4"></span>
			<span class="screen__background__shape screen__background__shape3"></span>		
			<span class="screen__background__shape screen__background__shape2"></span>
			<span class="screen__background__shape screen__background__shape1"></span>
		</div>		
	</div>
</div>

    </div>
  );
};

export default SignUp;