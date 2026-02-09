import { useEffect, useState } from "react";
import { request } from "../api/authApi";
import "./Dashboard.css";

const Dashboard = () => {
  const [budgets, setBudgets] = useState(null);

  useEffect(() => {
    // Get the information about the two active budgets for weekly and monthly (if they exist)
    request("/dashboard", null, "GET").then(data => {
      // Get the budgets from the response
      const budgets = data.budgets;

      setBudgets(budgets.map(budget => {
        return {
          id: budget.id,
          category: budget.category,
          limit: budget.limit,
          spent: 10,
          startDate: budget.startDate,
          endDate: budget.endDate
        }
      }))
      budgets;
    });
  }, []);

  if (!budgets || budgets.length === 0) {
    return (
      <div className="dashboard-empty">
        <p>No active budgets found. Please create a budget to get started.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Active Budgets</h1>
      <div className="dashboard-pair">
        {budgets.map((budget) => {
          const remaining = budget.limit - budget.spent;
          const progressPercent = Math.min((budget.spent / budget.limit) * 100, 100);
          const start = new Date(budget.startDate).toLocaleDateString();
          const end = new Date(budget.endDate).toLocaleDateString();

          return (
            <div key={budget.id} className="dashboard-card">
              <div className="dashboard-header">
                <h2>{budget.period} Budget</h2>
                <span className="category">{budget.category}</span>
              </div>
              <div className="amounts">
                <p><strong>Limit:</strong> ${budget.limit.toLocaleString()}</p>
                <p><strong>Spent:</strong> ${budget.spent.toLocaleString()}</p>
                <p><strong>Remaining:</strong> ${remaining.toLocaleString()}</p>
              </div>
              <div className="dates">
                <p><strong>Start:</strong> {start}</p>
                <p><strong>End:</strong> {end}</p>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;