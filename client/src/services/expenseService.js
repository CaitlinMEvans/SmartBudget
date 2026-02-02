// src/services/expenseService.js
import axios from 'axios';

//const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';


const expenseService = {
  // Get all expenses
  getAllExpenses: async () => {
    const response = await axios.get(`${API_URL}/expenses`);
    return response.data.data; // array of expenses
  },

  // Get expense by ID
  getExpenseById: async (id) => {
    const response = await axios.get(`${API_URL}/expenses/${id}`);
    return response.data.data;
  },

  // Create expense
  createExpense: async ({ category, amount, date, note }) => {
    const response = await axios.post(`${API_URL}/expenses`, { category, amount, date, note });
    return response.data.data;
  },

  // Update expense
  updateExpense: async (id, { category, amount, date, note }) => {
    const response = await axios.put(`${API_URL}/expenses/${id}`, { category, amount, date, note });
    return response.data.data;
  },

  // Delete expense
  deleteExpense: async (id) => {
    const response = await axios.delete(`${API_URL}/expenses/${id}`);
    return response.data.data;
  },

  // Compute simple stats (frontend since backend doesn't have /stats yet)
  getExpenseStats: async () => {
    const expenses = await expenseService.getAllExpenses();

    // Aggregate by category
    const byCategory = {};
    let totalExpenses = 0;
    expenses.forEach(exp => {
      totalExpenses += exp.amount;
      if (!byCategory[exp.category]) byCategory[exp.category] = { total: 0, count: 0 };
      byCategory[exp.category].total += exp.amount;
      byCategory[exp.category].count += 1;
    });

    const categoryStats = Object.keys(byCategory).map(cat => ({
      _id: cat,
      total: byCategory[cat].total,
      count: byCategory[cat].count,
      percentage: 0 // optional
    }));

    return { totalExpenses, expenseCount: expenses.length, byCategory: categoryStats };
  }
};

export default expenseService;
