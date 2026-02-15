import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/routes/auth.routes.js";
import categoryRoutes from "./src/routes/category.routes.js";
import expenseRoutes from "./src/routes/expense.routes.js";
import budgetRoutes from "./src/routes/budget.routes.js";
import dashboardRoutes from "./src/routes/dashboard.routes.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: true, // Temporarily allow all for testing
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// ==========================
// Routes (ALL routes should be here, BEFORE error handler)
// ==========================
app.get("/", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/expenses', expenseRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/dashboard", dashboardRoutes);

// ==========================
// Error Handler (Should be LAST)
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