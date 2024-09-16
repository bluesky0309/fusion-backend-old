const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommunityMessage = new Schema({
  senderId: { type: String, required: true, ref: "User" },
  link: {
    type: String,
  },
  content: {
    type: String,
  },
  fileName: {
    type: String,
  },
  size: {
    type: String,
  },
  type: {
    type: String,
    required: true,
  },
  message: {
    type: String,
  },
  emoji: {
    type: [String],
    default: [],
  },
  channelId: { type: String },
  roomId: { type: String },
  communityId: { type: String },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CommunityMessage", CommunityMessage);
