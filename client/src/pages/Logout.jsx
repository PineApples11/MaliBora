import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/logout', {
        method: 'GET',
        credentials: 'include'  // ensure cookies are sent along with the request
      });
      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        // Redirect user to the login page after a successful logout
        navigate('/login');
      } else {
        setMessage(data.error || 'Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      setMessage('An error occurred during logout.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4">Logout</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
        {message && <p className="mt-4">{message}</p>}
      </div>
    </div>
  );
}
