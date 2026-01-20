import bcrypt from "bcrypt";
import { createUser, findUserByEmail } from "../models/userStore.js";
import { signToken } from "../utils/jwt.js";

function isValidEmail(email) {
  // simple and good enough for this scope
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function register(req, res) {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters." });
    }

    // Enforce unique email
    const existing = findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ message: "Email already in use." });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = createUser({
      email: email.toLowerCase(),
      passwordHash,
    });

    // Return JWT
    const token = signToken({ userId: user.id, email: user.email });

    return res.status(201).json({ token });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error." });
  }
}
