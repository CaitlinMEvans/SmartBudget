// src/services/dashboardService.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? "https://smartbudget-kq3w.onrender.com"  // Production backend
    : "http://localhost:8080");              // Local dev


const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

const dashboardService = {

  // GET FULL DASHBOARD DATA
  getDashboard: async () => {
    const response = await axios.get(
      `${API_URL}/dashboard`,
      getAuthHeaders()
    );

    return response.data;
  },

  // OPTIONAL: If you ever want summary only
  getSummary: async () => {
    const response = await axios.get(
      `${API_URL}/dashboard`,
      getAuthHeaders()
    );

    return response.data.summary;
  },

  // OPTIONAL: Just expenses
  getExpenses: async () => {
    const response = await axios.get(
      `${API_URL}/dashboard`,
      getAuthHeaders()
    );

    return response.data.expenses;
  }

};

export default dashboardService;
