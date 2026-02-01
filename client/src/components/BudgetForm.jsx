import { useEffect, useState } from "react";
import { request } from "../api/authApi";

export default function BudgetForm() {
  const [periodType, setPeriodType] = useState("monthly");
  const [amount, setAmount] = useState("");
  const [budgetId, setBudgetId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBudget() {
      try {
        const res = await request("/budget", null, "GET");

        if (!res.data) return;

        const data = await res.data;

        setBudgetId(data.budgetId);
        setAmount(data.amount);
        setPeriodType(data.periodType);
      } catch (err) {
        console.error(err);
      }
    }

    fetchBudget();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Use the request method that Caitlin built
      const data = await request("/budget", {
        id: budgetId,
        amount: Number(amount),
        periodType,
        startDate: new Date().toISOString()
      }, "POST");

      if (!data) {
        setError("Failed to save budget");
        return;
      }

      setSuccess(true);
      if (data.budgetId) setBudgetId(data.budgetId);
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Set Your Budget</h2>

      <fieldset>
        <legend>Period</legend>

        <label>
          <input
            type="radio"
            value="weekly"
            checked={periodType === "weekly"}
            onChange={() => setPeriodType("weekly")}
          />
          Weekly
        </label>

        <label>
          <input
            type="radio"
            value="monthly"
            checked={periodType === "monthly"}
            onChange={() => setPeriodType("monthly")}
          />
          Monthly
        </label>
      </fieldset>

      <label>
        Amount
        <input
          type="number"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </label>

      <button disabled={loading}>
        {loading ? "Saving..." : "Save Budget"}
      </button>

      {success && <p style={{ color: "green" }}>Budget saved successfully!</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
