import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import BudgetContainer from "../components/BudgetContainer.jsx";
import { request } from "../api/authApi.js";

export default function Home() {
  const { isAuthed } = useAuth();
  const [budgets, setBudgets] = useState(null);

  useEffect(() => {
    if (!isAuthed) return;

    let isMounted = true;

    request("/budget", null, "GET").then(data => {
      if (isMounted) {
        setBudgets(data.budgets);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [isAuthed]);

  return (
    <div style={{ padding: 16 }}>
      <h1>SmartBudget Dashboard</h1>
      <p>Quick Visual Summaries of your student spending with your created categories, expenses, and even budgets!</p>

      {isAuthed ? (
        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
          <h2>Active Budgets</h2>
          <BudgetContainer budgets={budgets} />
        </div>
      ) : (
        <p>Please register or log in to continue.</p>
      )}
    </div>
  );
}