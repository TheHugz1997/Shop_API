let express = require('express');
let router = express.Router();


const categoriesController = require('./controllers/categoriesController');
const productsController = require('./controllers/productsController');


router.get('/products', productsController.getProducts);
router.get('/product/:productId', productsController.getProduct);
router.post('/product/create', productsController.createProduct);
router.put('/product/modify', productsController.modifyProduct);
router.delete('/product/delete/:productId', productsController.deleteProduct);

router.get('/categories', categoriesController.getCategories);
router.get('/category/:categoryId', categoriesController.getCategory);
router.post('/category/create', categoriesController.createCategory);
router.put('/category/modify', categoriesController.modifyCategory);
router.delete('/category/delete/:categoryId', categoriesController.deleteCategory);

router.get('/categories/products/relation', categoriesController.getAllCategoryProductRelationships);
router.post('/category/product/relation/create', categoriesController.createCategoryProductRelationship);
router.put('/category/product/relation/modify', categoriesController.modifyCategoryProductRelationship);
router.delete('/category/product/relation/delete', categoriesController.deleteCategoryProductRelationship);

module.exports = router;