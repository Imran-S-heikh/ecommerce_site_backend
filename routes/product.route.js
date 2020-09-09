const express = require('express');
const { createProduct,getProducts, getSingleProduct, updateProduct, checkout } = require('../controllers/product.controller');
const { authenticate, checkModerator } = require('../controllers/auth.controller');


const router = express.Router();


router.get('/checkout',checkout);
router.route('/')
// .post(authenticate,checkModerator,createProduct)
.post(createProduct)
.get(getProducts);

router.route('/:id')
.get(getSingleProduct)
// .patch(authenticate,checkModerator,updateProduct)
.patch(updateProduct)
.delete(/* Deactivate Certain Product*/)


module.exports = router;