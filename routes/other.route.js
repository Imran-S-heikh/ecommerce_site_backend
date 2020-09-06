const express = require('express');
const { createDocument, getAllDocument, updateDocument } = require('../controllers/other.controller');


const router = express.Router();


router.route('/')
      // .post(authenticate,checkModerator,createProduct)
      .post(createDocument)
      .get(getAllDocument);
    
router.route('/:id')
    //   .get(getSingleProduct)
      // .patch(authenticate,checkModerator,updateProduct)
      .patch(updateDocument)
      .delete(/* Deactivate Certain Product*/)

module.exports = router;