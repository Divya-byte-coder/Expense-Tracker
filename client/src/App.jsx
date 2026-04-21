import React, { useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { TransactionProvider } from './context/TransactionContext';

// Components
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import AddTransaction from './components/AddTransaction';
import TransactionList from './components/TransactionList';
import Login from './components/Login';
import Signup from './components/Signup';

import './index.css';

// Intercept all axios requests to add token
import axios from 'axios';
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Private Route Component
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  
  if (loading) return <div>Loading...</div>; // Could be a spinner

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  const { isAuthenticated } = useContext(AuthContext);

  // Theme support
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <Router>
      {isAuthenticated && <Navbar theme={theme} toggleTheme={toggleTheme} />}
      <Routes>
        <Route path="/register" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/add" 
          element={
            <PrivateRoute>
              <AddTransaction />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/history" 
          element={
            <PrivateRoute>
              <TransactionList />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <TransactionProvider>
        <AppContent />
      </TransactionProvider>
    </AuthProvider>
  );
};

export default App;
