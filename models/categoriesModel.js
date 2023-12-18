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

    createCategory: async (client, categoryId, categoryName) => {
        try {
            const query = 'INSERT INTO categories (categoryId, categoryName) VALUES (?, ?)';
            await client.execute(query, [categoryId, categoryName]);
            console.log(`Category ${categoryId} created with name: ${categoryName}`);
        } catch (error) {
            console.error('Error creating category:', error);
            throw error;
        }
    },

    getCategories: async (client) => {
        try {
            const query = 'SELECT * FROM categories';
            const result = await client.execute(query);
            return result.rows;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    getCategory: async (client, categoryId) => {
        try {
            const query = 'SELECT * FROM categories WHERE categoryId = ?';
            const result = await client.execute(query, [categoryId]);
            return result.rows[0];
        } catch (error) {
            console.error('Error fetching category:', error);
            throw error;
        }
    },

    modifyCategory: async (client, categoryId, newName) => {
        try {
            const query = 'UPDATE categories SET categoryName = ? WHERE categoryId = ?';
            await client.execute(query, [newName, categoryId]);
            console.log(`Category ${categoryId} modified with new name: ${newName}`);
        } catch (error) {
            console.error('Error modifying category:', error);
            throw error;
        }
    },

    deleteCategory: async (client, categoryId) => {
        try {
            const query = 'DELETE FROM categories WHERE categoryId = ?';
            await client.execute(query, [categoryId]);
            console.log(`Category ${categoryId} deleted`);
        } catch (error) {
            console.error('Error deleting category:', error);
            throw error;
        }
    },

    createCategoryProductRelationship: async (client, categoryId, productId) => {
        try {
            const query = 'INSERT INTO category_product_relationship (categoryId, productId) VALUES (?, ?)';
            await client.execute(query, [categoryId, productId]);
            console.log(`Category-Product relationship created for Category ID ${categoryId} and Product ID ${productId}`);
        } catch (error) {
            console.error('Error creating Category-Product relationship:', error);
            throw error;
        }
    },

    modifyCategoryProductRelationship: async (client, categoryId, productId, newCategory) => {
        try {
            const query = 'UPDATE category_product_relationship SET categoryId = ? WHERE categoryId = ? AND productId = ?';
            await client.execute(query, [newCategory, categoryId, productId]);
            console.log(`Category-Product relationship modified for Product ID ${productId} with new Category ID: ${newCategory}`);
        } catch (error) {
            console.error('Error modifying Category-Product relationship:', error);
            throw error;
        }
    },

    deleteCategoryProductRelationship: async (client, categoryId, productId) => {
        try {
            const query = 'DELETE FROM category_product_relationship WHERE categoryId = ? AND productId = ?';
            await client.execute(query, [categoryId, productId]);
            console.log(`Category-Product relationship deleted for Category ID ${categoryId} and Product ID ${productId}`);
        } catch (error) {
            console.error('Error deleting Category-Product relationship:', error);
            throw error;
        }
    },
    getAllCategoryProductRelationships: async (client) => {
        try {
            const query = 'SELECT * FROM category_product_relationship';
            const result = await client.execute(query);
            return result.rows;
        } catch (error) {
            console.error('Error fetching Category-Product relationships:', error);
            throw error;
        }
    }
};

module.exports = CategoriesModel;