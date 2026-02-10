import React, { useState, useEffect } from 'react';
import categoryService from '../services/categoryService';
import './CategoryManager.css';

/**
 * CategoryManager Component
 * Allows users to view, add, edit, and delete categories (name-based)
 */
const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    icon: '📁',
    color: '#6366f1',
    budget: 0
  });

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  /**
   * Fetch all categories
   */
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAllCategories();
      setCategories(data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle form input changes
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'budget' ? parseFloat(value) || 0 : value
    }));
  };

  /**
   * Handle form submission (create or update)
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingCategory) {
        // Update by category name
        await categoryService.updateCategory(editingCategory.id, formData);
        setSuccess('Category updated successfully!');
      } else {
        // Create new category
        await categoryService.createCategory(formData);
        setSuccess('Category created successfully!');
      }

      await fetchCategories();
      resetForm();

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save category');
    }
  };

  /**
   * Handle edit
   */
  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      icon: category.icon,
      color: category.color,
      budget: category.budget || 0
    });
    setShowForm(true);
  };

  /**
   * Handle delete (by name)
   */
  const handleDelete = async (category) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      await categoryService.deleteCategory(category.id);
      setSuccess('Category deleted successfully!');
      await fetchCategories();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete category');
    }
  };

  /**
   * Reset form
   */
  const resetForm = () => {
    setFormData({
      name: '',
      icon: '📁',
      color: '#6366f1',
      budget: 0
    });
    setEditingCategory(null);
    setShowForm(false);
  };

  /**
   * Initialize default categories
   */
  const handleInitDefaults = async () => {
    try {
      await categoryService.initDefaultCategories();
      setSuccess('Default categories created successfully!');
      await fetchCategories();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create default categories');
    }
  };

  const iconOptions = ['📁', '🍔', '🚗', '🏠', '📚', '💡', '🎬', '⚕️', '💄', '📦', '💰', '🎮', '✈️', '🛒'];

  if (loading) return <div className="loading">Loading categories...</div>;

  return (
    <div className="category-manager">
      <div className="category-header">
        <h2>📂 Manage Categories</h2>
        <div className="header-actions">
          {categories.length === 0 && (
            <button onClick={handleInitDefaults} className="btn btn-secondary">
              Initialize Defaults
            </button>
          )}
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary"
          >
            {showForm ? 'Cancel' : '+ Add Category'}
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Add / Edit Form */}
      {showForm && (
        <div className="category-form-card">
          <h3>{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Category Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                maxLength="50"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="icon">Icon</label>
                <select
                  id="icon"
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                >
                  {iconOptions.map(icon => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="color">Color</label>
                <input
                  type="color"
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="budget">Monthly Budget</label>
              <input
                type="number"
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleInputChange}
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={resetForm} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingCategory ? 'Update Category' : 'Create Category'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories List */}
      <div className="categories-list">
        {categories.length === 0 ? (
          <div className="empty-state">
            <p>No categories yet.</p>
          </div>
        ) : (
          <div className="categories-grid">
            {categories.map(category => (
              <div
                key={category.name}
                className="category-card"
                style={{ borderLeftColor: category.color }}
              >
                <div className="category-info">
                  <span className="category-icon">{category.icon}</span>
                  <div className="category-details">
                    <h4>{category.name}</h4>
                    {category.budget > 0 && (
                      <p>Budget: ${category.budget.toFixed(2)}</p>
                    )}
                    {category.isDefault && (
                      <span className="default-badge">Default</span>
                    )}
                  </div>
                </div>

                <div className="category-actions">
                  <button
                    onClick={() => handleEdit(category)}
                    className="btn-icon btn-edit"
                  >
                    ✏️
                  </button>
                  {!category.isDefault && (
                    <button
                      onClick={() => handleDelete(category.name)}
                      className="btn-icon btn-delete"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryManager;
