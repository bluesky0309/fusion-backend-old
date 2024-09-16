// model: Request for friend and invitation of group

const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    sender: { type: String, ref: "User" },
    recipient: { type: String, ref: "User" },
    senderId: { type: String, unique: false }, // Not unique by itself
    recipientId: { type: String, unique: false }, // Not unique by itself
    group: { type: String, ref: "Group" },
    type: {
      type: String,
      enum: ["group", "friend"],
      default: "group",
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    requestId: { type: String, unique: true }, // Unique requestId
    at: { type: String },
  },
  { timestamps: true }
);

// Compound unique index for senderId and recipientId combination
requestSchema.index({ senderId: 1, recipientId: 1 }, { unique: true });

module.exports = mongoose.model("Request", requestSchema);
