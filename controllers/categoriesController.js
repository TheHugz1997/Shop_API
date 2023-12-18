const CategoriesModel = require('../models/categoriesModel');

const categoriesController = async (req, res) => {
  try {
    const categories = await CategoriesModel.getCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

module.exports = categoriesController;