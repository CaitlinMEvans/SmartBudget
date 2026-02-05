import React, { useState, useEffect } from 'react';
import expenseService from '../services/expenseService';
import categoryService from '../services/categoryService';
import './EditExpense.css';

/**
 * EditExpense Component
 * Uses category NAME instead of categoryId
 */
const EditExpense = ({ expenseId, onSuccess, onCancel }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: '',
    note: ''
  });

  useEffect(() => {
    fetchData();
  }, [expenseId]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Get categories (array)
      const categoryData = await categoryService.getAllCategories();
      setCategories(categoryData);

      // Get expense
      const expense = await expenseService.getExpenseById(expenseId);

      setFormData({
        amount: expense.amount.toString(),
        category: expense.category,
        date: expense.date.split('T')[0],
        note: expense.note || ''
      });

      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load expense');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      setError('Amount must be greater than 0');
      setSaving(false);
      return;
    }

    try {
      await expenseService.updateExpense(expenseId, {
        amount,
        category: formData.category,
        date: formData.date,
        note: formData.note
      });

      onSuccess && onSuccess();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update expense');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading expense...</p>;

  return (
    <div className="edit-expense">
      <h3>✏️ Edit Expense</h3>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Amount *</label>
          <input
            type="number"
            name="amount"
            step="0.01"
            min="0.01"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Date *</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Note</label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div className="form-actions">
          {onCancel && (
            <button type="button" onClick={onCancel} disabled={saving}>
              Cancel
            </button>
          )}
          <button type="submit" disabled={saving}>
            {saving ? 'Updating...' : 'Update Expense'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditExpense;
