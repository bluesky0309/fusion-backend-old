// models/dmMessage.js
const mongoose = require("mongoose");

const dmMessageSchema = new mongoose.Schema({
  sender: { type: String, ref: "User" },
  dm_messages_id: String,
  type: {
    type: String,
    required: true,
    enum: ["context", "image", "voice"],
  },
  sender_id: {
    type: String,
    required: true,
  },
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
  message: {
    type: String,
  },
  emoji: {
    type: [String],
    default: [],
  },
  readStatus: {
    type: Boolean,
    default: false,
  },
  when: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("DmMessage", dmMessageSchema);
