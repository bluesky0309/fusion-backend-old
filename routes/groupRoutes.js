const express = require("express");
const router = express.Router();
const {
  createGroup,
  sendMessage,
  getGroupMessages,
  getGroup,
  joinGroup
} = require("../controllers/groupController");


// Routes
router.post("/", createGroup);
router.get("/:groupId/group", getGroup);
router.post("/:groupId/messages", sendMessage);
router.get("/:groupId/messages", getGroupMessages);
router.put("/:groupId/join/:userId", joinGroup);

module.exports = router;
