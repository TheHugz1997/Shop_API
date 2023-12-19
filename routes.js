let express = require('express');
let router = express.Router();


const categoriesController = require('./controllers/categoriesController');
const productsController = require('./controllers/productsController');
const basketController = require('./controllers/basketController');

// Products routes
router.get('/products', productsController.getProducts);
router.get('/product/:productId', productsController.getProduct);
router.post('/product/create', productsController.createProduct);
router.put('/product/modify', productsController.modifyProduct);
router.delete('/product/delete/:productId', productsController.deleteProduct);

// Promotions routes
router.get('/products/promotions', productsController.getPromotionalProducts);
router.put('/product/set/promotion', productsController.setProductPromotion);


// Categories routes
router.get('/categories', categoriesController.getCategories);
router.get('/category/:categoryId', categoriesController.getCategory);
router.post('/category/create', categoriesController.createCategory);
router.put('/category/modify', categoriesController.modifyCategory);
router.delete('/category/delete/:categoryId', categoriesController.deleteCategory);

// Categories Products relations routes
router.get('/categories/products/relation', categoriesController.getAllCategoryProductRelationships);
router.post('/category/product/relation/create', categoriesController.createCategoryProductRelationship);
router.put('/category/product/relation/modify', categoriesController.modifyCategoryProductRelationship);
router.delete('/category/product/relation/delete', categoriesController.deleteCategoryProductRelationship);

// Basket routes
router.post('/basket/order/save', basketController.saveOrder);
router.get('/basket/orders', basketController.getOrders);
router.put('/basket/order/modify', basketController.modifyOrder);
router.delete('/basket/order/delete/:orderId', basketController.deleteOrder);


module.exports = router;