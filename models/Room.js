const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
  name: String,
  description: String,
  channelId: { type: String, ref: "Channel" },
  messages: [{ type: String, ref: "Message" }],
});

module.exports = mongoose.model("Room", RoomSchema);
