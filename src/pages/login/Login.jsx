import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import "../../css/Login.css";

const Login = () => {
  const { user, loginUser } = useAuth();
  const navigate = useNavigate();
  const loginForm = useRef(null);

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = loginForm.current.email.value.trim();
    const password = loginForm.current.password.value.trim();
    if (!email || !password) return;
    loginUser({ email, password });
  };

  return (
    <div className="container login-page">
      <div className="login-card">
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Please login to your account</p>

        <form onSubmit={handleSubmit} ref={loginForm} className="login-form">

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              required
              type="email"
              name="email"
              id="email"
              placeholder="example@example.com"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              required
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn-login">Login</button>

        </form>

        <p className="register-text">
          Don't have an account? <Link to="/register" className="register-link">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
