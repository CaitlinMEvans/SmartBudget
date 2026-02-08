import express from "express";
import { getBudgets, getBudgetById, postBudget, putBudget } from "../controllers/budget.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/:id", requireAuth, getBudgetById);
router.get("/", requireAuth, getBudgets);
router.post("/", requireAuth, postBudget);
router.put("/", requireAuth, putBudget);

export default router;
