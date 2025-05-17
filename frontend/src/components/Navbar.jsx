import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <>
      <nav className="navbar">
        {/* Logo */}
        <div className="logo-section">
          <img
            src="/Logo.png" // Replace with actual logo path
            alt="MindWise Logo"
            className="logo-img"
          />
          <div className="logo-text">
            <h1>Mind</h1>
            <h1>Wise</h1>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/consultation" className="nav-link">Consultation</Link>
          <Link to="/survey" className="nav-link">Survey Modules</Link>
          <Link to="/chatbot" className="nav-link">Chatbot</Link>
          <Link to="/explore" className="nav-link">Explore</Link>
        </div>

        {/* Sign Up/Login Buttons */}
        <div className="auth-buttons">
          <Link to="/signup" className="signup-btn">Sign Up</Link>
          <Link to="/login" className="login-btn">Login</Link>

          {/* Mobile Menu Icon */}
          <button className="mobile-menu-btn" aria-label="Open Menu">
            <span className="material-icons">menu</span>
          </button>
        </div>
      </nav>

      <style>{`
        /* Navbar container */
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #319795; /* teal-600 */
          color: white;
          padding: 1rem 1.5rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        /* Logo section */
        .logo-section {
          display: flex;
          align-items: center;
          padding-left: 2rem;
          gap: 0.375rem; /* ~6px */
        }

        .logo-img {
          width: 52px;  /* roughly w-13 */
          height: 44px; /* roughly h-11 */
          object-fit: contain;
        }

        .logo-text {
          display: flex;
          flex-direction: column;
          line-height: 1;
        }

        .logo-text h1 {
          font-size: 1.125rem; /* text-lg */
          font-family: monospace;
          margin: 0;
          line-height: 1;
        }

        /* Navigation links */
        .nav-links {
          display: none;
          gap: 4rem; /* space-x-16 */
          font-size: 1.125rem; /* text-lg */
        }

        .nav-link {
          color: white;
          text-decoration: none;
          transition: color 0.3s, text-decoration 0.3s;
        }

        .nav-link:hover {
          text-decoration: underline;
          color: #81e6d9; /* teal-200 */
        }

        /* Show nav links on medium+ screens */
        @media(min-width: 768px) {
          .nav-links {
            display: flex;
          }
          /* Show auth buttons except mobile menu on md+ */
          .signup-btn, .login-btn {
            display: inline-block;
          }
          .mobile-menu-btn {
            display: none;
          }
        }

        /* Auth buttons */
        .auth-buttons {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .signup-btn {
          background-color: white;
          color: #319795; /* teal-600 */
          font-weight: 600;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
          text-decoration: none;
          transition: background-color 0.3s;
          display: none; /* hidden on small */
        }

        .signup-btn:hover {
          background-color: #b2f5ea; /* teal-100 */
        }

        .login-btn {
          background-color: #2c7a7b; /* teal-700 */
          color: white;
          font-weight: 600;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          text-decoration: none;
          transition: background-color 0.3s;
          display: none; /* hidden on small */
        }

        .login-btn:hover {
          background-color: #285e61; /* teal-800 */
        }

        /* Mobile menu button */
        .mobile-menu-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: white;
          font-size: 2rem;
          display: block; /* visible on small */
        }
      `}</style>
    </>
  );
}

export default Navbar;