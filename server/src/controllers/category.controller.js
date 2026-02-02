import CategoryModel from "../models/category.js";

/**
 * GET /api/categories
 */
export const getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.getAll();

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch categories"
    });
  }
};

/**
 * GET /api/categories/:name
 */
export const getCategoryByName = async (req, res) => {
  try {
    const category = await CategoryModel.getByName(req.params.name);

    if (!category) {
      return res.status(404).json({
        success: false,
        error: "Category not found"
      });
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch category"
    });
  }
};

/**
 * POST /api/categories
 */
export const createCategory = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      success: false,
      error: "Category name is required"
    });
  }

  try {
    const exists = await CategoryModel.exists(name);

    if (exists) {
      return res.status(400).json({
        success: false,
        error: "Category already exists"
      });
    }

    const category = await CategoryModel.create(name.toLowerCase());

    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to create category"
    });
  }
};
