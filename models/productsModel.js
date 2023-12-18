const cassandra = require('cassandra-driver');

const ProductsModel = {
  createTable: async (client) => {
    try {
      // Create products table
      const createProductsTableQuery = `
        CREATE TABLE IF NOT EXISTS products (
          productId UUID PRIMARY KEY,
          productName TEXT,
          productPhoto TEXT
        )
      `;
      await client.execute(createProductsTableQuery);
      console.log('Products table created or already exists');
    } catch (error) {
      console.error('Error creating products table:', error);
      throw error;
    }
  },

  getProducts: async (client) => {
    try {
      const query = 'SELECT * FROM products';
      const result = await client.execute(query);
      return result.rows;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  getProduct: async (client, productId) => {
    try {
      const query = 'SELECT * FROM products WHERE productId = ?';
      const result = await client.execute(query, [productId]);
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  createProduct: async (client, productId, productName, productPhoto) => {
    try {
      const query = 'INSERT INTO products (productId, productName, productPhoto) VALUES (?, ?, ?)';
      await client.execute(query, [productId, productName, productPhoto]);
      console.log(`Product ${productId} created with name: ${productName} and url: ${productPhoto}`);
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  modifyProduct: async (client, productId, newName, newPhoto) => {
    try {
        const query = 'UPDATE products SET productName = ?, productPhoto = ? WHERE productId = ?';
        await client.execute(query, [newName, newPhoto, productId]);
        console.log(`Product ${productId} modified with new name: ${newName} and new photo: ${newPhoto}`);
    } catch (error) {
        console.error('Error modifying product:', error);
        throw error;
    }
  },

  deleteProduct: async (client, productId) => {
    try {
        const query = 'DELETE FROM products WHERE productId = ?';
        await client.execute(query, [productId]);
        console.log(`Product ${productId} deleted`);
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
  }
};

module.exports = ProductsModel;
