import "./BudgetCard.css";

export default function BudgetCard({ budget }) {
  if (!budget) return null;

  const limit = Number.parseFloat(budget.limit ?? 0);
  const spent = Number.parseFloat(budget.spent ?? 0);

  const remaining = limit - spent;

  const progressPercent =
    limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;

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
        <span className="category">{budget.category ?? "Uncategorized"}</span>
      </div>

      <div className="amounts">
        <p><strong>Limit:</strong> ${Number(limit).toLocaleString()}</p>
        <p><strong>Spent:</strong> ${Number(spent).toLocaleString()}</p>
        <p><strong>Remaining:</strong> ${Number(remaining).toLocaleString()}</p>
      </div>

      <div className="dates">
        <p><strong>Start:</strong> {start}</p>
        <p><strong>End:</strong> {end}</p>
      </div>

      <div className="progress-bar" aria-label="Budget progress">
        <div
          className="progress-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}