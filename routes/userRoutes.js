const express = require('express');
const { verifyToken } = require('../utils/jwt');
const { registerUser, loginUser, updateUser, deleteUser, getUsers, getUser } = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/getAllUsers', getUsers); // Get all users
router.get('/user', verifyToken, getUser); // Get user by ID
router.put('/:userId', verifyToken, updateUser); // Update user details
router.delete('/:userId', verifyToken, deleteUser); // Delete a user
module.exports = router;
