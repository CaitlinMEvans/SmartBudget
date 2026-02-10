import Expense from "../models/expense.model.js";
import CategoryModel from "../models/category.model.js";

/**
 * GET /api/expenses
 * Get all expenses for logged-in user
 */
export const getAllExpenses = async (req, res) => {
  try {
    const userId = req.user?.id || 1; // fallback for testing

    const expenses = await Expense.getExpensesByUserId(userId);

    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses
    });
  } catch (error) {
    console.error("Get expenses error:", error);

    res.status(500).json({
      success: false,
      error: "Failed to fetch expenses"
    });
  }
};

/**
 * GET /api/expenses/:id
 */
export const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.getExpenseById(req.params.id);

    if (!expense || expense.user_id !== req.user.id) {
      return res.status(404).json({
        success: false,
        error: "Expense not found"
      });
    }

    res.status(200).json({
      success: true,
      data: expense
    });
  } catch (error) {
    console.error("Get expense error:", error);

    res.status(500).json({
      success: false,
      error: "Failed to fetch expense"
    });
  }
};

/**
 * POST /api/expenses
 */
export const createExpense = async (req, res) => {
  const { category, amount, date, note } = req.body;

  if (!category) {
    return res.status(400).json({
      success: false,
      error: "Category is required"
    });
  }

  if (!amount || amount <= 0) {
    return res.status(400).json({
      success: false,
      error: "Amount must be greater than zero"
    });
  }

  try {
    const expense = await Expense.createExpense({
      userId: req.user.id,
      category,
      amount,
      date: date || new Date(),
      note
    });

    res.status(201).json({
      success: true,
      data: expense
    });
  } catch (error) {
    console.error("Create expense error:", error);

    res.status(500).json({
      success: false,
      error: "Failed to create expense"
    });
  }
};

/**
 * PUT /api/expenses/:id
 */
export const updateExpense = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Invalid expense ID"
      });
    }

    const expense = await Expense.getExpenseById(id);

    if (!expense || expense.user_id !== req.user.id) {
      return res.status(404).json({
        success: false,
        error: "Expense not found"
      });
    }

    const updated = await Expense.updateExpense(id, req.body);

    res.status(200).json({
      success: true,
      data: updated
    });
  } catch (error) {
    console.error("Update expense error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update expense"
    });
  }
};

/**
 * DELETE /api/expenses/:id
 */
export const deleteExpense = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "Invalid expense ID"
      });
    }

    const expense = await Expense.getExpenseById(id);

    if (!expense || expense.user_id !== req.user.id) {
      return res.status(404).json({
        success: false,
        error: "Expense not found"
      });
    }

    await Expense.deleteExpense(id);

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully"
    });
  } catch (error) {
    console.error("Delete expense error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete expense"
    });
  }
};

