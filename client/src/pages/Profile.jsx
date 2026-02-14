import { useEffect, useState } from "react";
import { getMe, updatePassword } from "../api/authApi";
import { useAuth } from "../auth/AuthContext";

export default function Profile() {
  const { logout } = useAuth();

  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await getMe(); // { email, createdAt }
        if (isMounted) setMe(data);
      } catch (err) {
        // If token is invalid/expired, force logout and send them to login via route guard/nav
        if (err?.status === 401) logout();
        if (isMounted) setError(err?.message || "Failed to load profile.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [logout]);

  async function onChangePassword(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!currentPassword) return setError("Current password is required.");
    if (newPassword.length < 8) return setError("New password must be at least 8 characters.");
    if (newPassword !== confirmNewPassword) return setError("New passwords do not match.");
    if (currentPassword === newPassword) return setError("New password must be different.");

    try {
      await updatePassword({ currentPassword, newPassword });
      setSuccess("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      setError(err?.message || "Password update failed.");
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: "2rem auto", padding: "0 1rem" }}>
      <h1>Profile</h1>

      {loading && <p>Loading…</p>}

      {!loading && me && (
        <div style={{ border: "1px solid rgba(255,255,255,0.12)", padding: 16, borderRadius: 8 }}>
          <div style={{ marginBottom: 8 }}>
            <strong>Email:</strong> {me.email}
          </div>
          <div>
            <strong>Created:</strong>{" "}
            {me.createdAt ? new Date(me.createdAt).toLocaleString() : "—"}
          </div>
        </div>
      )}

      {(error || success) && (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            border: `1px solid ${error ? "#b33" : "#2a7"}`,
            borderRadius: 8,
          }}
        >
          {error || success}
        </div>
      )}

      <h2 style={{ marginTop: 24 }}>Change Password</h2>

      <form onSubmit={onChangePassword} style={{ marginTop: 12, width: "100%" }}>
        <label style={{ display: "block", marginBottom: 12 }}>
          Current password
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            style={inputStyle}
            autoComplete="current-password"
          />
        </label>

        <label style={{ display: "block", marginBottom: 12 }}>
          New password
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={inputStyle}
            autoComplete="new-password"
          />
        </label>

        <label style={{ display: "block", marginBottom: 12 }}>
          Confirm new password
          <input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            style={inputStyle}
            autoComplete="new-password"
          />
        </label>

        <button type="submit" style={buttonStyle}>
          Update password
        </button>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  display: "block",
  marginTop: 6,
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.2)",
  background: "transparent",
  color: "inherit",
};

const buttonStyle = {
  marginTop: 8,
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.25)",
  background: "transparent",
  color: "inherit",
  cursor: "pointer",
};
