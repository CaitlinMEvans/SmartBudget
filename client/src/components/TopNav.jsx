import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function TopNav() {
  const { isAuthed, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <Link to="/" style={styles.brand}>
          SmartBudget
        </Link>
      </div>

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
          <button onClick={handleLogout} style={styles.button}>
            Logout
          </button>
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
  },
  left: { display: "flex", alignItems: "center", gap: 12 },
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
};
