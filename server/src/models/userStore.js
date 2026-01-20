import crypto from "crypto";

const users = [];

export function findUserByEmail(email) {
  return users.find((u) => u.email === email.toLowerCase());
}

export function createUser({ email, passwordHash }) {
  const user = {
    id: crypto.randomUUID(),
    email: email.toLowerCase(),
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  return user;
}

// Optional: useful for debugging while you build
export function _debugListUsers() {
  return users.map(({ passwordHash, ...safe }) => safe);
}
