// routes/expenseRoutes.js
const express = require('express');
const { verifyToken } = require('../utils/jwt');
const { addExpense, settleUp, getAllExpenses, getUserOweDetails } = require('../controllers/expenseController');
const router = express.Router();

router.post('/add', verifyToken, addExpense);
router.get('/', verifyToken, getAllExpenses);
// router.post('/settle-up', verifyToken, settleUp);
router.get('/owe', verifyToken, getUserOweDetails);

module.exports = router;
