const { Router } = require("express");

const router = Router();

const deserializeUser = require("../middleware/deserializeUser");
const requireUser = require("../middleware/requireUser");

// Import controllers for handling different routes
const {
  rejectRequest,
  acceptRequest,
  sendRequest,
  getRequestsSent,
  getRequestsReceived,
} = require("../controllers/requestsController");

// Require Auth
router.use(deserializeUser, requireUser);

router.post("/:user_id/:groupId", (req, res) => {
  sendRequest(req, res);
});

// Endpoint to accept a request
router.put("/:requestId/accept", acceptRequest);

// Endpoint to reject a request
router.delete("/:requestId/:recipientId/reject", rejectRequest);

//get
router.get("/received/:recipientId/user", getRequestsReceived);
router.get("/sent/:senderId/user", getRequestsSent);

module.exports = router;
