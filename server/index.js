import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/routes/auth.routes.js";
import categoryRoutes from "./src/routes/category.routes.js";
import expenseRoutes from "./src/routes/expense.routes.js";
import budgetRoutes from "./src/routes/budget.routes.js";
import dasboardRoutes from "./src/routes/dashboard.routes.js";

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// ==========================
// Routes
// ==========================
app.get("/", (req, res) => res.json({ ok: true }));

app.use("/auth", authRoutes);
app.use('/categories', categoryRoutes);
app.use('/expenses', expenseRoutes);
app.use('/budgets', budgetRoutes);
app.use('/dashboard', dasboardRoutes);

// ==========================
// Error Handler (Optional but Recommended)
// ==========================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong on the server'
  });
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server running on port ${port}`));