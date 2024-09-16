const FriendRequest = require("../models/FriendRequest");
const User = require("../models/User");
const { startChatWithUser } = require("../utils/chats");

const sendFriendRequest = async (req, res) => {
  const { senderId, username } = req.params;
  const query = {};
  try {
    const at = new Date();
    // Find the sender user by user_id
    const sender = await User.findOne({ user_id: senderId });

    if (!sender) {
      return res.status(404).json({ error: "Sender not found" });
    }

    query["$or"] = [
      { username: { $regex: new RegExp(username, "i") } },
      { email: { $regex: new RegExp(username, "i") } },
    ];

    // Find the recipient user by username
    const recipient = await User.findOne(query).select([
      "username",
      "email",
      "avatar",
      "user_id",
    ]);

    if (!recipient) {
      return res.status(404).json({ error: "Recipient not found" });
    }

    const friendReq = await FriendRequest.findOne({
      requestId: `${senderId}${recipient.user_id}`,
    });

    if (friendReq) {
      return res.status(400).json({ error: "Request has been sent" });
    }


    // Create the friend request with correct ObjectId references

    res.status(200).json({
      ok: true,
      sender,
      recipient,
      requestId: `${senderId}${recipient.user_id}`,
      at: at.toString(),
      status: "pending",
    });
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({ error: "Error sending friend request" });
  }
};

// Accept friend request
const acceptFriendRequest = async (req, res) => {
  const { requestId } = req.params;
  const { recipient, sender } = req.body;
  try {
    const friendRequest = await FriendRequest.findOneAndUpdate(
      { requestId },
      { status: "accepted" },
      { new: true }
    );
    const x = await startChatWithUser(requestId, recipient, sender);

    res.status(200).json({ friendRequest, ...x });
  } catch (error) {
    console.error("Error accepting friend request:", error);
    res.status(500).json({ error: "Error accepting friend request" });
  }
};

// Reject friend request
const rejectFriendRequest = async (req, res) => {
  const { requestId, recipientId } = req.params;
  try {
    await FriendRequest.findByIdAndDelete({ requestId, recipientId });
    res.status(200).json({ message: "Friend request rejected" });
  } catch (error) {
    console.error("Error rejecting friend request:", error);
    res.status(500).json({ error: "Error rejecting friend request" });
  }
};

const getFriendRequestsReceived = async (req, res) => {
  const { recipientId } = req.params;

  try {
    const requests = await FriendRequest.find({ recipient: recipientId })
      .populate("sender")
      .exec();


    if (!requests) res.status(404).json({ ok: false });

    res.status(200).json({ requests, ok: true });
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    res.status(500).json({ error: "Error fetching friend requests" });
  }
};

const getFriendRequestsSent = async (req, res) => {
  const { senderId } = req.params;
  try {
    const requests = await FriendRequest.find({ sender: senderId })
      .populate("recipient")
      .exec();


    if (!requests) res.status(404).json({ ok: false });
    res.status(200).json({ requests, ok: true });
  } catch (error) {
    console.error("Error fetching friend requests:", error);
    res.status(500).json({ error: "Error fetching friend requests" });
  }
};

module.exports = {
  rejectFriendRequest,
  acceptFriendRequest,
  sendFriendRequest,
  getFriendRequestsSent,
  getFriendRequestsReceived,
};
