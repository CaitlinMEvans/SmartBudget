// src/services/expenseService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

const expenseService = {

  // GET ALL
  getAllExpenses: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await axios.get(
      `${API_URL}/expenses?${params.toString()}`,
      getAuthHeaders()
    );
    return response.data.data;
  },

  // GET BY ID
  getExpenseById: async (id) => {
    const response = await axios.get(
      `${API_URL}/expenses/${id}`,
      getAuthHeaders()
    );
    return response.data.data;
  },

  // CREATE (NOW USES categoryId)
  createExpense: async ({ categoryId, amount, date, note }) => {
    const response = await axios.post(
      `${API_URL}/expenses`,
      { categoryId, amount, date, note },
      getAuthHeaders()
    );
    return response.data.data;
  },

  // UPDATE (NOW USES categoryId)
  updateExpense: async (id, { categoryId, amount, date, note }) => {
    const response = await axios.put(
      `${API_URL}/expenses/${id}`,
      { categoryId, amount, date, note },
      getAuthHeaders()
    );
    return response.data.data;
  },

  // DELETE
  deleteExpense: async (id) => {
    await axios.delete(
      `${API_URL}/expenses/${id}`,
      getAuthHeaders()
    );
  },

  // SIMPLE FRONTEND STATS
  getExpenseStats: async () => {
    const expenses = await expenseService.getAllExpenses();

    const byCategory = {};
    let totalExpenses = 0;

    expenses.forEach(exp => {
      totalExpenses += exp.amount;

      if (!byCategory[exp.categoryId]) {
        byCategory[exp.categoryId] = {
          name: exp.category,
          total: 0,
          count: 0
        };
      }

      byCategory[exp.categoryId].total += exp.amount;
      byCategory[exp.categoryId].count += 1;
    });

    return {
      totalExpenses,
      expenseCount: expenses.length,
      byCategory
    };
  }
};

export default expenseService;
