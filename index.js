const express = require('express');
const app = express();
const connect = require('./database/connectDB');
const userRoutes = require('./routes/userRoutes');
const groupRoutes = require('./routes/groupRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const approvalRoutes = require('./routes/approvalRoutes');
const cors = require('cors');
require('colors');
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
   credentials: true }));

connect();
app.use((req, res, next) => {
  console.log(`Request Method: ${req.method}`);
  console.log(`Request Headers:`, req.headers);
  console.log(`Request Body:`, req.body);
  next();
});
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/approvals', approvalRoutes);

// Export the app as a Vercel function handler
module.exports = (req, res) => {
  app(req, res); // Vercel will handle each request through this handler
};
