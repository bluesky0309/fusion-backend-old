const mongoose = require("mongoose");

const friendRequestSchema = new mongoose.Schema({
  sender: { type: String, ref: "User" },
  recipient: { type: String, ref: "User" },
  senderId: { type: String, unique: false }, // Not unique by itself
  recipientId: { type: String, unique: false }, // Not unique by itself
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  requestId: { type: String, unique: true }, // Unique requestId
  at: { type: String },
});

// Compound unique index for senderId and recipientId combination
friendRequestSchema.index({ senderId: 1, recipientId: 1 }, { unique: true });

module.exports = mongoose.model("FriendRequest", friendRequestSchema);
