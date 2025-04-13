import React, { useState } from 'react';

export default function AdminCreateUser() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'customer'
  });
  const [response, setResponse] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/admin/create-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    setResponse(data);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Create Customer</h2>
        <form onSubmit={handleSubmit}>
          
          <label className="block mb-2">
            Username:
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
              required
            />
          </label>
          <label className="block mb-2">
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
              required
            />
          </label>
          <label className="block mb-2">
            Password:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
              required
            />
          </label>
          <button type="submit" className="w-full bg-purple-500 text-white p-2 mt-4 rounded">
            Create User
          </button>
        </form>
        {response && (
          <div className="mt-4 p-2 bg-gray-50 border rounded">
            {response.error ? (
              <p className="text-red-500">{response.error}</p>
            ) : (
              <div>
                <p className="text-green-600 font-bold">{response.message}</p>
                {response.login_details && (
                  <div className="text-sm">
                    <p>Username: {response.login_details.username}</p>
                    <p>Email: {response.login_details.email}</p>
                    <p>Password: {response.login_details.password}</p>
                    <p>Role: {response.login_details.role}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
