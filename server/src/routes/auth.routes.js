import express from "express";
import { register, login, me, updatePassword } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Account/Profile endpoint
router.get("/me", requireAuth, me);

// Account Update Password 
router.put("/password", requireAuth, updatePassword);

export default router;