// controllers/groupController.js
const Group = require('../models/Group');
const Approval = require('../models/Approval');
const Expense = require('../models/Expense');

exports.createGroup = async (req, res) => {
  const { groupName, description, groupImage, groupType, members } = req.body;

  console.log(req.body);

  try {
    // Extract the IDs of users who should receive approval requests
    const approvalUserIds = members;

    // Create group and approval requests
    const group = await Group.createGroupWithApproval(
      {
        groupName,
        description,
        groupImage,
        groupType,
        members: [req.user.id, ...members],
        createdBy: req.user.id,
      },
      approvalUserIds
    );

    res.status(201).json({ message: 'Group created successfully with approvals', group });
  } catch (err) {
    console.error('Error creating group');
    console.error(err.message);
    res.status(500).json({ error: 'Failed to create group', details: err.message });
  }
};

exports.getUserGroups = async (req, res) => {
  const userId = req.params.userId;
  try {
    const groups = await Group.find({ members: userId }).populate('members', 'username');
    res.status(200).json({ groups });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch groups', details: err.message });
  }
};


exports.getMemberDetails = async (req, res) => {
  const { groupId } = req.params;

  try {
    // Find the group by ID and populate the members
    const group = await Group.findById(groupId).populate('members', '_id username');

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Respond with the members' details
    res.json({
      groupName: group.groupName,
      members: group.members, // This will contain the populated member details
    });
  } catch (error) {
    console.error('Error fetching group members:', error);
    res.status(500).json({ error: 'Server error' });
  }
}
exports.calculateUserBalances = async (req, res) => {
  const { groupId } = req.params;
  const {userId} = req.params; // Assuming authenticated user's ID is in req.user

  try {
    // Fetch the group and its expenses
    const groupName = await Group.findById(groupId).groupName;
    console.log(groupName);
    const group = await Group.findById(groupId).populate('expenses');
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const toGiveDetails = {}; // Map of { userId: { username, amount } }
    const toTakeDetails = {}; // Map of { userId: { username, amount } }

    // Iterate over each expense in the group
    for (const expenseId of group.expenses) {
      const expense = await Expense.findById(expenseId)
        .populate('splitDetails.user', 'username')
        .populate('createdBy', 'username');

      // Process "to give" details
      expense.splitDetails.forEach((split) => {
        if (split.user._id.toString() === userId) {
          const createdBy = expense.createdBy;
          if (!toGiveDetails[createdBy._id]) {
            toGiveDetails[createdBy._id] = { username: createdBy.username, amount: 0 };
          }
          toGiveDetails[createdBy._id].amount += split.amount; // Add amount user owes
        }
      });

      // Process "to take" details
      if (expense.createdBy._id.toString() === userId) {
        expense.splitDetails.forEach((split) => {
          if (split.user._id.toString() !== userId) {
            if (!toTakeDetails[split.user._id]) {
              toTakeDetails[split.user._id] = { username: split.user.username, amount: 0 };
            }
            toTakeDetails[split.user._id].amount += split.amount; // Add amount others owe
          }
        });
      }
    }

    // Convert the details into arrays for easy parsing on the frontend
    const toGive = Object.values(toGiveDetails);
    const toTake = Object.values(toTakeDetails);

    // Calculate total amounts
    const totalToGive = toGive.reduce((sum, user) => sum + user.amount, 0);
    const totalToTake = toTake.reduce((sum, user) => sum + user.amount, 0);

    // Send response with detailed balances
    return res.status(200).json({
      groupName,
      groupId,
      totalToGive,
      totalToTake,
      toGive,
      toTake,
    });
  } catch (error) {
    console.error('Error calculating user balances:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
