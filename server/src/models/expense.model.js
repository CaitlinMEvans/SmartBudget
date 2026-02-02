import db from "../db/index.js";

export default {
  /**
   * Get all expenses for a user
   */
  async getExpensesByUserId(userId) {
    const { rows } = await db.query(
      `
      SELECT
        id,
        user_id,
        category,
        amount,
        note,
        expense_date,
        created_at
      FROM expenses
      WHERE user_id = $1
      ORDER BY expense_date DESC
      `,
      [userId]
    );

    return rows;
  },

  /**
   * Get expense by ID
   */
  async getExpenseById(id) {
    const { rows } = await db.query(
      `
      SELECT
        id,
        user_id,
        category,
        amount,
        note,
        expense_date,
        created_at
      FROM expenses
      WHERE id = $1
      `,
      [id]
    );

    return rows[0];
  },

  /**
   * Create new expense
   */
  async createExpense({ userId, category, amount, date, note }) {
    const { rows } = await db.query(
      `
      INSERT INTO expenses (
        user_id,
        category,
        amount,
        expense_date,
        note
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [
        userId,
        category.toLowerCase().trim(),
        amount,
        date,
        note || ""
      ]
    );

    return rows[0];
  },

  /**
   * Update expense
   */
  async updateExpense(id, data) {
    const fields = [];
    const values = [];
    let index = 1;

    for (const key in data) {
      fields.push(`${key} = $${index}`);
      values.push(data[key]);
      index++;
    }

    values.push(id);

    const { rows } = await db.query(
      `
      UPDATE expenses
      SET ${fields.join(", ")}
      WHERE id = $${index}
      RETURNING *
      `,
      values
    );

    return rows[0];
  },

  /**
   * Delete expense
   */
  async deleteExpense(id) {
    await db.query(
      "DELETE FROM expenses WHERE id = $1",
      [id]
    );
  }
};
