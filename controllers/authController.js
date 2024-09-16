const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { handleEmailSender } = require("../emails/utils/transporter");
const { v4 } = require("uuid");
const { generateOtp } = require("../utils/auth");
const { createUserChatContainer } = require("../utils/chats");

// Register route
const register = async (req, res) => {
  try {
    const { email, phoneNumber, password, username } = req.body;
    const user_id = v4();
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      username: username,
      email: email,
      password: hashedPassword,
      user_id,
      phoneNumber,
    };
    // Create new user
    const newUser = new User(user);

    await newUser.save();
    const token = jwt.sign({ user }, process.env.JWT_SECRET);
    await createUserChatContainer(user_id, newUser._doc._id);

    res
      .status(201)
      .json({ token, ...user, message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// Register route
const RegisterWithaddress = async (req, res) => {
  try {
    const { address, username, avatar } = req.body;
    const user_id = v4();
    // Check if user already exists
    const existingUser = await User.findOne({ address });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = {
      username: username,
      address: address,
      avatar: avatar,
      user_id,
    };
    // Create new user
    const newUser = new User(user);

    await newUser.save();
    await createUserChatContainer(user_id, newUser._doc._id);

    res.status(201).json({ ...user, ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};

// Signin route
const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if user exists
    const user = await User.findOne({ email }).select([
      "user_id",
      "username",
      "email",
      "address",
    ]);
    if (!user) {
      return res.status(400).json({ message: "can not find user" });
    }

    // Check password
    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ user }, process.env.JWT_SECRET);

    res.json({ token, ...user });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const logout = () => {};

const validate = () => {
  //
};

const otps = {};

const sendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser)
      return res.status(404).json({ message: "User Not found" });

    const otp = generateOtp(); // Assume you have a function to generate OTP
    const html = `
      <html>
        <head>
          <title>OTP Email</title>
          <style>
            body {
              font-family: Arial, sans-serif;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 5px;
            }
            h2 {
              color: #333;
            }
            p {
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Your OTP for verification</h2>
            <p>Your OTP is: ${otp}</p>
            <p>Use this OTP to verify your account.</p>
          </div>
        </body>
      </html>
    `;

    otps[email] = { otp, email_verified: false };
    const info = await handleEmailSender({
      receiver: email,
      html,
      subject: "Your OTP for verification",
    });

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email: ", error.message);
    res.status(500).json({ error: "Error sending OTP email" });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Find the user by email in the database
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User Not found" });

    // Check if the user exists and if the OTP matches
    if (otps[email]?.otp == otp) {
      // Update the user's email_verified status to true
      otps[email].email_verified = true;
      user.email_verified = true;
      await user.save(); // Save the updated user document

      res.status(200).json({ ok: true, message: "OTP verified successfully" });
    } else {
      res.status(400).json({ error: "Invalid OTP or email already verified" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ error: "Error verifying OTP" });
  }
};

module.exports = {
  signin,
  verifyOtp,
  sendOtp,
  register,
  logout,
  validate,
  RegisterWithaddress,
};
