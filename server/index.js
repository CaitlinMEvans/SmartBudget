import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./src/routes/auth.routes.js";
import budgetRoutes from "./src/routes/budget.routes.js";

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/", (req, res) => res.json({ ok: true }));

app.use("/auth", authRoutes);
app.use("/budget", budgetRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server running on port ${port}`));