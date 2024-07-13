import React, { useContext } from 'react';
import { AuthContext } from './authContext.jsx';

const Home = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);

  return (
    <div className="block">
      <h2>Home</h2>
      {isAuthenticated ? (
        <div>
          <p>You are logged in!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <p>You are not logged in. Please log in or register.</p>
      )}
    </div>
  );
};

export default Home;
