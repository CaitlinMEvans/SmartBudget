import {prisma} from "../db/prisma.js";

export default {
  async getExpensesByUserId(userId) {
    return prisma.expense.findMany({
      where: { userId },
      orderBy: { expenseDate: "desc" },
      include: {
        category: true
      }
    });
  },

  async getExpenseById(id) {
    return prisma.expense.findUnique({
      where: { id: Number(id) }
    });
  },


  async createExpense({ userId, categoryId, amount, date, note }) {
    return prisma.expense.create({
      data: {
        userId,
        categoryId,
        amount,
        expenseDate: new Date(date),
        note
      }
    });
  },

  async updateExpense(id, data) {
    return prisma.expense.update({
      where: { id: Number(id) },
      data
    });
  },

  async deleteExpense(id) {
    return prisma.expense.delete({
      where: { id: Number(id) }
    });
  }
};
