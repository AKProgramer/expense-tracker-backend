const express = require('express')
const app = express();
const connect = require('./database/connectDB');
const userRoutes = require('./routes/userRoutes');
const groupRoutes = require('./routes/groupRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const approvalRoutes = require('./routes/approvalRoutes');
const cors = require('cors')
require('colors');
require('dotenv').config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    cors({
      origin: process.env.FRONTEND_URL, // Replace with your frontend's URL
      credentials: true, // Allow cookies and other credentials
    })
  );
 
connect();
app.get('/api/', (req, res) => {
    res.send('Hello World');
})
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/approvals', approvalRoutes);
app.listen(3000, () => {
    console.log(`Server running on port ${process.env.PORT}`.yellow.bold);
})