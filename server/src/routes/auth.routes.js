import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// TEST protected route
router.get("/me", requireAuth, (req, res) => {
  res.json({
    message: "Authenticated",
    userId: req.user.userId,
  });
});

export default router;
