import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "", // for admin
      full_name: "", // for staff/customer
      password: "",
      role: "admin", // default role
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch("http://127.0.0.1:5555/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(values),
        });

        const result = await response.json();

        if (!response.ok) {
          toast.error(result.error || "Login failed. Check credentials.");
          return;
        }

        toast.success(result.message || "Login successful");

        if (result.user) {
          localStorage.setItem("user", JSON.stringify(result.user));
          navigate(`/${values.role}-homepage`, {
            state: { user: result.user },
          });
        }
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong. Try again.");
      }
    },
  });

  const handleClick = () => {
    navigate("/signup");
  };

  return (
    <div className="log-container">
      <div className="container">
        <h2>Login Form</h2>
        <div className="screen_log">
          <div className="screen__content">
            <form onSubmit={formik.handleSubmit} className="login">
              {/* Role selector */}
              <div className="login__field">
                <select
                  name="role"
                  value={formik.values.role}
                  onChange={formik.handleChange}
                  className="login__input"
                >
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                  <option value="customer">Customer</option>
                </select>
              </div>

              {/* Conditional input field */}
              {formik.values.role === "admin" ? (
                <div className="login__field">
                  <i className="login__icon fas fa-user"></i>
                  <input
                    name="username"
                    type="text"
                    className="login__input"
                    placeholder="Username"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.username}
                  />
                  {formik.touched.username && formik.errors.username && (
                    <div>{formik.errors.username}</div>
                  )}
                </div>
              ) : (
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
                    <div>{formik.errors.full_name}</div>
                  )}
                </div>
              )}

              {/* Password */}
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
