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

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    // quick client-side validation
    if (!email.includes("@")) return setError("Enter a valid email.");
    if (password.length < 8) return setError("Password must be at least 8 characters.");

    try {
      const data = await registerUser({ email, password }); // expects { token, user? }
      login({ token: data.token, user: data.user || { email } });
      nav("/");
    } catch (err) {
      setError(err.message || "Registration failed.");
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: "2rem auto" }}>
      <h1>Register</h1>

      {error && (
        <div style={{ border: "1px solid #b33", padding: "12px", marginBottom: "12px" }}>
          {error}
        </div>
      )}

      <form onSubmit={onSubmit}>
        <label>
          Email
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>

        <label style={{ display: "block", marginTop: 12 }}>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button style={{ marginTop: 16 }} type="submit">
          Create account
        </button>
      </form>
    </div>
  );
}
