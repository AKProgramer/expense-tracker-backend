// routes/approvalRoutes.js
const express = require('express');
const { verifyToken } = require('../utils/jwt');
const { getApprovals, respondToApproval } = require('../controllers/approvalController');
const router = express.Router();

router.get('/', verifyToken, getApprovals);
router.post('/respond/:approvalId', verifyToken, respondToApproval);

module.exports = router;
