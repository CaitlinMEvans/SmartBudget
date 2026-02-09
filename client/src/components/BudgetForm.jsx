import { useState } from "react";
import { request } from "../api/authApi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./BudgetForm.css";

export default function BudgetForm() {
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [period, setPeriod] = useState("weekly");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    // Check various error conditions
    if (limit <= 0) {
      setError("Limit cannot be less than or equal to 0");
      return;
    }

    if (category === "") {
      setError("The category must have a value.")
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      // Use the request method that Caitlin built
      const data = await request("/budget", {
        category,
        limit,
        period,
        startDate: startDate.toISOString()
      }, "POST");

      if (!data) {
        setError("Failed to save budget");
        return;
      }

      setSuccess(true);
      if (data.budgetId) setBudgetId(data.budgetId);
    } catch (err) {
      setError("Failed to save budget");
    } finally {
      setLoading(false);
    }
  }

  function setDate(date) {
    const newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    setStartDate(newDate);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Set Your Budget</h2>

      <label>
        Category:
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
      </label>

      <label>
        Limit:
        <input
          type="number"
          min="0"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          required
        />
      </label>

      <label>
        Start date:
        <DatePicker selected={startDate} onChange={(date) => setDate(date)} />
      </label>

      <fieldset>
        <legend>Period</legend>

        <label>
          <input
            type="radio"
            value="weekly"
            checked={period === "weekly"}
            onChange={() => setPeriod("weekly")}
          />
          Weekly
        </label>

        <label>
          <input
            type="radio"
            value="monthly"
            checked={period === "monthly"}
            onChange={() => setPeriod("monthly")}
          />
          Monthly
        </label>
      </fieldset>

      <button disabled={loading}>
        {loading ? "Saving..." : "Save Budget"}
      </button>

      {success && <p style={{ color: "green" }}>Budget saved successfully!</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
