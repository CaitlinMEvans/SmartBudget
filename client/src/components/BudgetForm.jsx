import { useEffect, useState } from "react";
import { request } from "../api/authApi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./BudgetForm.css";
import { useNavigate } from "react-router-dom";
import categoryService from "../services/categoryService";

export default function BudgetForm() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(0);
  const [limit, setLimit] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [period, setPeriod] = useState("weekly");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    categoryService.getAllCategories().then(categories => {
      // Make sure the request sent back actual data
      if (categories.length > 0)
        setCategories(categories)
    })
  })

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const numericLimit = Number(limit);

    if (!selectedCategoryId) {
      setError("Category is required.");
      return;
    }

    if (!Number.isFinite(numericLimit) || numericLimit <= 0) {
      setError("Limit must be a number greater than 0.");
      return;
    }

    setLoading(true);

    try {
      const data = await request(
        "/budget",
        {
          categoryId: selectedCategoryId,
          limit: numericLimit,
          period,
          startDate: startDate.toISOString(),
        },
        "POST"
      );

      setSuccess(true);

      // Optional: route back to budgets after save
      setTimeout(() => navigate("/budget"), 400);
      return data;
    } catch (err) {
      setError(err?.message || "Failed to save budget");
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectChange(event) {
    setSelectedCategoryId(Number(event.target.value));
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Set Your Budget</h2>

      <label>
        Category:
        <select
            name="categoryId"
            value={selectedCategoryId}
            onChange={handleSelectChange}
            required
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
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
        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
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

      <button disabled={loading}>{loading ? "Saving..." : "Save Budget"}</button>

      {success && <p>Budget saved successfully!</p>}
      {error && <p>{error}</p>}
    </form>
  );
}