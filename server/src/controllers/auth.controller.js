// server/src/controllers/auth.controller.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findByEmail } from "../models/user.model.js";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

function getJwtConfig() {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

  if (!secret || secret.length < 16) {
    // Don’t silently run with a weak secret
    throw new Error("JWT_SECRET is missing or too short (need 16+ chars).");
  }

  return { secret, expiresIn };
}

export async function register(req, res) {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email format." });
    }
    if (String(password).length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    let user;
    try {
      user = createUser({ email, passwordHash });
    } catch (err) {
      if (err.code === "DUP_EMAIL") {
        return res.status(409).json({ error: "Email already exists." });
      }
      throw err;
    }

    const { secret, expiresIn } = getJwtConfig();
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn });

    return res.status(201).json({ token });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: "Server error." });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = findByEmail(email);
    if (!user) {
      // Don’t reveal whether email exists
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const { secret, expiresIn } = getJwtConfig();
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn });

    return res.status(200).json({ token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error." });
  }
}
