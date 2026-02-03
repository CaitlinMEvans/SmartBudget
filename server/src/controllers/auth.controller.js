// server/src/controllers/auth.controller.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../db/prisma.js";

function signToken(userId) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Missing JWT_SECRET in .env");

  return jwt.sign({ sub: userId }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  });
}

export async function register(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ message: "Email already in use." });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { email, passwordHash },
      select: { id: true, email: true, createdAt: true },
    });

    const token = signToken(user.id);

    return res.status(201).json({ token, user });
  } catch (err) {
    console.error("REGISTER_ERROR", err);
    return res.status(500).json({ message: "Registration failed." });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid email or password." });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid email or password." });

    const token = signToken(user.id);

    return res.json({
      token,
      user: { id: user.id, email: user.email, createdAt: user.createdAt },
    });
  } catch (err) {
    console.error("LOGIN_ERROR", err);
    return res.status(500).json({ message: "Login failed." });
  }
}
