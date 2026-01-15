import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Building, LogOut, Calendar, BarChart3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleNavClick = () => {
    if (window.innerWidth <= 768 && onClose) {
      onClose();
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/signin');
    } catch (error) {
      console.error('Failed to log out', error);
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
        <Link to="/reservations" className={`nav-item ${isActive('/reservations')}`} onClick={handleNavClick}>
          <Calendar size={20} />
          <span>Reservations</span>
        </Link>
        <Link to="/analytics" className={`nav-item ${isActive('/analytics')}`} onClick={handleNavClick}>
          <BarChart3 size={20} />
          <span>Analytics</span>
        </Link>
      </nav>
      <div className="sidebar-footer">
        <button className="nav-item logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
