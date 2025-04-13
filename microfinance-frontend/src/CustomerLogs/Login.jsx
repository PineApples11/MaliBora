import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function Login() {
  const navigate = useNavigate(); // ✅ now inside the component

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
    navigate('/signup');
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <input
        type="text"
        name="full_name"
        onChange={formik.handleChange}
        value={formik.values.full_name}
        placeholder="Full Name"
      />
      <input
        type="password"
        name="password"
        onChange={formik.handleChange}
        value={formik.values.password}
        placeholder="Password"
      />
      <button type="submit">Login</button>
      <button type="button" onClick={handleClick}>Sign Up</button>
    </form>
  );
}

export default Login;
