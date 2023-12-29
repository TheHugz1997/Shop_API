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
    let  { userEmail, products } = req.body;
    const orderId = req.body.orderId || uuidv4();

    try {

        products = JSON.stringify(products, null, 2);
    
        // Pass the client to the saveOrder function
        await BasketModel.saveOrder(req.app.get('cassandraClient'), orderId, userEmail, products);
        res.status(201).json({ message: `Order ${orderId} saved for user ${userEmail}` });
    } catch (error) {
        console.error('Error saving order:', error);
        res.status(500).send('Internal Server Error');
    }
};