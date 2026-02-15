import React, { useEffect, useState } from "react";
import dashboardService from "../services/dashboardService";
import "./Dashboard.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import "./Dashboard.css";

const DashboardPage = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
  let isMounted = true;

  const fetchDashboard = async () => {
    try {
      const data = await dashboardService.getDashboard();
      if (isMounted) {
        setData(data);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      // If an error occurred, set empty data and display an error
      const emptyData = {
        "summary": {
            "totalBudget": 0,
            "totalSpent": 0,
            "remaining": 0,
            "expenseCount": 0
        },
        "budgets": [],
        "expenses": [],
        "recentExpenses": [],
        "categoryTotals": {},
        "weeklyTotals": []
      }
      setData(emptyData);
      setError("There was an error loading the dashboard. Please try again.");
    }
  };

  fetchDashboard();

  return () => {
    isMounted = false;
  };
}, []);


  if (!data) return <p>Loading dashboard...</p>;

  const {
    summary,
    expenses,
    categoryTotals,
    weeklyTotals
  } = data;

  const weeklyData = weeklyTotals.map((amount, index) => ({
    week: `Week ${index + 1}`,
    amount
  }));

  const categoryData = Object.entries(categoryTotals).map(
    ([name, amount]) => ({
      name,
      amount
    })
  );

  return (
    <div className="dashboard">

      <h1>📊 SmartBudget Dashboard</h1>
      {error && <h1 style={{color: "#ff0000"}}>{error}</h1>}

      {/* ========================= */}
      {/* SUMMARY CARDS */}
      {/* ========================= */}

      <div className="cards">
        <div className="card">
          <h3>Total Budget</h3>
          <h2>${summary.totalBudget.toFixed(2)}</h2>
        </div>

        <div className="card">
          <h3>Total Spent</h3>
          <h2>${summary.totalSpent.toFixed(2)}</h2>
        </div>

        <div className="card">
          <h3>Remaining</h3>
          <h2 className={summary.remaining < 0 ? "negative" : ""}>
            ${summary.remaining.toFixed(2)}
          </h2>
        </div>

        <div className="card">
          <h3>Total Expenses</h3>
          <h2>{summary.expenseCount}</h2>
        </div>
      </div>

      {/* ========================= */}
      {/* CHART SECTION */}
      {/* ========================= */}

      <div className="charts">

        <div className="chart-box">
          <h2>Spending This Month</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-box">
          <h2>Spending by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* ========================= */}
      {/* FULL EXPENSE TABLE */}
      {/* ========================= */}

      <h2>All Expenses (This Month)</h2>

      <table className="expense-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(exp => (
            <tr key={exp.id}>
              <td>{new Date(exp.expenseDate).toLocaleDateString()}</td>
              <td>{exp.category?.name}</td>
              <td>${Number(exp.amount).toFixed(2)}</td>
              <td>{exp.note || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default DashboardPage;
