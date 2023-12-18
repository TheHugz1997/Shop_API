const ProductsModel = require('../models/productsModel');

const productsController = async (req, res) => {
  try {
    // Ensure the products table exists before fetching data
    await ProductsModel.createTable();

    // Fetch products
    const products = await ProductsModel.getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

module.exports = productsController;