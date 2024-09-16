const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
  createUserChatContainer,
  startChatWithUser,
} = require("../utils/chats");

const getUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify and decode JWT to get email
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { user_id } = decoded.user;

    const user = await User.findOne({ user_id }).populate("groups.groupId");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error verifying JWT:", error);
    res.status(500).json({ error: "Error verifying JWT" });
  }
};

const updateUserDetails = async (req, res) => {
  const userDetails = req.body;
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    // Verify and decode JWT to get email
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { user_id } = decoded.user;

    const user = await User.findOneAndUpdate(
      { user_id },
      { $set: userDetails },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Error Can't Update User Details:", error);
    res.status(500).json({ error: "Error Can't Update User Details" });
  }
};

const getUserByAddress = async (req, res) => {
  const { address } = req.params;
  try {
    const user = await User.findOne({ address }).populate("groups.groupId");
    if (!user) {
      return res.status(204).json({ message: "User not found" });
    }
    // Generate JWT token
    const token = jwt.sign(
      {
        user: {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          address: user.address,
        },
      },
      process.env.JWT_SECRET
    );

    res.status(200).json({ user: user, token: token });
  } catch (error) {
    console.error("Error verifying JWT:", error);
    res.status(500).json({ error: "Error verifying JWT" });
  }
};

const fetchUsers = async (req, res) => {
  const { search } = req.query;
  const query = {};

  try {
    query["$or"] = [
      { username: { $regex: new RegExp(search, "i") } },
      { email: { $regex: new RegExp(search, "i") } },
    ];
    const users = await User.find(query).select([
      "username",
      "email",
      "avatar",
      "user_id",
    ]);

    if (!users) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("Error verifying JWT:", error);
    res.status(500).json({ error: "Error verifying JWT" });
  }
};

const uploadprofileAvater = async (req, res) => {
  const id = req.body.userId
  const user = await User.findOne({_id: id});
  if(!user) {
    return res.status(404).json({ error: "User not found" });
  }
  user.avatar = req.body.image;
  await user.save();  
  res.status(200).json(user)
};

const getUserById = async ({ user_id }) => {
  try {
    const user = await User.findOne({ user_id });
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Error fetching user");
  }
};

const getUserByUserName = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Error fetching user" });
  }
};

const getUsers = async () => {
  try {
    await createUserChatContainer("32d3791a-a77c-4845-bd08-e8aaae5477d3");
    const users = await User.find();
    return users;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Error fetching user");
  }
};

const testUser = async (req, res) => {
  const { otherUser_uid, user_uid } = req.body;
  try {
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Error fetching user" });
  }
};

module.exports = {
  uploadprofileAvater,
  getUser,
  getUserById,
  getUsers,
  testUser,
  getUserByUserName,
  getUserByAddress,
  updateUserDetails,
  fetchUsers,
};
