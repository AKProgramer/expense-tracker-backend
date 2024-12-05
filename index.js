const express = require('express')
const app = express();
const connect = require('./database/connectDB');
const userRoutes = require('./routes/userRoutes');
const groupRoutes = require('./routes/groupRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const approvalRoutes = require('./routes/approvalRoutes');
const cors = require('cors')
require('colors')
require('dotenv').config()


app.use(
    cors({
      origin: "http://localhost:5173", // Replace with your frontend's URL
      credentials: true, // Allow cookies and other credentials
    })
  );
//He
app.use(express.json())
app.use(express.urlencoded({
    extended: false
}))

connect();
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/approvals', approvalRoutes);

app.listen(process.env.PORT, console.log(`Server is running on PORT: ${process.env.PORT.blue}`))