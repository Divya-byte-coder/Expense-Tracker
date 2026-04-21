import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Wallet, LogOut, PlusCircle, LayoutDashboard, History, Sun, Moon } from 'lucide-react';

const Navbar = ({ theme, toggleTheme }) => {
  const { isAuthenticated, logout, user } = useContext(AuthContext);

  const onLogout = () => {
    logout();
  };

  const authLinks = (
    <>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <LayoutDashboard size={20} /> Dashboard
      </Link>
      <Link to="/add" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <PlusCircle size={20} /> Add Transaction
      </Link>
      <Link to="/history" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <History size={20} /> History
      </Link>
      <a onClick={onLogout} href="#!" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <LogOut size={20} /> Logout
      </a>
      <button 
        onClick={toggleTheme} 
        style={{ 
          background: 'none', border: 'none', cursor: 'pointer', 
          color: 'var(--text-main)', display: 'flex', alignItems: 'center' 
        }}
        title="Toggle Theme"
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>
      <span style={{ color: 'var(--text-muted)' }}>| Hello, {user && user.name}</span>
    </>
  );

  const guestLinks = (
    <>
      <Link to="/register">Register</Link>
      <Link to="/login">Login</Link>
    </>
  );

  return (
    <nav className="navbar">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Wallet size={28} /> Tracker
        </Link>
        <div className="nav-links">
          {isAuthenticated ? authLinks : guestLinks}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
