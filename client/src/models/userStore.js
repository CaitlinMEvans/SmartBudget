// server/src/models/userStore.js
export const users = []; // TEMP: replace with DB later

export function findUserByEmail(email) {
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function createUser({ id, email, passwordHash }) {
  const user = { id, email, passwordHash, createdAt: new Date().toISOString() };
  users.push(user);
  return user;
}
