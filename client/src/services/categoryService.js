// src/services/categoryService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const categoryService = {
  // Get all categories
  getAllCategories: async () => {
    const response = await axios.get(`${API_URL}/categories`);
    return response.data.data;
  },

  // Create category
  createCategory: async ({ name }) => {
    const response = await axios.post(`${API_URL}/categories`, { name });
    return response.data.data;
  },

  // Update category BY ID ✅
  updateCategory: async (id, { name }) => {
    const response = await axios.put(`${API_URL}/categories/${id}`, { name });
    return response.data;
  },

  // Delete category BY ID ✅
  deleteCategory: async (id) => {
    const response = await axios.delete(`${API_URL}/categories/${id}`);
    return response.data;
  }
};

export default categoryService;
