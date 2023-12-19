const BasketModel = require('../models/basketModel');
const { v4: uuidv4 } = require('uuid');

exports.getOrders = async (req, res) => {
    try {
    // Fetch orders
    const orders = await BasketModel.getOrders(req.app.get('cassandraClient'));
    res.json(orders);
    } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).send('Internal Server Error');
    }
};

exports.saveOrder = async (req, res) => {
    const { userEmail, products } = req.body;
    // Use provided UUID or generate a new one
    const orderId = req.body.orderId || uuidv4();

    try {
        // Pass the client to the saveOrder function
        await BasketModel.saveOrder(req.app.get('cassandraClient'), orderId, userEmail, products);
        res.status(201).json({ message: `Order ${orderId} saved for user ${userEmail}` });
    } catch (error) {
        console.error('Error saving order:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.modifyOrder = async (req, res) => {
    const { orderId, newProducts } = req.body;
  
    try {
      await BasketModel.modifyOrder(req.app.get('cassandraClient'), orderId, newProducts, req.user.email);
  
      res.json({ message: `Order ${orderId} modified` });
    } catch (error) {
      console.error('Error modifying order:', error);
      res.status(500).send('Internal Server Error');
    }
};

exports.deleteOrder = async (req, res) => {
    const { orderId } = req.params;

    try {
    // Call the deleteOrder function from the BasketModel with the client
    await BasketModel.deleteOrder(req.app.get('cassandraClient'), orderId);
    res.json({ message: `Order ${orderId} deleted` });
    } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).send('Internal Server Error');
    }
};

