import { getActiveBudgets } from "../utils/budgets.js";
import { getMonthlyExpenses } from "../utils/expense.js";

export async function getDashboard(req, res) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    /* ===============================
       FETCH DATA
    =============================== */

    const [budgets, expenses] = await Promise.all([
      getActiveBudgets(userId),
      getMonthlyExpenses(userId)
    ]);

    /* ===============================
       CALCULATIONS
    =============================== */

    const totalBudget =
      budgets?.reduce((sum, b) => sum + Number(b.amount), 0) || 0;

    const totalSpent =
      expenses?.reduce((sum, exp) => sum + Number(exp.amount), 0) || 0;

    const remaining = totalBudget - totalSpent;

    /* ---------- Category Totals ---------- */

    const categoryTotals = {};

    expenses.forEach(exp => {
      const name = exp.category?.name || "Uncategorized";

      if (!categoryTotals[name]) {
        categoryTotals[name] = 0;
      }

      categoryTotals[name] += Number(exp.amount);
    });

    /* ---------- Weekly Totals ---------- */

    const weeklyTotals = [0, 0, 0, 0];

    expenses.forEach(exp => {
      const day = new Date(exp.expenseDate).getDate();
      const weekIndex = Math.floor((day - 1) / 7);

      if (weekIndex >= 0 && weekIndex < 4) {
        weeklyTotals[weekIndex] += Number(exp.amount);
      }
    });

    /* ===============================
       RESPONSE
    =============================== */

    return res.json({
      summary: {
        totalBudget,
        totalSpent,
        remaining,
        expenseCount: expenses.length
      },
      budgets,
      expenses,
      recentExpenses: expenses.slice(0, 5),
      categoryTotals,
      weeklyTotals
    });

  } catch (err) {
    console.error("getDashboard error:", err);
    res.status(500).json({ message: "Failed to load dashboard" });
  }
}
