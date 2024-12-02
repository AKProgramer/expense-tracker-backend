const mongoose = require('mongoose');
const Approval = require('./Approval');
const groupSchema = new mongoose.Schema({
  groupName: { type: String, required: true },
  description: { type: String },
  groupImage: { type: String },
  groupType: { type: String, enum: ['Home', 'Trip', 'Others'], required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expense' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

// Add a static method to create a group and approvals
groupSchema.statics.createGroupWithApproval = async function (groupData, approvalUserIds) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create the group
    const group = await this.create([groupData], { session });

    // Generate approvals for each user
    const approvals = approvalUserIds.map((userId) => ({
      group: group[0]._id,
      user: userId,
      status: 'pending',
      fromUser: groupData.createdBy,
      toUser: userId,
    }));
    await Approval.insertMany(approvals, { session });

    await session.commitTransaction();
    session.endSession();

    return group[0];
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};
module.exports = mongoose.model('Group', groupSchema);
