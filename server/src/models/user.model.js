// server/src/models/user.model.js
import crypto from "crypto";

// Simple in-memory "DB" for Sprint 1.
// Later replace with Postgres (Prisma/Knex) without changing controller signatures.

const usersByEmail = new Map(); // key: emailLower, value: user

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function findByEmail(email) {
  const key = normalizeEmail(email);
  return usersByEmail.get(key) || null;
}

export function createUser({ email, passwordHash }) {
  const key = normalizeEmail(email);
  if (usersByEmail.has(key)) {
    const err = new Error("Email already exists");
    err.code = "DUP_EMAIL";
    throw err;
  }

  const user = {
    id: crypto.randomUUID(),
    email: key,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  usersByEmail.set(key, user);
  return user;
}

// Optional helper for debugging (don’t use in production)
export function _debugCount() {
  return usersByEmail.size;
}
