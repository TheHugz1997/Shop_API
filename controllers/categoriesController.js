const CategoriesModel = require('../models/categoriesModel');

const { v4: uuidv4 } = require('uuid');

exports.getCategories = async (req, res) => {
    try {
        // Fetch categories
        const categories = await CategoriesModel.getCategories(req.app.get('cassandraClient'));
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.getCategory = async (req, res) => {
    // Assuming categoryId is a parameter in the route
    const { categoryId } = req.params;

    try {
        // Fetch a single category by categoryId
        const category = await CategoriesModel.getCategory(req.app.get('cassandraClient'), categoryId);

    if (category) {
        res.json(category);
    } else {
        // If the category is not found, respond with a 404 status
        res.status(404).json({ error: `Category with ID ${categoryId} not found` });
    }
    } catch (error) {
        // Handle errors by sending an error response
        console.error('Error fetching category:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.createCategory = async (req, res) => {
    // Assuming categoryId and categoryName are provided in the body
    const { categoryName } = req.body;
    const categoryId = req.body.categoryId || uuidv4();

    try {
        // Call the createCategory function from the CategoriesModel
        await CategoriesModel.createCategory(req.app.get('cassandraClient'), categoryId, categoryName);

        // Respond with a success message
        res.status(201).json({ message: `Category ${categoryId} created with name: ${categoryName}` });
    } catch (error) {
        // Handle errors by sending an error response
        console.error('Error creating category:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.modifyCategory = async (req, res) => {
    const { newName, categoryId  } = req.body;

    try {
        // Call the modifyCategory function from the CategoriesModel
        await CategoriesModel.modifyCategory(req.app.get('cassandraClient'), categoryId, newName);

        // Respond with a success message
        res.json({ message: `Category ${categoryId} modified with new name: ${newName}` });
    } catch (error) {
        // Handle errors by sending an error response
        console.error('Error modifying category:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.deleteCategory = async (req, res) => {
    const { categoryId } = req.params;

    try {
        // Call the deleteCategory function from the CategoriesModel
        await CategoriesModel.deleteCategory(req.app.get('cassandraClient'), categoryId);

        // Respond with a success message
        res.json({ message: `Category ${categoryId} deleted` });
    } catch (error) {
        // Handle errors by sending an error response
        console.error('Error deleting category:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.getAllCategoryProductRelationships = async (req, res) => {
    try {
        // Fetch all Category-Product relationships
        const relationships = await CategoriesModel.getAllCategoryProductRelationships(req.app.get('cassandraClient'));
        res.json(relationships);
    } catch (error) {
        console.error('Error fetching Category-Product relationships:', error);
        res.status(500).send('Internal Server Error');
    }
};

exports.createCategoryProductRelationship = async (req, res) => {
    // Assuming categoryId and productId are provided in the body
    const { categoryId, productId } = req.body;

    try {
        // Call the createCategoryProductRelationship function from the CategoriesModel
        await CategoriesModel.createCategoryProductRelationship(req.app.get('cassandraClient'), categoryId, productId);

        // Respond with a success message
        res.status(201).json({ message: `Category-Product relationship created for Category ID ${categoryId} and Product ID ${productId}` });
    } catch (error) {
        // Handle errors by sending an error response
        console.error('Error creating Category-Product relationship:', error);
        res.status(500).send('Internal Server Error');
    }
};
  
exports.modifyCategoryProductRelationship = async (req, res) => {
    const { categoryId, productId, newCategory } = req.body;

    try {
        // Call the modifyCategoryProductRelationship function from the CategoriesModel
        await CategoriesModel.modifyCategoryProductRelationship(req.app.get('cassandraClient'), categoryId, productId, newCategory);

        // Respond with a success message
        res.json({ message: `Category-Product relationship modified for Product ID ${productId} with new Category ID: ${newCategory}` });
    } catch (error) {
        // Handle errors by sending an error response
        console.error('Error modifying Category-Product relationship:', error);
        res.status(500).send('Internal Server Error');
    }
};
  
exports.deleteCategoryProductRelationship = async (req, res) => {
    const { categoryId, productId } = req.body;

    try {
        // Call the deleteCategoryProductRelationship function from the CategoriesModel
        await CategoriesModel.deleteCategoryProductRelationship(req.app.get('cassandraClient'), categoryId, productId);

        // Respond with a success message
        res.json({ message: `Category-Product relationship deleted for Category ID ${categoryId} and Product ID ${productId}` });
    } catch (error) {
        // Handle errors by sending an error response
        console.error('Error deleting Category-Product relationship:', error);
        res.status(500).send('Internal Server Error');
    }
};
