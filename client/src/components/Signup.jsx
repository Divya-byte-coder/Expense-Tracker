import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [formError, setFormError] = useState('');

  const { register, error, clearErrors, isAuthenticated } = useContext(AuthContext);
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

  const { name, email, password } = user;

  const onChange = e => {
    setFormError('');
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onSubmit = e => {
    e.preventDefault();
    if (name === '' || email === '' || password === '') {
      setFormError('Please fill in all fields');
    } else if (password.length < 6) {
      setFormError('Password must be at least 6 characters');
    } else {
      register({ name, email, password });
    }
  };

  return (
    <div className="auth-container">
      <div className="card auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p style={{ color: 'var(--text-muted)' }}>Start tracking your expenses today.</p>
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
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              className="form-control"
              required
            />
          </div>
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
              minLength="6"
            />
          </div>
          <button type="submit" className="btn">
            Register
          </button>
        </form>

        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)' }}>
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;