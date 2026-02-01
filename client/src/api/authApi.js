const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

export async function request(path, body, method) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : null,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = new Error(data?.error || `Request failed (${res.status})`);
    err.status = res.status;
    err.details = data?.details;
    throw err;
  }

  return data;
}

export const registerUser = (payload) => request("/auth/register", payload, "POST");
export const loginUser = (payload) => request("/auth/login", payload, "POST");