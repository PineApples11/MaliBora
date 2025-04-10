import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; //for linking to restaurant details or other pages

const Homepage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  //check if user is logged in and retrieves user info from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      setUser(userData);
    } else {
      //if no user is found in localStorage, redirect to login
      navigate('/login');
    }
  }, [navigate]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('user');  //remove user info from localStorage
    setUser(null);  //clear the user state
    navigate('/login');  //redirect to login page
  };

  const restaurants = [
    { id: 1, name: "Dau Swahili Restaurant", location: "Nairobi, Kingari Rd" },
    { id: 2, name: "Exodus Restaurant", location: "Nairobi, Plaza Jay" },
    { id: 3, name: "Khum Indian Cuisine", location: "Nairobi, along Waiyaki Way" },
    { id: 4, name: "Java Restaurant", location: "Nairobi, Westlands" },
    { id: 5, name: "KFC", location: "Nairobi, along Ngong Road" },
  ];

  return (
    <div className="homepage-container">
      <header className="header">
        <div className="profile-tab">
          {user ? (
            <>
              <span>Welcome, {user.name}</span>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <span>Loading...</span>
          )}
        </div>
      </header>

  <div className="restaurant-list">
    {restaurants.map((restaurant) => (
      <div key={restaurant.id} className="restaurant-card">
        <h2>{restaurant.name}</h2>
        <p>{restaurant.location}</p>
        <Link to={`/restaurant/${restaurant.id}`}>View Menu</Link>
      </div>
    ))}
  </div>

  <footer className="footer">
    <p>© 2025 Food Delivery App</p>
  </footer>
</div>
  );
};

export default Homepage;