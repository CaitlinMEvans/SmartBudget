// server/src/routes/budget.routes.js
import express from "express";
import {
  getBudgets,
  getBudgetById,
  postBudget,
  putBudget,
  deleteBudget,
} from "../controllers/budget.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", requireAuth, getBudgets);
router.get("/:id", requireAuth, getBudgetById);
router.post("/", requireAuth, postBudget);
router.put("/:id", requireAuth, putBudget);
router.delete("/:id", requireAuth, deleteBudget);

export default router;