const cassandra = require('cassandra-driver');
const { v4: uuidv4 } = require('uuid');
const uuid = require('uuid');

const BasketModel = {
  createTable: async (client) => {
    try {
      // Create basket table with a user field
      const createBasketTableQuery = `
        CREATE TABLE IF NOT EXISTS basket (
            orderId UUID PRIMARY KEY,
            user_email TEXT,
            products map<TEXT, int>,
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

  calculateTotalPrice: async (client, products) => {
    let totalPrice = 0;
    const parsedProducts = JSON.parse(products);
  
    for (const product of parsedProducts) {
      const productId = product.productId;
      const quantity = product.quantity;
  
      console.log('Processing product:', productId, quantity);
  
      // Fetch the price of the product from the products table
      const getProductQuery = 'SELECT price, quantity FROM products WHERE productid = ?';
      console.log('Query:', getProductQuery);
      console.log('Parameters:', [productId.toString()]);
      const productResult = await client.execute(getProductQuery, [productId.toString()], { prepare: true });
      console.log('Product Result:', productResult);
  
      const productPrice = parseFloat(productResult.rows[0].price.toString());
      console.log('Product Price:', productPrice);
  
      // Update the total price
      totalPrice += quantity * productPrice;
  
      // Decrease the quantity in the products table
      const updateProductQuery = 'UPDATE products SET quantity = ? WHERE productid = ?';
      const updatedQuantity = productResult.rows[0].quantity - quantity;
  
      await client.execute(updateProductQuery, [updatedQuantity, productId.toString()], { prepare: true });
  
      console.log('Updated Quantity:', updatedQuantity);
      console.log('Total Price:', totalPrice);
    }
  
    return totalPrice;
  },


  saveOrder: async (client, orderId, userEmail, products) => {
    try {
        // Calculate total price based on product quantities
        const totalPrice = await BasketModel.calculateTotalPrice(client, products);

        // Convert the products map to an array of objects
        products = JSON.parse(products);

        const outputMap = products.reduce((acc, item) => {
          acc[item.productId] = item.quantity;
          return acc;
        }, {});

        // Insert order into the basket table using a prepared statement
        console.log('Inserting order with data:', orderId, userEmail, outputMap, totalPrice);
        const query = 'INSERT INTO basket (orderId, user_email, products, totalPrice) VALUES (?, ?, ?, ?)';
        await client.execute(query, [orderId, userEmail, outputMap, totalPrice], { prepare: true });        

        // Update product quantities in the products table
        await BasketModel.updateProductQuantities(client, products);

        console.log(`Order ${orderId} saved for user ${userEmail} with total price: ${totalPrice.toString()}`);
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
  }
}

module.exports = BasketModel;