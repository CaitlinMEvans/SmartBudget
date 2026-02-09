import { prisma } from "../db/prisma.js";

export async function getActiveBudgets(userId) {
  try {

    // Search for a budget
    const weeklyBudget = await prisma.budget.findFirst({ where: { 
      userId, 
      period: 'weekly', 
      startDate: { lte: new Date().toISOString() },
      endDate: { gte: new Date().toISOString() },
    }})

    const monthlyBudget = await prisma.budget.findFirst({ where: {
      userId, 
      period: 'monthly',
      startDate: { lte: new Date().toISOString() },
      endDate: { gte: new Date().toISOString() },
    }})

    const returnedBudgets = [];

    if (weeklyBudget)
      returnedBudgets.push(weeklyBudget);

    if (monthlyBudget)
      returnedBudgets.push(monthlyBudget);

    return returnedBudgets;
  } 
  catch (err) {
    console.error("getActiveBudgets error:", err);
    return;
  }
}
