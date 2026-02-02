import db from "../db/index.js";

export default {
  /**
   * Get all categories
   */
  async getAll() {
    const { rows } = await db.query(
      "SELECT id, name FROM categories ORDER BY name"
    );
    return rows;
  },

  /**
   * Get category by name
   */
  async getByName(name) {
    const { rows } = await db.query(
      "SELECT id, name FROM categories WHERE LOWER(name) = LOWER($1)",
      [name]
    );
    return rows[0];
  },

  /**
   * Get category by ID
   */
  async getById(id) {
    const { rows } = await db.query(
      "SELECT id, name FROM categories WHERE id = $1",
      [id]
    );
    return rows[0];
  },

  /**
   * Check if category exists
   */
  async exists(name) {
    const { rowCount } = await db.query(
      "SELECT 1 FROM categories WHERE LOWER(name) = LOWER($1)",
      [name]
    );
    return rowCount > 0;
  },

  /**
   * Create new category
   */
  async create(name) {
    const { rows } = await db.query(
      "INSERT INTO categories (name) VALUES ($1) RETURNING id, name",
      [name]
    );
    return rows[0];
  },

  /**
   * Delete category
   */
  async delete(id) {
    await db.query(
      "DELETE FROM categories WHERE id = $1",
      [id]
    );
  }
};
