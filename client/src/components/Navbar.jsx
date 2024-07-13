import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <NavLink
            to="/"
            exact
            activeClassName="active"
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/register"
            activeClassName="active"
          >
            Register
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/login"
            activeClassName="active"
          >
            Login
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/blockchain"
            activeClassName="active"
          >
            Blockchain
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
