import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useState, useRef, useEffect } from "react";

export default function TopNav() {
  const { isAuthed, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <Link to="/" style={styles.brand}>
          SmartBudget
        </Link>
      </div>

      {/* Center dropdown - only shown when logged in */}
      {isAuthed && (
        <div style={styles.center} ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={styles.dropdownButton}
          >
            Menu ▾
          </button>
          {isDropdownOpen && (
            <div style={styles.dropdownMenu}>
              <Link
                to="/budget"
                style={styles.dropdownItem}
                onClick={() => setIsDropdownOpen(false)}
              >
                Budgets
              </Link>
              {/* Add more secondary pages here as needed */}
            </div>
          )}
        </div>
      )}

      <div style={styles.right}>
        {!isAuthed ? (
          <>
            <Link to="/register" style={styles.link}>
              Register
            </Link>
            <Link to="/login" style={styles.link}>
              Login
            </Link>
          </>
        ) : (
          <>
            <Link to="/profile" style={styles.link}>
              Profile
            </Link>
            <button onClick={handleLogout} style={styles.button}>
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
}

const styles = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.12)",
    position: "relative",
  },
  left: { display: "flex", alignItems: "center", gap: 12 },
  center: {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
  },
  right: { display: "flex", alignItems: "center", gap: 12 },
  brand: { color: "inherit", textDecoration: "none", fontWeight: 700 },
  link: { color: "inherit", textDecoration: "none", opacity: 0.9 },
  button: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.25)",
    color: "inherit",
    padding: "6px 10px",
    borderRadius: 6,
    cursor: "pointer",
  },
  dropdownButton: {
    background: "transparent",
    border: "1px solid rgba(255,255,255,0.25)",
    color: "inherit",
    padding: "6px 10px",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: "inherit",
  },
  dropdownMenu: {
    position: "absolute",
    top: "calc(100% + 8px)",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#2a2a2a",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 6,
    minWidth: 150,
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    zIndex: 1000,
  },
  dropdownItem: {
    display: "block",
    padding: "10px 16px",
    color: "inherit",
    textDecoration: "none",
    opacity: 0.9,
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    transition: "background 0.2s",
  },
};