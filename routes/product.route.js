const express = require('express');
const { createProduct,getProducts, getSingleProduct, updateProduct } = require('../controllers/product.controller');
const { authenticate, checkModerator } = require('../controllers/auth.controller');


const router = express.Router();


router.route('/')
      // .post(authenticate,checkModerator,createProduct)
      .post(createProduct)
      .get(getProducts);
    
router.route('/:id')
      .get(getSingleProduct)
      .patch(authenticate,checkModerator,updateProduct)
      .delete(/* Deactivate Certain Product*/)

module.exports = router;