const { Router } = require("express");

const router = Router();

// Import controllers for handling different routes
const {
  register,
  signin,
  logout,
  sendOtp,
  verifyOtp,
  RegisterWithaddress,
} = require("../controllers/authController");

// User authentication routes
router.post("/register", register);
router.post("/signin", signin);
router.post("/logout", logout);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/register-with-address", RegisterWithaddress);



module.exports = router;
