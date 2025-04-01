import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-logo">dns.enorde</div>

                <nav className="footer-links">
                    <Link to="/">Home</Link>
                    <Link to="/dns">DNS</Link>
                    <Link to="/profile">Profile</Link>
                    <Link to="/about">About</Link>
                    <Link to="/contact">Contact</Link>
                </nav>

                <div className="footer-socials">
                    <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter">
                        <i className="fab fa-twitter"></i>
                    </a>
                    <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub">
                        <i className="fab fa-github"></i>
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                        <i className="fab fa-linkedin-in"></i>
                    </a>
                </div>
            </div>

            <div className="footer-bottom">
                © {new Date().getFullYear()} dns.enorde. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
