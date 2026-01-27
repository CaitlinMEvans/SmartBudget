import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { loginUser } from "../api/authApi";

export default function Login() {
  const nav = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectTo = location.state?.from || "/";

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    const emailTrim = email.trim();

    if (!emailTrim) return setError("Email is required.");
    if (!emailTrim.includes("@")) return setError("Enter a valid email.");
    if (!password) return setError("Password is required.");

    try {
      setLoading(true);
      const data = await loginUser({ email: emailTrim, password }); // expects { token, user? }
      login({ token: data.token, user: data.user || { email: emailTrim } });
      nav(redirectTo, { replace: true });
    } catch (err) {
      // If backend sends Zod-style details: [{ field, message }, ...]
      if (Array.isArray(err.details) && err.details.length) {
        setError(err.details.map((d) => `${d.field}: ${d.message}`).join(" | "));
      } else {
        setError(err.message || "Login failed.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: "2rem auto" }}>
      <h1>Login</h1>

      {error && (
        <div
          role="alert"
          style={{ border: "1px solid #b33", padding: "12px", marginBottom: "12px" }}
        >
          {error}
        </div>
      )}

      <form onSubmit={onSubmit}>
        <label>
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </label>

        <label style={{ display: "block", marginTop: 12 }}>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>

        <button style={{ marginTop: 16 }} type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}