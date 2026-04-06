import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const getLinkClass = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <Sun className="logo-icon" size={32} />
          <span>Solar<span className="text-gradient">Energy</span></span>
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </div>

        <ul className={isOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className={getLinkClass('/')} onClick={closeMenu}>Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/product" className={getLinkClass('/product')} onClick={closeMenu}>Product</Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className={getLinkClass('/about')} onClick={closeMenu}>About</Link>
          </li>
          <li className="nav-item">
            <Link to="/contact" className={getLinkClass('/contact')} onClick={closeMenu}>Contact</Link>
          </li>
          <li className="nav-item mobile-btn">
            <Link to="/contact" className="btn btn-primary" onClick={closeMenu}>Get Quote</Link>
          </li>
        </ul>

        <div className="desktop-btn">
          <Link to="/contact" className="btn btn-primary">Get Quote</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
