import Expense from "../models/expense.model.js";
import { prisma } from "../db/prisma.js";

/**
 * GET /expenses
 */
export const getAllExpenses = async (req, res) => {
  try {
    const userId = req.user.id;
    const { categoryId, startDate, endDate } = req.query;

    const where = { userId };

    if (categoryId) {
      where.categoryId = Number(categoryId);
    }

    if (startDate || endDate) {
      where.expenseDate = {};
      if (startDate) where.expenseDate.gte = new Date(startDate);
      if (endDate) where.expenseDate.lte = new Date(endDate);
    }

    const expenses = await prisma.expense.findMany({
      where,
      orderBy: { expenseDate: "desc" },
      include: { category: true }
    });

    const formatted = expenses.map(exp => ({
      id: exp.id,
      userId: exp.userId,
      categoryId: exp.categoryId,              // ✅ RETURN THIS
      category: exp.category?.name || "Unknown",
      amount: Number(exp.amount),
      date: exp.expenseDate,
      note: exp.note,
      createdAt: exp.createdAt
    }));

    res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted
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
 * POST /expenses
 */
export const createExpense = async (req, res) => {
  try {
    const { categoryId, amount, date, note } = req.body;

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        error: "CategoryId is required"
      });
    }

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        error: "Amount must be greater than zero"
      });
    }

    const expense = await prisma.expense.create({
      data: {
        userId: req.user.id,
        categoryId: Number(categoryId),
        amount: Number(amount),
        expenseDate: date ? new Date(date) : new Date(),
        note: note || null
      },
      include: { category: true }
    });

    res.status(201).json({
      success: true,
      data: {
        id: expense.id,
        userId: expense.userId,
        categoryId: expense.categoryId,        // ✅ RETURN THIS
        category: expense.category.name,
        amount: Number(expense.amount),
        date: expense.expenseDate,
        note: expense.note,
        createdAt: expense.createdAt
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
 * PUT /expenses/:id
 */
export const updateExpense = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { categoryId, amount, date, note } = req.body;

    const expense = await prisma.expense.findUnique({
      where: { id }
    });

    if (!expense || expense.userId !== req.user.id) {
      return res.status(404).json({
        success: false,
        error: "Expense not found"
      });
    }

    const updateData = {};

    if (categoryId) updateData.categoryId = Number(categoryId);
    if (amount !== undefined) updateData.amount = Number(amount);
    if (date) updateData.expenseDate = new Date(date);
    if (note !== undefined) updateData.note = note;

    const updated = await prisma.expense.update({
      where: { id },
      data: updateData,
      include: { category: true }
    });

    res.status(200).json({
      success: true,
      data: {
        id: updated.id,
        userId: updated.userId,
        categoryId: updated.categoryId,       // ✅ RETURN THIS
        category: updated.category.name,
        amount: Number(updated.amount),
        date: updated.expenseDate,
        note: updated.note,
        createdAt: updated.createdAt
      }
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
 * DELETE /expenses/:id
 */
export const deleteExpense = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const expense = await prisma.expense.findUnique({
      where: { id }
    });

    if (!expense || expense.userId !== req.user.id) {
      return res.status(404).json({
        success: false,
        error: "Expense not found"
      });
    }

    await prisma.expense.delete({
      where: { id }
    });

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

export default {
  getAllExpenses,
  createExpense,
  updateExpense,
  deleteExpense
};
