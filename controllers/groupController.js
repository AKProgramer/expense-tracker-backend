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
  const { groupId, userId } = req.params;

  try {
    // Fetch the group and its expenses
    const group = await Group.findById(groupId).populate('expenses');
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    const groupName = group.groupName;
    const balances = [];
    let totalOwed = 0; // Variable to track the total amount the user owes

    // Iterate over each expense in the group
    for (const expenseId of group.expenses) {
      const expense = await Expense.findById(expenseId)
        .populate('splitDetails.user', 'username')
        .populate('createdBy', 'username');

      // Check "to give" for the current user
      expense.splitDetails.forEach((split) => {
        if (split.user._id.toString() === userId) {
          const balance = {
            expenseName: expense.expenseName,
            action: 'give',
            toUser: expense.createdBy.username,
            amount: split.amount,
            expenseId: expense._id, // Include the expenseId
            balanceId: split._id, // Include the balanceId (from the split entry)
          };
          balances.push(balance);
          totalOwed += split.amount; // Add to the total owed amount
        }
      });

      // Check "to take" for the current user
      if (expense.createdBy._id.toString() === userId) {
        expense.splitDetails.forEach((split) => {
          if (split.user._id.toString() !== userId) {
            const balance = {
              expenseName: expense.expenseName,
              action: 'take',
              fromUser: split.user.username,
              amount: split.amount,
              expenseId: expense._id, 
              balanceId: split._id,  
            };
            balances.push(balance);
          }
        });
      }
    }

    // Send response with user balances, total owed, and relevant IDs
    return res.status(200).json({ groupName, groupId, totalOwed, balances });
  } catch (error) {
    console.error('Error fetching user balances:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


