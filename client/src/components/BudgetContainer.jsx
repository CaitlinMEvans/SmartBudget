import BudgetCard from "./BudgetCard.jsx";
import "./BudgetContainer.css";

export default function BudgetContainer({budgets}) {

  if (!budgets || budgets.length === 0) {
    return (
      <div className="dashboard-empty">
        <p>No active budgets found. Please create a budget to get started.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-pair">
        {budgets.map((budget) => {
          return (
            <BudgetCard key={budget.id} budget={budget}/>
          );
        })}
      </div>
    </div>
  );
}