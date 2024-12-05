const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const User = require('../models/User');

// Register a new user
exports.registerUser = async (req, res) => {
  const { email, password, username, fullName } = req.body;
  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists. Please use a different email.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ email, password: hashedPassword, username, fullName });

    // Save the user to the database
    await newUser.save();

    // Generate a token for the new user
    const token = generateToken({ id: newUser._id });

    // Respond with success message and token
    res.status(201).json({ 
      message: 'Signup successful', 
      userId: newUser._id, 
      token 
    });
  } catch (err) {
    res.status(500).json({ 
      error: 'Registration failed', 
      details: err.message 
    });
  }
};


// Login an existing user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = generateToken({ id: user._id });
    res.status(200).json({ message: 'Login successful',userId : user._id, token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
};

// Update user details
exports.updateUser = async (req, res) => {
  const { userId } = req.params;
  const { email, username, fullName, password } = req.body;
  try {
    const updateData = { email, username, fullName };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10); // Hash new password
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true, // Return updated user
      runValidators: true, // Ensure validations are run
    });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: 'Update failed', details: err.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed', details: err.message });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'username _id'); // Include only username and id
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users', details: err.message });
  }
};


// Get a user by ID
exports.getUser = async (req, res) => {
  const { id } = req.query; // Assuming ID is passed as a query parameter
  try {
    const user = await User.findById(id, '-password'); // Exclude password
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user', details: err.message });
  }
};
