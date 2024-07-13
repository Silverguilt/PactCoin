import React from 'react';
import Navbar from './Navbar';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <h1 className="logo">PactCoin</h1>
      <Navbar />
    </header>
  );
}

export default Header;
