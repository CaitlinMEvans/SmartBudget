import { getActiveBudgets } from "../utils/budgets.js";


export async function getDashboard(req, res) {
  const userId = req.user?.userId;

  const activeBudgets = await getActiveBudgets(userId);

  return res.json({ budgets: activeBudgets });
}