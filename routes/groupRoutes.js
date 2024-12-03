// routes/groupRoutes.js
const express = require('express');
const { verifyToken } = require('../utils/jwt');
const { createGroup, getUserGroups, getMemberDetails, calculateUserBalances } = require('../controllers/groupController');
const router = express.Router();

router.post('/create', verifyToken, createGroup);
router.get('/:userId', getUserGroups);
router.get('/:groupId/members', getMemberDetails);
router.get('/:groupId/:userId/user-balances', calculateUserBalances);

module.exports = router;
