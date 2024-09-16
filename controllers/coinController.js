const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { v4 } = require("uuid");
const { createUserChatContainer } = require("../utils/chats");
const { createToken } = require("../program/web3");

// Register route
const create = async (req, res) => {
  try {
    console.log("coin info------>", req.body)
    
    // Create Token with UMI
    const token = await createToken({
      coinName: req.body.coinName,
      ticker: req.body.ticker,
      url: req.body.url,
      creator: req.body.creator,
      description: req.body.description,
    });
    console.log("token---->", token)
    if (token == "transaction failed") { res.status(400).json("fialed") }
    res.status(200).send(token)

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error", error });
  }
};
module.exports = {
  create,
};
