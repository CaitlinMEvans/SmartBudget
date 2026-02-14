import { prisma } from "../db/prisma.js";

export async function getActiveBudgets(userId) {
  try {

    // Search for a budget
    const weeklyBudget = await prisma.budget.findMany({ where: { 
      userId, 
      period: 'weekly', 
      startDate: { lte: new Date().toISOString() },
      endDate: { gte: new Date().toISOString() },
    }})

    const monthlyBudget = await prisma.budget.findMany({ where: {
      userId, 
      period: 'monthly',
      startDate: { lte: new Date().toISOString() },
      endDate: { gte: new Date().toISOString() },
    }})

    const returnedBudgets = [];

    if (weeklyBudget)
      weeklyBudget.forEach(budget => returnedBudgets.push(budget));

    if (monthlyBudget)
      monthlyBudget.forEach(budget => returnedBudgets.push(budget));

    return returnedBudgets;
  } 
  catch (err) {
    console.error("getActiveBudgets error:", err);
    return;
  }
}
