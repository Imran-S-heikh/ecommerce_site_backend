const express = require('express');
const { newOrders, totalIncome,getMainStats, summary, latestBayers } = require('../controllers/stats.controller');


const router = express.Router();

router.post('/',getMainStats)
router.post('/summary',summary)
router.post('/latestBayers',latestBayers)
// router.get('/income',totalIncome)

module.exports = router;
