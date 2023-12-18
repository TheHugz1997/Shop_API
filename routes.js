let express = require('express');
let router = express.Router();


const categoriesController = require('./controllers/categoriesController');



router.get('/categories', categoriesController);

module.exports = router;