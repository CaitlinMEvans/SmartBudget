// server/src/middleware/auth.middleware.js
import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ message: "Missing or invalid Authorization header." });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: "Server misconfigured: JWT_SECRET missing." });
    }

    const payload = jwt.verify(token, secret);

    // Change this to use 'id' instead of 'userId'
    req.user = {
      id: Number(payload.sub),
      userId: Number(payload.sub) // Keep both for backwards compatibility
    };

    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}