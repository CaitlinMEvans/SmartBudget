import Expense from "../models/expense.model.js";
import { prisma } from "../db/prisma.js";

/**
 * GET /api/expenses
 * Get all expenses for logged-in user
 */
export const getAllExpenses = async (req, res) => {
  try {
    const userId = req.user?.id;

    const expenses = await Expense.getExpensesByUserId(userId);

    // Format expenses to include category name for frontend
    const formattedExpenses = expenses.map(exp => ({
      id: exp.id,
      userId: exp.userId,
      category: exp.category?.name || 'Unknown',
      amount: parseFloat(exp.amount),
      date: exp.expenseDate,
      note: exp.note,
      createdAt: exp.createdAt
    }));

    res.status(200).json({
      success: true,
      count: formattedExpenses.length,
      data: formattedExpenses
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
    const expenseId = parseInt(req.params.id);
    const expense = await Expense.getExpenseById(expenseId);

    if (!expense || expense.userId !== req.user.id) {
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
    // Look up category by name to get categoryId
    const categoryRecord = await prisma.category.findUnique({
      where: { name: category }
    });

    if (!categoryRecord) {
      return res.status(400).json({
        success: false,
        error: `Category '${category}' not found`
      });
    }

    const expense = await Expense.createExpense({
      userId: req.user.id,
      categoryId: categoryRecord.id,
      amount: parseFloat(amount),
      date: date || new Date(),
      note: note || null
    });

    // Fetch the created expense with category info
    const fullExpense = await prisma.expense.findUnique({
      where: { id: expense.id },
      include: { category: true }
    });

    res.status(201).json({
      success: true,
      data: {
        id: fullExpense.id,
        userId: fullExpense.userId,
        category: fullExpense.category.name,
        amount: parseFloat(fullExpense.amount),
        date: fullExpense.expenseDate,
        note: fullExpense.note,
        createdAt: fullExpense.createdAt
      }
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
    const expenseId = parseInt(req.params.id);
    const expense = await Expense.getExpenseById(expenseId);

    if (!expense || expense.userId !== req.user.id) {
      return res.status(404).json({
        success: false,
        error: "Expense not found"
      });
    }

    const { category, amount, date, note } = req.body;
    const updateData = {};

    // If category name is provided, convert to categoryId
    if (category) {
      const categoryRecord = await prisma.category.findUnique({
        where: { name: category }
      });

      if (!categoryRecord) {
        return res.status(400).json({
          success: false,
          error: `Category '${category}' not found`
        });
      }

      updateData.categoryId = categoryRecord.id;
    }

    if (amount !== undefined) updateData.amount = parseFloat(amount);
    if (date !== undefined) updateData.expenseDate = new Date(date);
    if (note !== undefined) updateData.note = note;

    const updated = await Expense.updateExpense(expenseId, updateData);

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
    const expenseId = parseInt(req.params.id);
    const expense = await Expense.getExpenseById(expenseId);

    if (!expense || expense.userId !== req.user.id) {
      return res.status(404).json({
        success: false,
        error: "Expense not found"
      });
    }

    await Expense.deleteExpense(expenseId);

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