const cassandra = require('cassandra-driver');

// Assuming your Cassandra client is already initialized (e.g., in server.js)

const ProductsModel = {
  createTable: async () => {
    try {
      const query = `
        CREATE TABLE IF NOT EXISTS products (
          productId UUID PRIMARY KEY,
          productName TEXT
        )
      `;
      await client.execute(query);
      console.log('Products table created or already exists');
    } catch (error) {
      console.error('Error creating products table:', error);
      throw error;
    }
  },

  getProducts: async () => {
    try {
      const query = 'SELECT * FROM products';
      const result = await client.execute(query);
      return result.rows;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },
};

module.exports = ProductsModel;