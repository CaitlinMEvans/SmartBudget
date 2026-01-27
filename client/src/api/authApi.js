const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

async function request(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
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

export const registerUser = (payload) => request("/auth/register", payload);
export const loginUser = (payload) => request("/auth/login", payload);