import React, { useState, useEffect } from 'react';
import categoryService from '../services/categoryService';
import expenseService from '../services/expenseService';
import './Category.css';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [categorySpending, setCategorySpending] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '' });

  // Fetch categories and spending
  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    await Promise.all([fetchCategories(), fetchCategorySpending()]);
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAllCategories();
      setCategories(data);
      setError('');
    } catch {
      setError('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategorySpending = async () => {
    try {
      const stats = await expenseService.getExpenseStats();
      const spendingMap = {};

      stats.byCategory.forEach(cat => {
        // cat._id === category NAME
        spendingMap[cat._id] = {
          total: cat.total,
          count: cat.count
        };
      });

      setCategorySpending(spendingMap);
    } catch (err) {
      console.error('Failed to fetch category spending:', err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ name: e.target.value });
  };

  const resetForm = () => {
    setFormData({ name: '' });
    setEditingCategory(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.name, formData);
        setSuccess('Category updated successfully');
      } else {
        await categoryService.createCategory(formData);
        setSuccess('Category created successfully');
      }

      await fetchAll();
      resetForm();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save category');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name });
    setShowForm(true);
  };

  const handleDelete = async (name) => {
    if (!window.confirm('Delete this category?')) return;

    try {
      await categoryService.deleteCategory(name);
      setSuccess('Category deleted');
      await fetchAll();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete category');
    }
  };

  if (loading) return <p>Loading categories...</p>;

  return (
    <div className="categories-page">
      <h1>📂 Expense Categories</h1>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : editingCategory ? 'Edit Category' : 'Add Category'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="category-form">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Category name"
            required
          />
          <button type="submit">
            {editingCategory ? 'Update' : 'Create'}
          </button>
        </form>
      )}

      {categories.length === 0 ? (
        <p>No categories yet.</p>
      ) : (
        <ul className="categories-list">
          {categories.map((cat) => (
            <li key={cat.name}>
              <span>
                {cat.icon} {cat.name}
              </span>
              <span>
                Spent: $
                {(categorySpending[cat.name]?.total || 0).toFixed(2)} (
                {categorySpending[cat.name]?.count || 0} expenses)
              </span>
              <button onClick={() => handleEdit(cat)}>Edit</button>
              <button onClick={() => handleDelete(cat.name)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoriesPage;
