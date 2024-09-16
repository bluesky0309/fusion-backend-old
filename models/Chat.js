const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatMessageSchema = new Schema({
  last_message: {
    type: String,
    required: true,
  },
  otherUser_id: {
    type: String,
    required: true,
  },
  otherUser: {
    type: String,
    ref: "User",
  },
  at: {
    type: String,
    required: true,
  },
  unread_message: {
    type: String,
    default: "0",
  },
  mute: {
    type: String,
    default: false,
  },
  requestId: {
    type: String,
  },
  dm_messages_id: { type: String, required: true },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const chatSchema = new Schema({
  user_id: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    ref: "User",
  },
  messages: [chatMessageSchema],
});

module.exports = mongoose.model("Chat", chatSchema);
