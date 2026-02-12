import { prisma } from "../db/prisma.js";

export async function getMonthlyExpenses(userId) {
  try {
    // Start of current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // End of current month
    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0); // last day of current month
    endOfMonth.setHours(23, 59, 59, 999);

    const expenses = await prisma.expense.findMany({
      where: {
        userId,
        expenseDate: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      include: {
        category: true,
      },
      orderBy: {
        expenseDate: "desc",
      },
    });

    return expenses;
  } catch (error) {
    console.error("getMonthlyExpenses error:", error);
    throw error;
  }
}
