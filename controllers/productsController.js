const ProductsModel = require('../models/productsModel');

const { v4: uuidv4 } = require('uuid');

exports.getProducts = async (req, res) => {
    try {
      // Fetch products
      const products = await ProductsModel.getProducts(req.app.get('cassandraClient'));
      res.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).send('Internal Server Error');
    }
  };

exports.getProduct = async (req, res) => {
    const { productId } = req.params;

    try {
        // Fetch a single product by productId with the client
        const product = await ProductsModel.getProduct(req.app.get('cassandraClient'), productId);

        if (product) {
            res.json(product);
        } else {
            // If the product is not found, respond with a 404 status
            res.status(404).json({ error: `Product with ID ${productId} not found` });
        }
    } catch (error) {
        // Handle errors by sending an error response
        console.error('Error fetching product:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.createProduct = async (req, res) => {
    const { productName, productPhoto, quantity, price } = req.body;
    // Use provided UUID or generate a new one
    const productId = req.body.productId || uuidv4();

    try {
        // Pass the client to the createProduct function
        await ProductsModel.createProduct(req.app.get('cassandraClient'), productId, productName, productPhoto, quantity, price);
        res.status(201).json({ message: `Product ${productId} created with name: ${productName}, photo: ${productPhoto}, quantity: ${quantity}, and price: ${price}` });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.modifyProduct = async (req, res) => {
    const { productId, newName, newPhoto, newQuantity, newPrice } = req.body;

    try {
        // Pass the client to the modifyProduct function
        await ProductsModel.modifyProduct(req.app.get('cassandraClient'), productId, newName, newPhoto, newQuantity, newPrice);

        // Respond with a success message
        res.json({ message: `Product ${productId} modified with new name: ${newName}, new photo: ${newPhoto}, new quantity: ${newQuantity}, new price: ${newPrice}` });
    } catch (error) {
        // Handle errors by sending an error response
        console.error('Error modifying product:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.deleteProduct = async (req, res) => {
    const { productId } = req.params;

    try {
        // Call the deleteProduct function from the ProductsModel with the client
        await ProductsModel.deleteProduct(req.app.get('cassandraClient'), productId);

        // Respond with a success message
        res.json({ message: `Product ${productId} deleted` });
    } catch (error) {
        // Handle errors by sending an error response
        console.error('Error deleting product:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.setProductPromotion = async (req, res) => {
    const { productId, isOnPromotion } = req.body;
  
    try {
        // Pass the client to the setProductPromotion function
        await ProductsModel.setProductPromotion(req.app.get('cassandraClient'), productId, isOnPromotion);

        res.json({ message: `Product ${productId} promotion status set to ${isOnPromotion}` });
    } catch (error) {
        console.error('Error setting product promotion status:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.getPromotionalProducts = async (req, res) => {
    try {
      const promotionalProducts = await ProductsModel.getPromotionalProducts(req.app.get('cassandraClient'));
      res.json(promotionalProducts);
    } catch (error) {
      console.error('Error fetching promotional products:', error);
      res.status(500).send('Internal Server Error');
    }
  };