// server/src/controllers/auth.controller.js
import { createBudget, updateBudget } from "../models/budget.model.js";

export async function getBudget(req, res) {
  try {
    const { id } = req.body || {};

    // database query to retrieve data based on id

    // check if query returned anything - if not, update status to an error code

    return res.status(200).json({data: { budgetId: 1, amount: 10, periodType: "Monthly" }});
  } catch (err) {
    console.error("getBugdet error:", err);
    return res.status(500).json({ error: "Server error." });
  }
}

export async function postBudget(req, res) {
  try {
    const { amount, periodType, startDate } = req.body || {};
    
    // const userId = req.user.userId;

    // database query to create the budget

    // check if error comes back from postgres

    res.status(200).json({ message: "Budget successfully added", budgetId: 1 });
  } catch (err) {
    console.log("Error in postBudget", err);
    return res.status(500).json({ error: "Server error" });
  }

}

export async function putBudget(req, res) {
  try {
    const { amount, periodType, startDate } = req.body || {};
    const { userId } = req.user;

    // database query to update the budget

    // check if error comes back from postgres

    res.status(200).json({ message: "Budget successfully updated" });
  } catch (err) {
    console.log("Error in putBudget", err);
    return res.status(500).json({ error: "Server error" });
  }
}