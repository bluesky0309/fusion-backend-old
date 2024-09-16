const mongoose = require("mongoose");

let Schema = mongoose.Schema;
const userSchema = new Schema({
  user_id: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  address: { type: String, default: "" },
  email: { type: String, default: "" },
  password: { type: String },
  phoneNumber: { type: String },
  email_verified: { type: Boolean, default: false },
  xp: { type: Number, default: 150 },
  avatar: { type: String },
  avatar: {
    type: String,
  },
  groups: [
    {
      groupId: {
        type: String,
        required: true,
        ref: "Group",
      },
    },
  ],
  communities: [
    {
      communityId: {
        type: String,
        required: true,
        ref: "Community",
      },
    },
  ],
  chats: [
    {
      chatId: {
        type: String,
        required: true,
        ref: "Chat",
      },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
