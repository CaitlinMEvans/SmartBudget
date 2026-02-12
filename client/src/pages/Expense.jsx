import React, { useState, useEffect } from 'react';
import expenseService from '../services/expenseService';
import categoryService from '../services/categoryService';
import './Expense.css';

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    date: '',
    note: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  /* ---------------- helpers ---------------- */

  const formatAmount = (value) => {
    const num = Number(value);
    return isNaN(num) ? '0.00' : num.toFixed(2);
  };

  /* ---------------- data fetching ---------------- */

  const fetchData = async () => {
    try {
      setLoading(true);

      const [expenseData, categoryData] = await Promise.all([
        expenseService.getAllExpenses(),
        categoryService.getAllCategories()
      ]);

      setExpenses(Array.isArray(expenseData) ? expenseData : []);
      setCategories(categoryData.map(c => c.name));
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- form handlers ---------------- */

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount'
        ? value.replace(/[^\d.]/g, '')
        : value
    }));
  };

  const resetForm = () => {
    setFormData({ category: '', amount: '', date: '', note: '' });
    setEditingExpense(null);
    setShowForm(false);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');

  const payload = {
    category: formData.category,
    amount: Number(formData.amount),
    date: formData.date,
    note: formData.note
  };

  // DEBUG LOGS
  console.log('Submitting expense:', payload);
  console.log('Available categories:', categories);

  try {
    if (editingExpense) {
      await expenseService.updateExpense(editingExpense.id, payload);
      setSuccess('Expense updated successfully');
    } else {
      await expenseService.createExpense(payload);
      setSuccess('Expense added successfully');
    }

    await fetchData();
    resetForm();
    setTimeout(() => setSuccess(''), 3000);
  } catch (err) {
    console.error('Full error:', err); 
    setError(err.response?.data?.error || 'Failed to save expense');
  }
};

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setFormData({
      category: expense.category,
      amount: String(expense.amount),
      date: expense.date?.split('T')[0] || '',
      note: expense.note || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;

    try {
      await expenseService.deleteExpense(id);
      setSuccess('Expense deleted');
      await fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete expense');
    }
  };

  if (loading) return <p>Loading expenses...</p>;

  /* ---------------- UI ---------------- */

  return (
    <div className="expenses-page">
      <h1>💰 Expense Tracker</h1>

      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <button className="primary-btn" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : 'Add Expense'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="expense-form">
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            placeholder="Amount"
            required
            min="0"
            step="0.01"
          />

          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />

          <input
            type="text"
            name="note"
            value={formData.note}
            onChange={handleInputChange}
            placeholder="Note (optional)"
          />

          <button type="submit">
            {editingExpense ? 'Update Expense' : 'Add Expense'}
          </button>
        </form>
      )}

      <ul className="expenses-list">
        {expenses.map(exp => (
          <li key={exp.id} className="expense-item">
            <div>
              <strong>{exp.category?.name}</strong> — ₦{formatAmount(exp.amount)}
              <div className="meta">
                {new Date(exp.date).toLocaleDateString()}
                {exp.note && ` • ${exp.note}`}
              </div>
            </div>

            <div className="actions">
              <button onClick={() => handleEdit(exp)}>Edit</button>
              <button className="danger" onClick={() => handleDelete(exp.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpensesPage;
