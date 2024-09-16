const { Router } = require("express");

const router = Router();

// Import controllers for handling different routes
const {
  getUser,
  uploadprofileAvater,
  getUserByUserName,
  getUsers,
  testUser,
  getUserByAddress,
  updateUserDetails,
  fetchUsers,
} = require("../controllers/userController");

// User authentication routes
router.get("/by_address/:address", getUserByAddress);

router.get("/", getUser);
router.patch("/update-details", updateUserDetails);
router.get("/fetch-users", fetchUsers);
router.get("/users", getUsers);
router.post("/uploadprofileAvater", uploadprofileAvater);
router.get("/test/x", testUser);
router.get("/:username", getUserByUserName);

module.exports = router;
