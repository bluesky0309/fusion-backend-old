// models/Message.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  groupId: { type: String, ref: "Group", required: true }, // Reference to group
  senderId: { type: String, ref: "User", required: true }, // Reference to sender
  link: {
    type: String,
  },
  content: {
    type: String,
    default: "",
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
  createdAt: { type: Date, default: Date.now },
  role: {
    type: String,
    enum: ["admin", "member", "owner"],
    default: "member",
  },
});

module.exports = mongoose.model("Message", messageSchema);
