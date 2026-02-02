import express from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  deleteCategory
} from "../controllers/categoryController.js";

import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

// All category routes require authentication
router.use(requireAuth);

/**
 * @route   GET /api/categories
 * @desc    Get all categories
 * @access  Private
 */
router.get("/", getAllCategories);

/**
 * @route   GET /api/categories/:id
 * @desc    Get single category by ID
 * @access  Private
 */
router.get("/:id", getCategoryById);

/**
 * @route   POST /api/categories
 * @desc    Create new category
 * @access  Private
 */
router.post("/", createCategory);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete category
 * @access  Private
 */
router.delete("/:id", deleteCategory);

export default router;
