import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar({ scrolled }) {
  const navigate = useNavigate();

  const {user, logout } = useAuth();


const handleLogout = async () => {
  try {
    const res = await logout();

    navigate("/");
  } catch (err) {
    console.error(err);
  }
};


  return (
    <>
      <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
        {/* Logo */}
        <div className="nav-brand" onClick={() => navigate("/")}>
          <div className="nav-logo-icon">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#F7F3EC"
              strokeWidth="2.5"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <span className="nav-logo-name">Nivaas</span>
        </div>

        {/* Links */}
        <div className="nav-links">
          {["Browse", "Cities", "How it works"].map((l) => (
            <button key={l} className="nav-link">
              {l}
            </button>
          ))}
        </div>

        {/* Right Section */}
        <div className="nav-right">
          {user ? (
            <>
              {/* Dashboard */}
              <button
                className="btn-ghost"
                onClick={() => navigate("/smart-dashboard")}
              >
                Dashboard
              </button>

              {/* List Property */}
              <button
                className="btn-cta"
                onClick={() => navigate("/register-property")}
              >
                List property
              </button>

              <button className="btn-cta" onClick={() => navigate("/user-profile")}>
                Profile
              </button>

              {/* Logout */}
              <button className="btn-ghost" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="btn-ghost" onClick={() => navigate("/auth")}>
                Sign in
              </button>

              <button className="btn-cta" onClick={() => navigate("/auth")}>
                Register
              </button>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
