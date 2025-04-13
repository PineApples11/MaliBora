import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ setCurrentUser }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [response, setResponse] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (res.ok && data.user) { // Add validation for user data
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        setCurrentUser(data.user);
        navigate('/dashboard');
      } else {
        setResponse({ error: data.error || "Invalid credentials" });
      }
    } catch (error) {
      console.error('Login error:', error);
      setResponse({ error: "Network error" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
        <div className="text-center mb-8">
          <img 
            src="/logo.svg" 
            alt="Bank Logo" 
            className="h-16 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-500">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Sign in
          </button>

          {response?.error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              ⚠️ {response.error}
            </div>
          )}
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Need access? Contact your account administrator
        </p>
      </div>
    </div>
  );
}
