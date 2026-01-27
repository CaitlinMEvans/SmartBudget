import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { registerUser } from "../api/authApi";

export default function Register() {
  const nav = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    const emailTrim = email.trim();

    // quick client-side validation
    if (!emailTrim) return setError("Email is required.");
    if (!emailTrim.includes("@")) return setError("Enter a valid email.");
    if (!password) return setError("Password is required.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");

    try {
      setLoading(true);
      const data = await registerUser({ email: emailTrim, password }); // expects { token, user? }
      login({ token: data.token, user: data.user || { email: emailTrim } });
      nav("/", { replace: true });
    } catch (err) {
      if (err.status === 409) {
        setError("That email is already registered.");
      } else if (Array.isArray(err.details) && err.details.length) {
        setError(err.details.map((d) => `${d.field}: ${d.message}`).join(" | "));
      } else {
        setError(err.message || "Registration failed.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: "2rem auto" }}>
      <h1>Register</h1>

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
            autoComplete="new-password"
          />
        </label>

        <button style={{ marginTop: 16 }} type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create account"}
        </button>
      </form>
    </div>
  );
}