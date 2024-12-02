// controllers/groupController.js
const Group = require('../models/Group');
const Approval = require('../models/Approval');
const User = require('../models/User');

exports.createGroup = async (req, res) => {
  const { groupName, description, groupImage, groupType, members } = req.body;

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
    res.status(500).json({ error: 'Failed to create group', details: err.message });
  }
};

exports.getUserGroups = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user.id }).populate('members', 'username');
    res.status(200).json({ groups });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch groups', details: err.message });
  }
};

 
