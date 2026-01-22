// client/src/api/authApi.js
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

async function req(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // match your backend error shape
    throw new Error(data?.error || `Request failed (${res.status})`);
  }

  return data;
}

export function registerUser({ email, password }) {
  return req("/auth/register", { email, password });
}

export function loginUser({ email, password }) {
  return req("/auth/login", { email, password });
}
