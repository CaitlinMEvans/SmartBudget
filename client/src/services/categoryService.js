// src/services/categoryService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

const categoryService = {
  // Get all categories
  getAllCategories: async () => {
    const response = await axios.get(`${API_URL}/categories`, getAuthHeaders());
    return response.data.data; // backend wraps in { success, data }
  },

  // Get single category by name
  getCategoryByName: async (name) => {
    const response = await axios.get(`${API_URL}/categories/${name}`, getAuthHeaders());
    return response.data.data;
  },

  // Create category
  createCategory: async ({ name }) => {
    const response = await axios.post(`${API_URL}/categories`, { name }, getAuthHeaders());
    return response.data.data;
  },

  // Update category
  updateCategory: async (oldName, { name }) => {
    const response = await axios.put(`${API_URL}/categories/${oldName}`, { name }, getAuthHeaders());
    return response.data.data;
  },

  // Delete category
  deleteCategory: async (name) => {
    const response = await axios.delete(`${API_URL}/categories/${name}`, getAuthHeaders());
    return response.data.data;
  }
};

export default categoryService;