import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Car, Building, LogOut } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>TregoRent Admin</h2>
      </div>
      <nav className="sidebar-nav">
        <Link to="/" className={`nav-item ${isActive('/')}`}>
          <Home size={20} />
          <span>Dashboard</span>
        </Link>
        <Link to="/apartments" className={`nav-item ${isActive('/apartments')}`}>
          <Building size={20} />
          <span>Apartments</span>
        </Link>
        <Link to="/cars" className={`nav-item ${isActive('/cars')}`}>
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
