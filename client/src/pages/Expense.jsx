import React, { useEffect, useState } from 'react';
import expenseService from '../services/expenseService';
import categoryService from '../services/categoryService';
import ExpenseFilter from '../components/ExpenseFilter';
import './Expense.css';

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    categoryId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    note: ''
  });

  const [filters, setFilters] = useState({
    category: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [expenseData, categoryData] = await Promise.all([
        expenseService.getAllExpenses(),
        categoryService.getAllCategories()
      ]);

      setExpenses(expenseData || []);
      setCategories(categoryData || []);
      setFilteredExpenses(expenseData || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- FILTERING ---------------- */
  useEffect(() => {
    let result = [...expenses];

    if (filters.category) {
      result = result.filter(
        exp => exp.categoryId === Number(filters.category)
      );
    }

    if (filters.startDate) {
      result = result.filter(
        exp => exp.date.split('T')[0] >= filters.startDate
      );
    }

    if (filters.endDate) {
      result = result.filter(
        exp => exp.date.split('T')[0] <= filters.endDate
      );
    }

    result.sort((a, b) =>
      new Date(b.date) - new Date(a.date)
    );

    setFilteredExpenses(result);
    
  }, [expenses, filters]);

  /* APPLY FILTER */
const applyFilters = (filterValues) => {
  let result = [...expenses];

  if (filterValues.category) {
    result = result.filter(
      exp => exp.categoryId === Number(filterValues.category)
    );
  }

  if (filterValues.startDate) {
    result = result.filter(
      exp => exp.date.split('T')[0] >= filterValues.startDate
    );
  }

  if (filterValues.endDate) {
    result = result.filter(
      exp => exp.date.split('T')[0] <= filterValues.endDate
    );
  }

  result.sort((a, b) =>
    new Date(b.date) - new Date(a.date)
  );

  setFilteredExpenses(result);
};


/* RESET FILTER */
const resetFilters = () => {
  setFilteredExpenses(expenses);  // restore full list
};


  /* ---------------- INPUT ---------------- */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const payload = {
        categoryId: Number(formData.categoryId),
        amount: Number(formData.amount),
        date: formData.date,
        note: formData.note || null
      };

      if (editingExpense) {
        await expenseService.updateExpense(editingExpense.id, payload);
        setSuccess('Expense updated!');
      } else {
        await expenseService.createExpense(payload);
        setSuccess('Expense added!');
      }

      resetForm();
      await fetchData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save expense');
    }
  };

  /* ---------------- EDIT ---------------- */
  const handleEdit = (expense) => {
    setEditingExpense(expense);

    setFormData({
      categoryId: expense.categoryId,
      amount: expense.amount,
      date: expense.date
        ? expense.date.split('T')[0]
        : '',
      note: expense.note || ''
    });

    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;

    await expenseService.deleteExpense(id);
    await fetchData();
  };

  const resetForm = () => {
    setFormData({
      categoryId: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      note: ''
    });
    setEditingExpense(null);
    setShowForm(false);
  };

  const exportToCSV = () => {
  if (!filteredExpenses.length) {
    alert("No data to export");
    return;
  }

  const headers = ["Category", "Amount", "Date", "Note"];

  const rows = filteredExpenses.map(exp => [
    exp.category,
    exp.amount,
    new Date(exp.date).toLocaleDateString(),
    exp.note || ""
  ]);

  const csvContent =
    [headers, ...rows]
      .map(row => row.join(","))
      .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute(
    "download",
    `expenses-${new Date().toISOString().split("T")[0]}.csv`
  );

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


  const getTotalAmount = () =>
    filteredExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="expenses-page">
      <h1>💰 Expense Tracker</h1>

      {error && <div className="alert error-alert">{error}</div>}
      {success && <div className="alert success-alert">{success}</div>}


      {/*  ADD EXPENSE BUTTON */}
      <button
        onClick={() => {
          resetForm();
          setShowForm(true);
        }}
        className="add-expense-btn"
      >
        ➕ Add Expense
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="expense-form">
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleInputChange}
            required
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            placeholder="Enter amount (e.g. 5000)"
            required
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
            placeholder="Enter description (e.g. Electricity bill)"
          />

          <button type="submit">
            {editingExpense ? 'Update Expense' : 'Add Expense'}
          </button>

          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        </form>
      )}

      <ExpenseFilter
        categories={categories}
        filters={filters}
        onFilterChange={setFilters}
        onApplyFilter={applyFilters}
        onResetFilter={resetFilters}
      />

      <h3>Total: ₦{getTotalAmount().toFixed(2)}</h3>

      <button
        onClick={exportToCSV}
        className="export-btn"
      >
        📥 Export CSV
      </button>


      <ul>
        {filteredExpenses.map(exp => (
          <li key={exp.id}>
            <strong>{exp.category}</strong> — ₦{exp.amount.toFixed(2)} —
            {new Date(exp.date).toLocaleDateString()}
            <button onClick={() => handleEdit(exp)}>Edit</button>
            <button onClick={() => handleDelete(exp.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpensesPage;
