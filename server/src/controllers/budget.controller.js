// server/src/controllers/budget.controller.js
import { prisma } from "../db/prisma.js";

/**
 * GET /budget
 * Return all budgets for the authenticated user
 */
export async function getBudgets(req, res) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized." });

    const budgets = await prisma.budget.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ budgets });
  } catch (err) {
    console.error("getBudgets error:", err);
    return res.status(500).json({ error: "Server error." });
  }
}

/**
 * GET /budget/:id
 * Return one budget by id for the authenticated user
 */
export async function getBudgetById(req, res) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized." });

    const budgetId = Number(req.params.id);
    if (!Number.isFinite(budgetId)) {
      return res.status(400).json({ error: "Invalid budget id." });
    }

    const budget = await prisma.budget.findFirst({
      where: { id: budgetId, userId },
    });

    if (!budget) {
      return res.status(404).json({ error: "Budget not found." });
    }

    return res.status(200).json({ budget });
  } catch (err) {
    console.error("getBudgetById error:", err);
    return res.status(500).json({ error: "Server error." });
  }
}

/**
 * POST /budget
 * Create a budget for the authenticated user
 * Allows multiple budgets for the same date window (no duplicates restriction)
 */
export async function postBudget(req, res) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized." });

    let { categoryId, limit, period, startDate } = req.body || {};

    if (!categoryId || limit === undefined || !period || !startDate) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    categoryId = Number(categoryId);
    period = String(period).toLowerCase().trim();

    const numericLimit = Number(limit);
    if (!Number.isFinite(numericLimit) || numericLimit <= 0) {
      return res.status(400).json({ error: "Limit must be > 0." });
    }

    const start = new Date(startDate);
    if (Number.isNaN(start.getTime())) {
      return res.status(400).json({ error: "Invalid startDate." });
    }

    const end = new Date(start);
    if (period === "weekly") {
      end.setDate(end.getDate() + 7);
    } else if (period === "monthly") {
      end.setMonth(end.getMonth() + 1);
    } else {
      return res.status(400).json({ error: "Period must be 'weekly' or 'monthly'." });
    }

    const newBudget = await prisma.budget.create({
      data: {
        userId,
        categoryId,
        limit: numericLimit,
        period,
        startDate: start,
        endDate: end
        // spent defaults to 0 via Prisma schema
      },
    });

    return res.status(201).json({
      message: "Budget created",
      budget: newBudget,
    });
  } catch (err) {
    console.error("postBudget error:", err);
    return res.status(500).json({ error: "Server error." });
  }
}

/**
 * PUT /budget/:id
 * Update a budget by id for the authenticated user
 */
export async function putBudget(req, res) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized." });

    const budgetId = Number(req.params.id);
    if (!Number.isFinite(budgetId)) {
      return res.status(400).json({ error: "Invalid budget id." });
    }

    let { categoryId, limit, period, startDate, spent } = req.body || {};

    // Optional fields: allow partial updates, but validate anything provided
    const data = {};

    if (categoryId !== undefined) {
      const c = Number(categoryId);
      if (!c) return res.status(400).json({ error: "Category must be selected." });
      data.categoryId = c;
    }

    if (limit !== undefined) {
      const numericLimit = Number(limit);
      if (!Number.isFinite(numericLimit) || numericLimit <= 0) {
        return res.status(400).json({ error: "Limit must be > 0." });
      }
      data.limit = numericLimit;
    }

    if (spent !== undefined) {
      const numericSpent = Number(spent);
      if (!Number.isFinite(numericSpent) || numericSpent < 0) {
        return res.status(400).json({ error: "Spent must be >= 0." });
      }
      data.spent = numericSpent;
    }

    // If period or startDate changes, recompute endDate too
    let nextPeriod = period !== undefined ? String(period).toLowerCase().trim() : undefined;
    let nextStart = startDate !== undefined ? new Date(startDate) : undefined;

    if (startDate !== undefined && Number.isNaN(nextStart.getTime())) {
      return res.status(400).json({ error: "Invalid startDate." });
    }

    if (nextPeriod !== undefined) {
      if (nextPeriod !== "weekly" && nextPeriod !== "monthly") {
        return res.status(400).json({ error: "Period must be 'weekly' or 'monthly'." });
      }
      data.period = nextPeriod;
    }

    if (nextStart !== undefined) {
      data.startDate = nextStart;
    }

    // Recompute endDate if period or startDate provided
    if (nextPeriod !== undefined || nextStart !== undefined) {
      // Need current values if one is missing
      const existing = await prisma.budget.findFirst({
        where: { id: budgetId, userId },
      });
      if (!existing) return res.status(404).json({ error: "Budget not found." });

      const actualPeriod = nextPeriod ?? existing.period;
      const actualStart = nextStart ?? existing.startDate;

      const end = new Date(actualStart);
      if (actualPeriod === "weekly") end.setDate(end.getDate() + 7);
      else end.setMonth(end.getMonth() + 1);

      data.endDate = end;
    }

    // Enforce user ownership in update
    const updatedBudget = await prisma.budget.updateMany({
      where: { id: budgetId, userId },
      data,
    });

    if (updatedBudget.count === 0) {
      return res.status(404).json({ error: "Budget not found." });
    }

    const refreshed = await prisma.budget.findFirst({
      where: { id: budgetId, userId },
    });

    return res.status(200).json({
      message: "Budget updated",
      budget: refreshed,
    });
  } catch (err) {
    console.error("putBudget error:", err);
    return res.status(500).json({ error: "Server error." });
  }
}