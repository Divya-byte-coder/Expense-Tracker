import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [user, setUser] = useState({
    email: '',
    password: ''
  });

  const [formError, setFormError] = useState('');

  const { login, error, clearErrors, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }

    if (error) {
      setFormError(error);
      clearErrors();
    }
  }, [error, isAuthenticated, navigate, clearErrors]);

  const { email, password } = user;

  const onChange = e => {
    setFormError('');
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onSubmit = e => {
    e.preventDefault();
    if (email === '' || password === '') {
      setFormError('Please fill in all fields');
    } else {
      login({ email, password });
    }
  };

  return (
    <div className="auth-container">
      <div className="card auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p style={{ color: 'var(--text-muted)' }}>Sign in to continue monitoring your expenses.</p>
        </div>

        {formError && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.5)',
            color: '#f87171',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontSize: '0.9rem'
          }}>
            {formError}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn">
            Login
          </button>
        </form>

        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>
            Don't have an account? <a href="/register">Register</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;