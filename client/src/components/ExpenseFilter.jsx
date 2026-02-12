import React, { useState, useEffect } from 'react';
import './ExpenseFilter.css';

const ExpenseFilter = ({ categories, filters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    onFilterChange(localFilters);
  };

  const clearFilters = () => {
    const cleared = {
      category: '',
      startDate: '',
      endDate: ''
    };
    setLocalFilters(cleared);
    onFilterChange(cleared);
  };

  return (
    <div className="expense-filter">
      <h3>🔍 Filter Expenses</h3>

      <div className="filter-grid">

        <div className="filter-group">
          <label>Category</label>
          <select
            name="category"
            value={localFilters.category}
            onChange={handleChange}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Start Date</label>
          <input
            type="date"
            name="startDate"
            value={localFilters.startDate}
            onChange={handleChange}
          />
        </div>

        <div className="filter-group">
          <label>End Date</label>
          <input
            type="date"
            name="endDate"
            value={localFilters.endDate}
            onChange={handleChange}
          />
        </div>

      </div>

      <div className="filter-actions">
        <button onClick={clearFilters} className="secondary-btn">
          Reset
        </button>
        <button onClick={applyFilters} className="primary-btn">
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default ExpenseFilter;
