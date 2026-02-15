import "./BudgetCard.css";
import { useNavigate } from "react-router-dom";
import { request } from "../api/authApi";

export default function BudgetCard({ budget, onDelete }) {
  const navigate = useNavigate()
  
  async function editBudget() {
    navigate(`/budget/${budget.id}/edit`);
  }

  async function deleteBudget() {
    const confirmResponse = confirm("You are about to delete this budget. Please confirm that you'd like to delete it.");
    if (!confirmResponse) return;
    request(`/budget/${budget.id}`, null, "DELETE").then(() => {
      navigate('/budget');
      onDelete(budget.id);
    });
  }

  if (!budget) return null;

  const limit = Number.parseFloat(budget.limit ?? 0);
  const spent = Number.parseFloat(budget.expenses.reduce((sum, expense) => sum + expense.amount, 0) ?? 0);

  const remaining = limit - spent;

  const progressPercent =
    limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;

  // Set the color of the progress bar here based on progressPercent
  let backgroundColor = "";
  if (progressPercent >= 90)
    backgroundColor = "#db3434";
  else if (progressPercent >= 80)
    backgroundColor = "#dbd034";
  else
    backgroundColor = "#19dd00";

  const start = budget.startDate
    ? new Date(budget.startDate).toLocaleDateString()
    : "—";

  const end = budget.endDate
    ? new Date(budget.endDate).toLocaleDateString()
    : "—";

  const period = budget.period ?? "";
  const budgetPeriodName =
    period.length > 0 ? period[0].toUpperCase() + period.slice(1) : "Budget";

  return (
    <div className="dashboard-card">
      <div className="dashboard-header">
          <h2>{budgetPeriodName} Budget</h2>
          <span className="category">{budget.category.name ?? "Uncategorized"}</span>
      </div>

      <div className="edit-delete">
        <button className="edit" onClick={editBudget}>Edit</button>
        <button className="delete" onClick={deleteBudget}>Delete</button>
      </div>

      <div className="amounts">
        <p><strong>Limit:</strong> ${Number(limit).toLocaleString()}</p>
        <p><strong>Spent:</strong> ${Number(spent).toLocaleString()}</p>
        <p style={{ color: `${backgroundColor}` }}><strong>Remaining:</strong> ${Number(remaining).toLocaleString()}</p>
      </div>

      <div className="dates">
        <p><strong>Start:</strong> {start}</p>
        <p><strong>End:</strong> {end}</p>
      </div>

      <div className="progress-bar" aria-label="Budget progress">
        <div
          className="progress-fill"
          style={{ width: `${progressPercent}%`, backgroundColor: `${backgroundColor}` }}
        />
      </div>
    </div>
  );
}