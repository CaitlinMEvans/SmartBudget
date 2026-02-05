import React, { useState, useEffect } from 'react';
import expenseService from '../services/expenseService';
import categoryService from '../services/categoryService';
import AddExpense from './AddExpense';
import EditExpense from './EditExpense';
import ExpenseFilter from './ExpenseFilter';
import './ExpenseList.css';

/**
 * ExpenseList Component
 * Displays expenses using category NAME (string)
 */
const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // UI state
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState(null);

  // Filters (category is now a STRING)
  const [filters, setFilters] = useState({
    category: '',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 20
  });

  // Pagination
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1
  });

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, [filters]);

  /**
   * Fetch expenses
   */
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await expenseService.getAllExpenses(filters);

      setExpenses(response.data);
      setPagination({
        total: response.total,
        page: response.page,
        pages: response.pages
      });

      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch categories (for filter dropdown)
   */
  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  /**
   * Handle filter change
   */
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1
    }));
  };

  /**
   * Delete expense
   */
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;

    try {
      await expenseService.deleteExpense(id);
      setSuccess('Expense deleted successfully!');
      fetchExpenses();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete expense');
    }
  };

  /**
   * After add/edit success
   */
  const handleSuccess = () => {
    setShowAddForm(false);
    setEditingExpenseId(null);
    setSuccess('Expense saved successfully!');
    fetchExpenses();
    setTimeout(() => setSuccess(''), 3000);
  };

  /**
   * Pagination
   */
  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  /**
   * Format date
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="expense-list-container">
      {/* Header */}
      <div className="expense-header">
        <h2>💰 My Expenses</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-primary"
        >
          {showAddForm ? 'Cancel' : '+ Add Expense'}
        </button>
      </div>

      {/* Alerts */}
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Add Expense */}
      {showAddForm && (
        <div className="form-modal">
          <AddExpense
            onSuccess={handleSuccess}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {/* Edit Expense */}
      {editingExpenseId && (
        <div className="form-modal">
          <EditExpense
            expenseId={editingExpenseId}
            onSuccess={handleSuccess}
            onCancel={() => setEditingExpenseId(null)}
          />
        </div>
      )}

      {/* Filters */}
      <ExpenseFilter
        categories={categories}
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {/* Expense List */}
      {loading ? (
        <div className="loading">Loading expenses...</div>
      ) : expenses.length === 0 ? (
        <div className="empty-state">
          <p>📭 No expenses found. Start tracking by adding your first expense!</p>
        </div>
      ) : (
        <>
          {/* Summary */}
          <div className="expense-summary">
            <p>
              Showing {expenses.length} of {pagination.total} expense(s)
              {filters.category && ' in selected category'}
            </p>
            <p className="total-amount">
              Total: $
              {expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}
            </p>
          </div>

          {/* Table */}
          <div className="expenses-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Note</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(expense => (
                  <tr key={expense.id || expense._id}>
                    <td>{formatDate(expense.date)}</td>
                    <td>{expense.note || '-'}</td>
                    <td>
                      <span className="category-badge">
                        {expense.category}
                      </span>
                    </td>
                    <td className="amount">
                      ${expense.amount.toFixed(2)}
                    </td>
                    <td className="actions">
                      <button
                        onClick={() => setEditingExpenseId(expense.id || expense._id)}
                        className="btn-icon btn-edit"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id || expense._id)}
                        className="btn-icon btn-delete"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="btn btn-secondary"
              >
                ← Previous
              </button>
              <span className="page-info">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="btn btn-secondary"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExpenseList;
