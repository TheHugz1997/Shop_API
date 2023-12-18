const cassandra = require('cassandra-driver');

const CategoriesModel = {
  createTables: async (client) => {
    try {
      // Create categories table
      const createCategoriesTableQuery = `
        CREATE TABLE IF NOT EXISTS categories (
          categoryId UUID PRIMARY KEY,
          categoryName TEXT
        )
      `;
      await client.execute(createCategoriesTableQuery);
      console.log('Categories table created or already exists');

      // Create relationship table
      const createCategoryProductRelationshipTableQuery = `
        CREATE TABLE IF NOT EXISTS category_product_relationship (
          categoryId UUID,
          productId UUID,
          PRIMARY KEY (categoryId, productId)
        )
      `;
      await client.execute(createCategoryProductRelationshipTableQuery);
      console.log('Category-Product relationship table created or already exists');
    } catch (error) {
      console.error('Error creating tables:', error);
      throw error;
    }
  },

  // Additional data-related tasks specific to the categories table can be added here
};

module.exports = CategoriesModel;