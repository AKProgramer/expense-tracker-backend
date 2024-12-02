const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    fullName: { type: String, required: true },
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
    approvalsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Approval' }],
    approvalsReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Approval' }],
  });
module.exports = mongoose.model('User', userSchema);  