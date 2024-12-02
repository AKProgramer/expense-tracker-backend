// controllers/approvalController.js
const Approval = require('../models/Approval');
const Group = require('../models/Group');

exports.getApprovals = async (req, res) => {
  try {
    const approvals = await Approval.find({ toUser: req.user.id }).populate('group fromUser');
    res.status(200).json({ approvals });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch approvals', details: err.message });
  }
};

exports.respondToApproval = async (req, res) => {
  const { approvalId } = req.params;
  const { status } = req.body; // 'accepted' or 'rejected'
  try {
    const approval = await Approval.findById(approvalId);
    if (!approval) return res.status(404).json({ message: 'Approval not found' });

    if (status === 'accepted') {
      const group = await Group.findById(approval.group);
      group.members.push(approval.toUser);
      await group.save();
    }
    approval.status = status;
    await approval.save();

    res.status(200).json({ message: `Approval ${status} successfully` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to respond to approval', details: err.message });
  }
};
