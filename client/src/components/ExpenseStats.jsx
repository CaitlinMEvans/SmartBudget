import React from 'react';
import './ExpenseStats.css';

/**
 * ExpenseStats Component
 * Display expense statistics and category breakdown
 */
const ExpenseStats = ({ stats }) => {
  const { totalExpenses = 0, expenseCount = 0, byCategory = [] } = stats;

  // Top 5 categories by spending
  const topCategories = byCategory.slice(0, 5);

  const topTotal = topCategories.reduce((sum, cat) => sum + cat.total, 0);
  const othersTotal = totalExpenses - topTotal;

  return (
    <div className="expense-stats">
      {/* Overview */}
      <div className="stats-overview">
        <div className="stat-card total-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <p className="stat-label">Total Spent</p>
            <h2 className="stat-value">${totalExpenses.toFixed(2)}</h2>
          </div>
        </div>

        <div className="stat-card count-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <p className="stat-label">Total Expenses</p>
            <h2 className="stat-value">{expenseCount}</h2>
          </div>
        </div>

        <div className="stat-card avg-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <p className="stat-label">Average Per Expense</p>
            <h2 className="stat-value">
              ${expenseCount > 0 ? (totalExpenses / expenseCount).toFixed(2) : '0.00'}
            </h2>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      {byCategory.length > 0 && (
        <div className="category-breakdown">
          <h3>📂 Spending by Category</h3>

          <div className="breakdown-list">
            {topCategories.map((cat, index) => (
              <div key={index} className="breakdown-item">
                <div className="breakdown-header">
                  <span className="category-name">{cat.category}</span>

                  <div className="breakdown-values">
                    <span className="category-amount">
                      ${cat.total.toFixed(2)}
                    </span>
                    <span className="category-percentage">
                      {cat.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="breakdown-progress">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}

            {/* Others */}
            {othersTotal > 0 && (
              <div className="breakdown-item">
                <div className="breakdown-header">
                  <span className="category-name">Others</span>
                  <div className="breakdown-values">
                    <span className="category-amount">
                      ${othersTotal.toFixed(2)}
                    </span>
                    <span className="category-percentage">
                      {((othersTotal / totalExpenses) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="breakdown-progress">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${(othersTotal / totalExpenses) * 100}%`,
                      backgroundColor: '#9ca3af'
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseStats;
