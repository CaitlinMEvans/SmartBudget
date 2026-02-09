// server/src/models/budget.model.js
import crypto from "crypto";

const budgets = new Map(); // key: emailLower, value: user

// This is the shape a budget will have:
// const budget = {
//   id: crypto.randomUUID(),
//   userId,
//   amount,
//   periodType,
//   startDate,
//   createdAt: new Date().toISOString()
// }

export function createBudget(userId, amount, periodType, startDate) {
  // Instead of creating the budget here, we'll create it in the db once it is set up
  const budget = {
    id: crypto.randomUUID(),
    userId,
    amount,
    periodType,
    startDate,
    createdAt: new Date().toISOString()
  }

  validatePeriodType(periodType);
  enforceSingleBudgetPerPeriod(userId, periodType);

  budgets.set(budget.id, budget);

  return budget;
}

export function updateBudget(id, userId, amount, periodType, startDate) {
  try {
    const budget = budgets.get(id);

    if (!budget) 
      throw new Error("There is no budget matching that id");

    // Only the budget owner can update the budget
    if (budget.userId !== userId)
      throw new Error("Unauthorized");

    validatePeriodType(periodType);
    enforceSingleBudgetPerPeriod(userId, periodType, id);

    budget.amount = amount;
    budget.periodType = periodType;
    budget.startDate = startDate;

    budgets.set(id, budget);
    
  } catch (error) {
    throw new Error(error.message);
  }
}

function validatePeriodType(periodType) {
  if (!["weekly", "monthly"].includes(periodType)) {
    throw new Error("Invalid period type");
  }
}

function enforceSingleBudgetPerPeriod(userId, periodType, excludeBudgetId = null) {
  for (const budget of budgets.values()) {
    if (
      budget.userId === userId &&
      budget.periodType === periodType &&
      budget.id !== excludeBudgetId
    ) {
      throw new Error("Only one budget per period type is allowed");
    }
  }
}