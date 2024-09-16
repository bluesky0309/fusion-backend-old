const { Group, Message } = require("../models/Group");
const shortid = require("shortid"); // Import shortid for generating unique IDs
const User = require("../models/User");

const createGroup = async (req, res) => {
  const { owner } = req.body;
  const invitationLink = shortid.generate();
  try {
    // Create the group with name, description, and invitationLink
    const group = await Group.create({ ...req.body, invitationLink });

    // Find the owner user and update their groups array
    const updatedUser = await User.findOneAndUpdate(
      { user_id: owner.user_id },
      {
        $push: { groups: { groupId: group._id } },
      },
      { new: true } // Return the updated user document after the update
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "Owner user not found" });
    }

    // Add the owner to the group as the owner with the current timestamp
    group.members.set(owner._id, {
      member: owner._id,
      role: "owner",
      joinedAt: new Date(),
    });
    await group.save();

    // Respond with the created group
    res.status(201).json({ ...group._doc, ok: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Controller to get messages for a specific group
const getGroup = async (req, res) => {
  const { groupId } = req.params;
  try {
    const group = await Group.findById(groupId);
    res.status(200).json(group);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Controller to send a message to a group
const sendMessage = async (req, res) => {
  const { groupId } = req.params;
  const data = req.body;
  try {
    const message = await Message.create({ ...data, groupId });
    res.status(201).json(message);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Controller to get messages for a specific group
const getGroupMessages = async (req, res) => {
  const { groupId } = req.params;
  try {
    const messages = await Message.find({ groupId }).populate("senderId");
    res.status(200).json(messages);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Controller to join a user to a group
const joinGroup = async (req, res) => {
  const { groupId, userId } = req.params;
  // const { user } = req.body;
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Check if the user is already a member of the group
    if (group.members.has(userId)) {
      return res
        .status(400)
        .json({ error: "User is already a member of the group" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        $push: { groups: { groupId: group._id } },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User   not found" });
    }

    // Add the user to the group
    group.members.set(userId, {
      member: userId,
      role: "member",
      joinedAt: new Date(),
    });
    await group.save();

    res.status(200).json({ groupId: groupId, userId: userId, ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createGroup,
  sendMessage,
  getGroupMessages,
  joinGroup,
  getGroup,
};
