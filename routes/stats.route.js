const express = require('express');
const { newOrders, totalIncome,getMainStats, summary } = require('../controllers/stats.controller');


const router = express.Router();

router.get('/',getMainStats)
router.get('/summary',summary)
// router.get('/income',totalIncome)

module.exports = router;
