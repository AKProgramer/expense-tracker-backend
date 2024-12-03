// routes/expenseRoutes.js
const express = require('express');
const { verifyToken } = require('../utils/jwt');
const { addExpense, settleUp, getAllExpenses, getUserOweDetails } = require('../controllers/expenseController');
const router = express.Router();

// Route for adding an expense
router.post('/add', addExpense);

// Route for fetching all expenses in a group
router.get('/:groupId', verifyToken, getAllExpenses);

// Route for settling up a specific balance within an expense
router.post('/settle-up', verifyToken, settleUp);

// Route for fetching user owe details
router.get('/owe/:userId', getUserOweDetails);

  

module.exports = router;