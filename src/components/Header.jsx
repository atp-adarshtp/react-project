import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import "./Header.css";

const Header = () => {
    const { user, logoutUser } = useAuth();

    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="header-logo">dns.enorde</Link>

                <nav className="header-nav">
                    <Link to="/">Home</Link>
                    <Link to="/dns">DNS</Link>
                    <Link to="/server">Server</Link>
                    {user && <Link to="/profile">Profile</Link>}
                    <Link to="/about">About</Link>
                    <Link to="/contact">Contact</Link>
                </nav>

                <div className="header-auth">
                    {user ? (
                        <button onClick={logoutUser} className="logout-btn">Logout</button>
                    ) : (
                        <Link to="/login" className="login-btn">Login</Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
