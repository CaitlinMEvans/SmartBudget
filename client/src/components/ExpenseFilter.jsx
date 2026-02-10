import React, { useState } from 'react';
import './ExpenseFilter.css';

/**
 * ExpenseFilter Component
 * Provides filtering options for expenses (category by name)
 */
const ExpenseFilter = ({ categories, filters, onFilterChange }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  /**
   * Handle filter input changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Apply filters
   */
  const handleApply = () => {
    onFilterChange(localFilters);
    setShowFilters(false);
  };

  /**
   * Clear all filters
   */
  const handleClear = () => {
    const clearedFilters = {
      category: '',
      startDate: '',
      endDate: '',
      page: 1
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  /**
   * Quick filter presets
   */
  const handleQuickFilter = (preset) => {
    const today = new Date();
    let startDate = '';
    let endDate = today.toISOString().split('T')[0];

    switch (preset) {
      case 'today':
        startDate = endDate;
        break;
      case 'week': {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        startDate = weekAgo.toISOString().split('T')[0];
        break;
      }
      case 'month': {
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        startDate = monthAgo.toISOString().split('T')[0];
        break;
      }
      case 'year':
        startDate = `${today.getFullYear()}-01-01`;
        break;
      default:
        startDate = '';
        endDate = '';
    }

    const newFilters = {
      ...localFilters,
      startDate,
      endDate
    };

    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Check if any filters are active
  const hasActiveFilters =
    filters.category || filters.startDate || filters.endDate;

  return (
    <div className="expense-filter">
      {/* Filter Toggle */}
      <div className="filter-header">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn btn-secondary"
        >
          🔍 {showFilters ? 'Hide Filters' : 'Show Filters'}
          {hasActiveFilters && <span className="filter-badge">Active</span>}
        </button>

        {/* Quick Filters */}
        <div className="quick-filters">
          <button onClick={() => handleQuickFilter('today')} className="quick-filter-btn">
            Today
          </button>
          <button onClick={() => handleQuickFilter('week')} className="quick-filter-btn">
            Last 7 Days
          </button>
          <button onClick={() => handleQuickFilter('month')} className="quick-filter-btn">
            Last 30 Days
          </button>
          <button onClick={() => handleQuickFilter('year')} className="quick-filter-btn">
            This Year
          </button>
        </div>
      </div>

      {/* Filter Form */}
      {showFilters && (
        <div className="filter-form">
          <div className="filter-row">
            {/* Category Filter */}
            <div className="filter-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={localFilters.category}
                onChange={handleChange}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.name} value={cat.name}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div className="filter-group">
              <label htmlFor="startDate">From Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={localFilters.startDate}
                onChange={handleChange}
              />
            </div>

            {/* End Date */}
            <div className="filter-group">
              <label htmlFor="endDate">To Date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={localFilters.endDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Filter Actions */}
          <div className="filter-actions">
            <button onClick={handleClear} className="btn btn-secondary">
              Clear Filters
            </button>
            <button onClick={handleApply} className="btn btn-primary">
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseFilter;
