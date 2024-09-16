const { Router } = require("express");

const router = Router();

// Import controllers for handling different routes
const {
  rejectFriendRequest,
  acceptFriendRequest,
  sendFriendRequest,
  getFriendRequestsSent,
  getFriendRequestsReceived,
} = require("../controllers/friendRequestsController");

router.post("/:senderId/:username", (req, res) => {
  sendFriendRequest(req, res);
});

// Endpoint to accept a friend request
router.put("/:requestId/accept", acceptFriendRequest);

// Endpoint to reject a friend request
router.delete("/:requestId/:recipientId/reject", rejectFriendRequest);

//get
router.get("/received/:recipientId/user", getFriendRequestsReceived);
router.get("/sent/:senderId/user", getFriendRequestsSent);

module.exports = router;
