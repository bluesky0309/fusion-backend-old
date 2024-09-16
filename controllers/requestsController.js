const Request = require("../models/Request");
const User = require("../models/User");
const { startChatWithUser } = require("../utils/chats");

const sendRequest = async (req, res) => {
  const { user_id, groupId } = req.params;
  // Sender user
  const sender = req.user;
  try {
    const at = new Date();

    //Recipient
    const recipient = await User.findOne({ user_id });

    const req = await Request.findOne({
      requestId: `${sender.user_id}${user_id}`,
    });

    if (req) {
      return res.status(400).json({ error: "Request has been sent" });
    }
    // Create the request with correct ObjectId references
    await Request.create({
      sender: sender._id,
      group: groupId,
      recipient: recipient._id,
      senderId: sender.user_id,
      recipientId: recipient.user_id,
      requestId: `${sender.user_id}${recipient.user_id}`,
      at: at.toString(),
    });

    res.status(200).json({
      ok: true,
      sender,
      recipient,
      requestId: `${sender.user_id}${recipient.user_id}`,
      at: at.toString(),
      status: "pending",
    });
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({ error: "Error sending friend request" });
  }
};

// Accept request
const acceptRequest = async (req, res) => {
  const { requestId } = req.params;
  const { recipient, sender } = req.body;
  try {
    const request = await Request.findOneAndUpdate(
      { requestId },
      { status: "accepted" },
      { new: true }
    );
    const x = await startChatWithUser(requestId, recipient, sender);

    res.status(200).json({ request, ...x });
  } catch (error) {
    console.error("Error accepting request:", error);
    res.status(500).json({ error: "Error accepting request" });
  }
};

// Reject request
const rejectRequest = async (req, res) => {
  const { requestId, recipientId } = req.params;
  try {
    await Request.findByIdAndDelete({ requestId, recipientId });
    res.status(200).json({ message: "Request rejected" });
  } catch (error) {
    console.error("Error rejecting  request:", error);
    res.status(500).json({ error: "Error rejecting request" });
  }
};

const getRequestsReceived = async (req, res) => {
  const { recipientId } = req.params;

  try {
    const requests = await Request.find({ recipient: recipientId })
      .populate({
        path: "sender",
        select: "email username user_id avatar",
      })
      .populate("group", "name")
      .select(["status", "type", "createdAt"])
      .exec();


    if (!requests) res.status(404).json({ ok: false });

    res.status(200).json({ requests, ok: true });
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ error: "Error fetching requests" });
  }
};

const getRequestsSent = async (req, res) => {
  const { senderId } = req.params;
  try {
    const requests = await Request.find({ sender: senderId })
      .populate({
        path: "recipient",
        select: "email username user_id avatar",
      })
      .populate("group", "name")
      .select(["status", "type", "createdAt"])
      .exec();


    if (!requests) res.status(404).json({ ok: false });
    res.status(200).json({ requests, ok: true });
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ error: "Error fetching requests" });
  }
};

module.exports = {
  rejectRequest,
  acceptRequest,
  sendRequest,
  getRequestsSent,
  getRequestsReceived,
};
