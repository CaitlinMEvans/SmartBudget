import express from "express";
import { getBudget, postBudget, putBudget } from "../controllers/budget.controller.js";

const router = express.Router();

router.get("/", getBudget);
router.post("/", postBudget);
router.put("/", putBudget);

export default router;
