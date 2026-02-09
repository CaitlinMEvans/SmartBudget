import "./BudgetCard.css";

export default function BudgetCard({budget}) {

  if (!budget)
    return(<></>);

  budget.limit = Number.parseFloat(budget.limit);
  budget.spent = Number.parseFloat(budget.spent);
  
  const remaining = budget.limit - budget.spent;
  const progressPercent = Math.min((budget.spent / budget.limit) * 100, 100);
  const start = new Date(budget.startDate).toLocaleDateString();
  const end = new Date(budget.endDate).toLocaleDateString();
  const budgetPeriodName = budget.period[0].toUpperCase() + budget.period.substring(1);

  return (
    <div key={budget.id} className="dashboard-card">
      <div className="dashboard-header">
        <h2>{budgetPeriodName} Budget</h2>
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
  )
}