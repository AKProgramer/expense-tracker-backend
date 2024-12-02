// routes/groupRoutes.js
const express = require('express');
const { verifyToken } = require('../utils/jwt');
const { createGroup, getUserGroups, joinGroup } = require('../controllers/groupController');
const router = express.Router();

router.post('/create', verifyToken, createGroup);
router.get('/', verifyToken, getUserGroups);


module.exports = router;
