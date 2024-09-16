const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupSchema = new Schema({
  name: { type: String, required: true },
  invitationLink: { type: String },
  description: { type: String },
  avatar: { type: String },
  members: {
    type: Map,
    of: {
      member: { type: String, ref: "User" },
      role: {
        type: String,
        enum: ["admin", "member", "owner"],
        default: "member",
      },
      joinedAt: { type: Date, default: Date.now },
    },
    default: new Map(),
  },
  createdAt: { type: Date, default: Date.now },
});

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

module.exports = {
  Message: mongoose.model("Message", messageSchema),
  Group: mongoose.model("Group", groupSchema),
};
