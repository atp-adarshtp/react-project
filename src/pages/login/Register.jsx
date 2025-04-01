import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../utils/AuthContext';
import "../../css/Register.css";

const Register = () => {
  const registerForm = useRef(null);
  const { registerUser } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();

    const name = registerForm.current.name.value.trim();
    const email = registerForm.current.email.value.trim();
    const password1 = registerForm.current.password1.value;
    const password2 = registerForm.current.password2.value;

    if (password1 !== password2) {
      alert('Passwords do not match!');
      return;
    }

    const userInfo = { name, email, password1, password2 };
    registerUser(userInfo);
  };

  return (
    <div className="container register-page">
      <div className="register-card">
        <h2 className="register-title">Create Account</h2>
        <p className="register-subtitle">Join us and start managing your zones</p>

        <form ref={registerForm} onSubmit={handleSubmit} className="register-form">

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              required
              type="text"
              name="name"
              id="name"
              placeholder="Your name"
              autoComplete="name"
            />
          </div>

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
            <label htmlFor="password1">Password</label>
            <input
              required
              type="password"
              name="password1"
              id="password1"
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password2">Confirm Password</label>
            <input
              required
              type="password"
              name="password2"
              id="password2"
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="btn-register">Register</button>
        </form>

        <p className="login-text">
          Already have an account? <Link to="/login" className="login-link">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
