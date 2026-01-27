import bcrypt from "bcrypt";
import { createUser, findByEmail } from "../models/user.model.js";
import { signToken } from "../utils/jwt.js";
import { sendError } from "../utils/httpErrors.js";
import { registerSchema, loginSchema } from "../validators/auth.validators.js";

export async function register(req, res) {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      const details = parsed.error.issues.map((i) => ({ field: i.path[0], message: i.message }));
      return sendError(res, 400, "Validation error", details);
    }

    const { email, password } = parsed.data;

    const passwordHash = await bcrypt.hash(password, 10);

    let user;
    try {
      user = createUser({ email, passwordHash });
    } catch (err) {
      if (err?.code === "DUP_EMAIL") return sendError(res, 409, "Email already exists.");
      throw err;
    }

    const token = signToken(user.id);
    return res.status(201).json({ token });
  } catch (err) {
    console.error("Register error:", err);
    return sendError(res, 500, "Server error.");
  }
}

export async function login(req, res) {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      const details = parsed.error.issues.map((i) => ({ field: i.path[0], message: i.message }));
      return sendError(res, 400, "Validation error", details);
    }

    const { email, password } = parsed.data;

    const user = findByEmail(email);
    if (!user) return sendError(res, 401, "Invalid credentials.");

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return sendError(res, 401, "Invalid credentials.");

    const token = signToken(user.id);
    return res.status(200).json({ token });
  } catch (err) {
    console.error("Login error:", err);
    return sendError(res, 500, "Server error.");
  }
}