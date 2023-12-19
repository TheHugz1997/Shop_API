const cassandra = require('cassandra-driver');

const BasketModel = {
    createTable: async (client) => {
        try {
            // Create basket table with a user field
            const createBasketTableQuery = `
            CREATE TABLE IF NOT EXISTS basket (
                orderId UUID PRIMARY KEY,
                user_email TEXT,
                products map<UUID, int>,
                totalPrice DECIMAL
            )
            `;
            await client.execute(createBasketTableQuery);
            console.log('Basket table created or already exists');
        } catch (error) {
            console.error('Error creating basket table:', error);
            throw error;
        }
    },

    saveOrder: async (client, orderId, userEmail, products) => {
        try {
            // Calculate total price based on product quantities
            const totalPrice = await calculateTotalPrice(client, products);

            // Insert order into the basket table
            const query = 'INSERT INTO basket (orderId, user_email, products, totalPrice) VALUES (?, ?, ?, ?)';
            await client.execute(query, [orderId, userEmail, products, totalPrice], { prepare: true });

            // Update product quantities in the products table
            await updateProductQuantities(client, products);

            console.log(`Order ${orderId} saved for user ${userEmail} with total price: ${totalPrice}`);
        } catch (error) {
            console.error('Error saving order:', error);
            throw error;
        }
    },

    getOrders: async (client) => {
        try {
            const query = 'SELECT * FROM basket';
            const result = await client.execute(query);
            return result.rows;
        } catch (error) {
            console.error('Error fetching orders:', error);
            throw error;
        }
    },

    modifyOrder: async (client, orderId, newProducts, userEmail) => {
        try {
            // Delete the existing order
            await BasketModel.deleteOrder(client, orderId);

            // Create a new order with the updated products
            const newOrderId = cassandra.types.Uuid.random();
            await BasketModel.saveOrder(client, newOrderId, userEmail, newProducts);

            console.log(`Order ${orderId} modified`);
        } catch (error) {
            console.error('Error modifying order:', error);
            throw error;
        }
    },
    
    deleteOrder: async (client, orderId) => {
        try {
            const deleteOrderQuery = 'DELETE FROM basket WHERE orderId = ?';
            await client.execute(deleteOrderQuery, [orderId]);
            console.log(`Order ${orderId} deleted`);
        } catch (error) {
            console.error('Error deleting order:', error);
            throw error;
        }
    },

    calculateTotalPrice: async (client, products) => {
        let totalPrice = 0;

        // Assuming the products parameter is an object with product IDs as keys and quantities as values
        for (const productId in products) {
            const quantity = products[productId];

            // Fetch the price of the product from the products table
            const getProductQuery = 'SELECT price FROM products WHERE productId = ?';
            const productResult = await client.execute(getProductQuery, [productId]);
            const productPrice = productResult.rows[0].price;

            // Update the total price
            totalPrice += quantity * productPrice;
        }

    return totalPrice;
    },

    updateProductQuantities: async (client, products) => {
        for (const productId in products) {
            const quantity = products[productId];

            // Fetch the current quantity of the product from the products table
            const getProductQuery = 'SELECT quantity FROM products WHERE productId = ?';
            const productResult = await client.execute(getProductQuery, [productId]);
            const currentQuantity = productResult.rows[0].quantity;

            // Calculate the new quantity and update the products table
            const newQuantity = currentQuantity - quantity;
            const updateQuantityQuery = 'UPDATE products SET quantity = ? WHERE productId = ?';
            await client.execute(updateQuantityQuery, [newQuantity, productId], { prepare: true });
        }
    }

};

module.exports = BasketModel;
