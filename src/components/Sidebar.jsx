import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Car, Building, LogOut } from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleNavClick = () => {
    if (window.innerWidth <= 768 && onClose) {
      onClose();
    }
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h2>TregoRent Admin</h2>
      </div>
      <nav className="sidebar-nav">
        <Link to="/" className={`nav-item ${isActive('/')}`} onClick={handleNavClick}>
          <Home size={20} />
          <span>Dashboard</span>
        </Link>
        <Link to="/apartments" className={`nav-item ${isActive('/apartments')}`} onClick={handleNavClick}>
          <Building size={20} />
          <span>Apartments</span>
        </Link>
        <Link to="/cars" className={`nav-item ${isActive('/cars')}`} onClick={handleNavClick}>
          <Car size={20} />
          <span>Cars</span>
        </Link>
      </nav>
      <div className="sidebar-footer">
        <button className="nav-item logout-btn">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
