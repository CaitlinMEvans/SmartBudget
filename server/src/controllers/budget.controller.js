// server/src/controllers/auth.controller.js
import { prisma } from "../db/prisma.js"

export async function getBudgets(req, res) {
  try {
    const userId = req.user?.userId;

    // database query to retrieve data based on id
    const budgets = await prisma.budget.findMany({ where: { userId } })

    // check if query returned anything - if not, update status to an error code
    if (!budget)
      return res.status(603).json({ error: "A budget does not exist for that user." });

    return res.status(200).json({ data: { budgets } });
  } catch (err) {
    console.error("getBugdets error:", err);
    return res.status(500).json({ error: "Server error." });
  }
}

export async function getBudgetById(req, res) {
  try {
    const budgetId = Number(req.params.id);
    const userId = req.user?.userId;

    // database query to retrieve data based on id
    const budget = await prisma.budget.findFirst({ where: { userId: userId, id: budgetId } })

    // check if query returned anything - if not, update status to an error code
    if (!budget)
      return res.status(602).json({ error: "A budget does not exist with that Id." });

    return res.status(200).json({ data: { budget } });
  } catch (err) {
    console.error("getBugdetById error:", err);
    return res.status(500).json({ error: "Server error." });
  }
}

export async function postBudget(req, res) {
  try {
    let { category, limit, period, startDate } = req.body || {};

    // Make the startDate a date object
    startDate = new Date(startDate);

    // Make a copy of the start date since Dates are mutable
    let endDate = new Date(startDate);

    // Add 7 days to the start date to get the endDate of the weekly budget
    if (period.toLowerCase() === "weekly")
      endDate.setDate(endDate.getDate() + 7);

    // Add 30 days to the start date to get the endDate of the monthly budget
    else if (period.toLowerCase() === "monthly")
      endDate.setMonth(startDate.getMonth() + 1);

    // The period isn't weekly or monthly, so return an error status
    else
      return res.status(604).json({ error: "Budget period must be either 'weekly' or 'monthly'" });

    // Update the dates to an ISO string
    startDate = startDate.toISOString();
    endDate = endDate.toISOString();

    if (category === undefined || limit === undefined || period === undefined || startDate === undefined)
      return res.status(601).json({ error: "Cannot create new budget. One or more required fields are missing." });

    const userId = req.user?.userId;

    // Check to see if a budget already exists with the given period
    const existingBudget = await prisma.budget.findFirst({ where: { period: period, endDate: { gte: startDate } } })

    // If a budget already exists, return an error
    if (existingBudget)
      return res.status(600).json({ error: "A budget with the given period already exists" });

    // database query to create the budget
    const budgetUpdated = await prisma.budget.create({
      data: {
        category,
        limit,
        period,
        startDate,
        endDate,
        user: {
          connect: { id: userId }
        }
      }
    })

    // check if error comes back from postgres
    if (!budgetUpdated)
      throw Error("Unable to create a new budget");

    return res.status(200).json({ message: "Budget successfully added", budgetId: budgetUpdated });
  } catch (err) {
    console.log("Error in postBudget", err);
    return res.status(500).json({ error: "Server error" });
  }

}

export async function putBudget(req, res) {
  try {
    let { budgetId, category, limit, period, startDate } = req.body || {};

    // Make the startDate a date object
    startDate = new Date(startDate);

    // Make a copy of the start date since Dates are mutable
    let endDate = new Date(startDate);

    // Add 7 days to the start date to get the endDate of the weekly budget
    if (period.toLowerCase() === "weekly")
      endDate.setDate(endDate.getDate() + 7);

    // Add 30 days to the start date to get the endDate of the monthly budget
    else if (period.toLowerCase() === "monthly")
      endDate.setMonth(startDate.getMonth() + 1);

    // The period isn't weekly or monthly, so return an error status
    else
      return res.status(604).json({ error: "Budget period must be either 'weekly' or 'monthly'" });

    // Update the dates to an ISO string
    startDate = startDate.toISOString();
    endDate = endDate.toISOString();

    if (category === undefined || limit === undefined || period === undefined || startDate === undefined)
      return res.status(601).json({ error: "Cannot update budget. One or more required fields are missing." });

    const userId = req.user?.userId;

    // Check to see if the budgetId exists
    const existingBudget = await prisma.budget.findFirst({ where: { id: budgetId } })

    // If a budget doesn't exist, return an error
    if (!existingBudget)
      return res.status(605).json({ message: "Could not find budget with specified Id" });

    // Update the budget
    const updatedBudget = prisma.budget.update({
      data: {
        category,
        limit,
        period,
        startDate,
        endDate,
        user: {
          connect: { id: userId }
        }
      },
      where: { id: budgetId }
    })

    return res.status(200).json({ message: "Budget successfully updated" });
  } catch (err) {
    console.log("Error in putBudget", err);
    return res.status(500).json({ error: "Server error" });
  }
}