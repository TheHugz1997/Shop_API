let express = require('express');
let router = express.Router();


const categoriesController = require('./controllers/categoriesController');
const productsController = require('./controllers/productsController');


router.get('/products', productsController.getProducts);
router.get('/product/:productId', productsController.getProduct);
router.post('/product/create', productsController.createProduct);
router.put('/product/modify', productsController.modifyProduct);
router.delete('/product/delete/:productId', productsController.deleteProduct);

module.exports = router;