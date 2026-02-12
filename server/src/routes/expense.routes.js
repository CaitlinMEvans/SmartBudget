import express from "express";
import {
  getAllExpenses,
  //getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense
} from "../controllers/expense.controller.js";

import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

// All expense routes require authentication
router.use(requireAuth);

/**
 * @route   GET /api/expenses
 * @desc    Get all expenses for logged-in user
 * @access  Private
 */
router.get("/", getAllExpenses);

/**
 * @route   GET /api/expenses/:id
 * @desc    Get single expense by ID
 * @access  Private
 */
//router.get("/:id", getExpenseById);

/**
 * @route   POST /api/expenses
 * @desc    Create new expense
 * @access  Private
 */
router.post("/", createExpense);

/**
 * @route   PUT /api/expenses/:id
 * @desc    Update expense
 * @access  Private
 */
router.put("/:id", updateExpense);

/**
 * @route   DELETE /api/expenses/:id
 * @desc    Delete expense
 * @access  Private
 */
router.delete("/:id", deleteExpense);

export default router;
