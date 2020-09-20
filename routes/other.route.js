const express = require('express');
const { createDocument, getAllDocument, updateDocument, updateSiteProperties, getSiteProperties, createCoupon, getCoupons } = require('../controllers/other.controller');


const router = express.Router();


router.route('/')
      // .post(authenticate,checkModerator,createProduct)
      .post(createDocument)
      .get(getAllDocument);
router.route('/siteProperties')
      // .post(authenticate,checkModerator,createProduct)
      .post(updateSiteProperties)
      .get(getSiteProperties);
router.route('/coupons')
      // .post(authenticate,checkModerator,createProduct)
      .post(createCoupon)
      .get(getCoupons);
    
router.route('/:id')
    //   .get(getSingleProduct)
      // .patch(authenticate,checkModerator,updateProduct)
      .patch(updateDocument)
      .delete(/* Deactivate Certain Product*/)

module.exports = router;