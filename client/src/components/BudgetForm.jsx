import { useEffect, useState } from "react";
import { request } from "../api/authApi";
import "./BudgetForm.css";
import { useNavigate } from "react-router-dom";
import categoryService from "../services/categoryService";
import { useParams } from "react-router-dom";

export default function BudgetForm() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(0);
  const [limit, setLimit] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [period, setPeriod] = useState("weekly");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  const { id } = useParams();
  const isEditMode = Boolean(id);

  useEffect(() => {
    categoryService.getAllCategories().then(categories => {
      if (categories.length > 0) 
        setCategories(categories);
    });
  }, []);


  useEffect(() => {
    if (!isEditMode) return;

    async function loadBudget() {
      try {
        const budget = await request(`/budget/${id}`, null, "GET");

        setSelectedCategoryId(budget.categoryId);
        setLimit(budget.limit);
        setPeriod(budget.period);
        setStartDate(
          new Date(budget.startDate).toISOString().split("T")[0]
        );
      } catch {
        setError("Failed to load budget");
      }
    }

    loadBudget();
  }, [id, isEditMode]);


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
      const endpoint = isEditMode ? `/budget/${id}` : "/budget";
      const method = isEditMode ? "PUT" : "POST";

      const convertedStartDate = new Date(`${startDate}T00:00:00.000`);

      const data = await request(
        endpoint,
        {
          categoryId: selectedCategoryId,
          limit: numericLimit,
          period,
          startDate: convertedStartDate,
        },
        method
      );

      setSuccess(true);

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
      <h2>{isEditMode ? "Edit Budget" : "Set Your Budget"}</h2>

      <label className="flex-label">
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

      <label className="flex-label">
        Limit:
        <input
          type="number"
          min="0"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
          required
        />
      </label>

      <label className="flex-label">
        Start date:
        <input
          type="date"
          name="date"
          value={startDate}
          onChange={(event) => setStartDate(event.target.value)}
          required
        />
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
        {loading
          ? "Saving..."
          : isEditMode
            ? "Update Budget"
            : "Save Budget"}
      </button>

      {success && <p>Budget saved successfully!</p>}
      {error && <p>{error}</p>}
    </form>
  );
}