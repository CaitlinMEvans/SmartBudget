import {prisma} from "../db/prisma.js";

export default {
  /**
   * Get all categories
   */
  async getAll() {
    return prisma.category.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true
      }
    });
  },

  /**
   * Get category by name (case-insensitive)
   */
  async getByName(name) {
    return prisma.category.findFirst({
      where: {
        name: {
          equals: name,
          mode: "insensitive"
        }
      },
      select: {
        id: true,
        name: true
      }
    });
  },

  /**
   * Get category by ID
   */
  async getById(id) {
    return prisma.category.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true
      }
    });
  },

  /**
   * Check if category exists
   */
  async exists(name) {
    const count = await prisma.category.count({
      where: {
        name: {
          equals: name,
          mode: "insensitive"
        }
      }
    });

    return count > 0;
  },

  /**
   * Create new category
   */
  async create(name) {
    return prisma.category.create({
      data: {
        name: name.toLowerCase().trim()
      },
      select: {
        id: true,
        name: true
      }
    });
  },
  
  /**
   * Update category
   */
  update(id, name) {
  return prisma.category.update({
    where: { id: Number(id) },
    data: { name }
  });
  },
  /**
   * Delete category
   */
  async delete(id) {
    return prisma.category.delete({
      where: { id: Number(id) }
    });
  }
};
