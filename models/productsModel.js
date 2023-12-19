const cassandra = require('cassandra-driver');

const ProductsModel = {
  createTable: async (client) => {
    try {
      const createProductsTableQuery = `
        CREATE TABLE IF NOT EXISTS products (
          productId UUID PRIMARY KEY,
          productName TEXT,
          productPhoto TEXT,
          quantity INT,
          price DECIMAL,
          promotion BOOLEAN 
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

  createProduct: async (client, productId, productName, productPhoto, quantity, price) => {
    try {
        // Convert quantity to integer and price to decimal
        const parsedQuantity = parseInt(quantity, 10);
        const parsedPrice = parseFloat(price);

        const query = 'INSERT INTO products (productId, productName, productPhoto, quantity, price) VALUES (?, ?, ?, ?, ?)';
        await client.execute(query, [productId, productName, productPhoto, parsedQuantity, parsedPrice], { prepare: true });
        console.log(`Product ${productId} created with name: ${productName}, quantity: ${parsedQuantity}, and price: ${parsedPrice}`);
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
  },

  modifyProduct: async (client, productId, newName, newPhoto, newQuantity, newPrice) => {
    try {
        const query = 'UPDATE products SET productName = ?, productPhoto = ?, quantity = ?, price = ? WHERE productId = ?';
        await client.execute(query, [newName, newPhoto, newQuantity, newPrice, productId], { prepare: true });
        console.log(`Product ${productId} modified with new name: ${newName}, new photo: ${newPhoto}, new quantity: ${newQuantity}, new price: ${newPrice}`);
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
  },

  setProductPromotion: async (client, productId, isOnPromotion, newPrice) => {
    try {
      let query;
      if (isOnPromotion && typeof newPrice === 'number') {
        // If setting promotion and providing a new price
        query = 'UPDATE products SET promotion = ?, price = ? WHERE productId = ?';
        await client.execute(query, [isOnPromotion, newPrice, productId], { prepare: true });
      } else {
        // If only setting or removing promotion without modifying price
        query = 'UPDATE products SET promotion = ? WHERE productId = ?';
        await client.execute(query, [isOnPromotion, productId], { prepare: true });
      }

      console.log(`Product ${productId} promotion status set to ${isOnPromotion}`);

      if (isOnPromotion && typeof newPrice === 'number') {
        console.log(`Product ${productId} price updated to ${newPrice}`);
      }
    } catch (error) {
      console.error('Error setting product promotion status:', error);
      throw error;
    }
  },

  getPromotionalProducts: async (client) => {
    try {
      // Check if the materialized view exists, and create it if not
      await client.execute(`
        CREATE MATERIALIZED VIEW IF NOT EXISTS promotional_products_view AS
        SELECT productId, productName, productPhoto, quantity, price, promotion
        FROM products
        WHERE promotion IS NOT NULL AND productId IS NOT NULL
        PRIMARY KEY (promotion, productId);
      `);

      // Query the materialized view for promotional products
      const query = 'SELECT * FROM promotional_products_view WHERE promotion = true';
      const result = await client.execute(query);

      return result.rows;
    } catch (error) {
      console.error('Error fetching promotional products:', error);
      throw error;
    }
  },
};


module.exports = ProductsModel;
