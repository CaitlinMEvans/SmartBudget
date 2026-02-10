// client/src/api/authApi.js
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

async function request(path, body = null, method = "POST") {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const options = {
    method,
    headers,
  };

  // Only attach body for methods that support it
  if (body !== null && method !== "GET") {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE}${path}`, options);

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(
      data?.message || data?.error || `Request failed (${res.status})`
    );
    err.status = res.status;
    err.details = data?.details || data?.errors;
    throw err;
  }

  return data;
}

// Auth endpoints
export const registerUser = (payload) => request("/auth/register", payload, "POST");
export const loginUser = (payload) => request("/auth/login", payload, "POST");

//  Account/Profile endpoint
export const getMe = () => request("/auth/me", null, "GET");

// Optional exports if other areas want a generic request helper
export { request };

// Update Password 
export const updatePassword = (payload) => request("/auth/password", payload, "PUT");
