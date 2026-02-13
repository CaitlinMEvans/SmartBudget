import { Link } from "react-router-dom";
import { request } from "../api/authApi.js";
import { useEffect, useState } from "react";
import BudgetContainer from "../components/BudgetContainer.jsx"

export default function Budget() {
  const [budgets, setBudgets] = useState([]);

  useEffect(() => {
    request("/budget", null, "GET").then(allBudgets => {
      setBudgets(allBudgets.budgets);
    });
  }, [])

  function addBudget() {

  }

  if (budgets.length <= 0) {
    return (
      <div>
        <p>No budgets found. Please create a budget to get started.</p>
          <button>
          <Link to="/budget/add" className="btn">
            Create budget
          </Link>
          </button>
      </div>
    );
  }

  return (
    <>
      <div style={styles.buttonContainer}>
        <Link
          to="/budget/add"
          style={styles.button}
        >Add Budget</Link>
      </div>
      <h1 style={{textAlign: "center"}}>All Budgets</h1>
      <div style={styles.budgetContainer}>
        <BudgetContainer budgets={budgets}/>
      </div>
      {/* <BudgetForm></BudgetForm> */}
    </>
  )
}

const styles = {
  buttonContainer: {
    display: "flex",
    justifyContent: "end",
    paddingTop: "1rem",
  },
  button: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 40,
    marginRight: "1rem",
    color: "white",
    background: "#2c2c2c",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 6,
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    zIndex: 1000,
  },
  budgetContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }
}