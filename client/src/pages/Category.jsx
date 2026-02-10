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
      const map = {};

      stats.byCategory.forEach(cat => {
        map[cat._id] = { total: cat.total, count: cat.count };
      });

      setCategorySpending(map);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, formData);
        setSuccess('Category updated');
      } else {
        await categoryService.createCategory(formData);
        setSuccess('Category created');
      }

      await fetchAll();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save category');
    }
  };

  const resetForm = () => {
    setFormData({ name: '' });
    setEditingCategory(null);
    setShowForm(false);
  };

  const handleEdit = (cat) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;

    try {
      await categoryService.deleteCategory(id);
      setSuccess('Category deleted');
      await fetchAll();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete category');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="categories-page">
      <h1>📂 Categories</h1>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'Add Category'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit}>
          <input
            value={formData.name}
            onChange={e => setFormData({ name: e.target.value })}
            placeholder="Category name"
            required
          />
          <button type="submit">
            {editingCategory ? 'Update' : 'Create'}
          </button>
        </form>
      )}

      <ul>
        {categories.map(cat => (
          <li key={cat.id}>
            <strong>{cat.name}</strong>
            <span>
              ₦{(categorySpending[cat.name]?.total || 0).toFixed(2)}
            </span>
            <button onClick={() => handleEdit(cat)}>Edit</button>
            <button onClick={() => handleDelete(cat.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesPage;
