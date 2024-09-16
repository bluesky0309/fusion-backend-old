const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const communitieschema = new Schema({
  name: { type: String, required: true },
  link: { type: String },
  avatar: { type: String },
  description: { type: String },

  nfts: {
    type: [String],
    default: [],
  },
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
  channels: [
    {
      channelId: {
        type: String,
        required: true,
        ref: "Channel",
      },
    },
  ],
  rooms: [
    {
      roomId: {
        type: String,
        required: true,
        ref: "Room",
      },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const ChannelSchema = new mongoose.Schema({
  name: String,
  description: String,
  communityId: { type: String, ref: "Community" },
  type: { type: String },
});

const RoomSchema = new mongoose.Schema({
  name: String,
  description: String,
  channelId: { type: String, ref: "Channel" },
});

const Community = mongoose.model("Community", communitieschema);
const Room = mongoose.model("Room", RoomSchema);

module.exports = {
  Community,
  Channel: mongoose.model("Channel", ChannelSchema),
  Room,
};
