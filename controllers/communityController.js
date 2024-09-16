const { Community, Message, Room, Channel } = require("../models/Community");
const CommunityMessage = require("../models/CommunityMessage");
const mongoose = require("mongoose");

const shortid = require("shortid"); // Import shortid for generating unique IDs
const User = require("../models/User");

const createCommunity = async (req, res) => {
  const { owner } = req.body;
  const invitationLink = shortid.generate(); // Generate a unique ID for the invitation link
  try {
    // Create the Community with name, description, and invitationLink
    const community = await Community.create(req.body);

    // Find the owner user and update their communities array
    const updatedUser = await User.findOneAndUpdate(
      { user_id: owner.user_id },
      {
        $push: { communities: { communityId: community._id } },
      },
      { new: true } // Return the updated user document after the update
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "Owner user not found" });
    }

    // Add the owner to the Community as the owner with the current timestamp
    community.members.set(owner._id, {
      member: owner._id,
      role: "owner",
      joinedAt: new Date(),
    });

    const channelData = {
      name: "genaral",
      description: "here is the genaral channel",
      communityId: community._id,
      type: "text",
    };

    const channel = await Channel.create(channelData);

    community.channels.push({
      channelId: channel._id,
    });

    await community.save();

    // Respond with the created Community
    res.status(201).json({ ...community._doc, ok: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
const createChannel = async (req, res) => {
  const { name, description, type } = req.body;
  const { communityId } = req.params;

  try {
    const channelData = {
      name,
      description,
      communityId: communityId,
      type,
    };
    const channel = await Channel.create(channelData);

    const updatedCommunity = await Community.findOneAndUpdate(
      { _id: communityId }, // Corrected: Use {_id: communityId} as the query object
      {
        $push: { channels: { channelId: channel._id } },
      },
      { new: true }
    );

    if (!updatedCommunity) {
      return res.status(404).json({ error: "Community not found" });
    }

    // Respond with the created Community
    res.status(201).json({ ...channel._doc, ok: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getCommunity = async (req, res) => {
  const { communityId } = req.params;
  try {
    const community = await Community.findById(communityId);
    res.status(200).json(community);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const sendMessage = async (req, res) => {
  const { communityId } = req.params;
  const { senderId, messageData } = req.body;
  try {
    const message = await CommunityMessage.create({
      ...messageData,
      communityId,
      senderId,
    });
    res.status(201).json(message);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};

const getCommunityIdByLink = async (req, res) => {
  const link = req.body.link;
  const communities = await Community.find({link: link});
  res.send(communities[0]._id)
}
const getCommunityInfoByLink = async (req, res) => {
  const link = req.body.link;
  const communities = await Community.find({link: link});
  res.send(communities[0])
}
const getUserCommunities = async (req, res) => {
  const { userId } = req.params;

  try {
    const communities = await Community.find({
      [`members.${userId}`]: { $exists: true, $ne: null },
    })
      .populate("channels.channelId")
      .populate("rooms.roomId")
      .populate(`members.${userId}.member`);

    if (!communities || communities.length === 0) {
      return res
        .status(204)
        .json({ message: "No communities found for this user." });
    }
    res.status(200).json(communities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const fetchNewCommunities = async (req, res) => {
  try {
    const communities = await Community.find()
      .sort({ createdAt: -1 })
      .limit(10);
    if (!communities || communities.length === 0) {
      return res
        .status(204)
        .json({ message: "No communities found for this user." });
    }
    res.status(200).json(communities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getCommunityMessages = async (req, res) => {
  const { communityId } = req.params;
  try {
    const messages = await CommunityMessage.find({ communityId }).populate(
      "senderId"
    );
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getChannelMessages = async (req, res) => {
  const { communityId, channelId } = req.params;
  console.log("req.params--------->", communityId,channelId)
  try {
    const messages = await CommunityMessage.find({
      communityId,
      channelId,
    }).populate("senderId");
    console.log("message---->", messages)
    res.status(200).json({ ok: true, messages });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err });
  }
};

// Controller to join a user to a community
const joinCommunity = async (req, res) => {
  const communityId = req.body.community_Id;
  const userId = req.body.user_Id;
  try {
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({ error: "community not found" });
    }

    // Check if the user is already a member of the community
    if (community.members.has(userId)) {
      return res
        .status(400)
        .json({ error: "User is already a member of the community" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      {
        $push: { communities: { communityId: communityId } },
      },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ error: "User   not found" });
    }

    // Add the user to the group
    community.members.set(userId, {
      member: userId,
      role: "member",
      joinedAt: new Date(),
    });
    await community.save();


    res.status(200).json({ ...community, ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Controller to update NFTS of a community
const updateNFTs = async (req, res) => {
  const { communityId } = req.params;
  const { nfts } = req.body;
  try {
    const community = await Community.findByIdAndUpdate(communityId, {
      nfts: nfts,
    });
    if (!community) {
      return res.status(404).json({ error: "community not found" });
    }
    res.status(200).json({ ...community, ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getChannels = async (req, res) => {
  const { communityId } = req.params;
  try {
    const channels = await Channel.find({ communityId: communityId });
    if (!channels) {
      return res.status(404).json({ error: "Channel not found" });
    }
    res.status(200).json(channels);
  } catch (error) {
    console.error("Error fetching Channel:", error);
    res.status(500).json({ error: "Error fetching Channel", error });
  }
};

const searchCommunity = async (req, res) => {
  const communities = await Community.find({
    name: { $regex: req.body.keyword, $options: "i" },
  });
  res.send(communities);
};

const verifyLink = async (req, res) => {
  const link = req.body.link;
  const communities = await Community.find({ link: link });
  if (communities.length === 0) {
    res.send("true")
  } else {
    res.send("false")
  }
};

const verifyUser = async (req, res) => {
  const link = req.body.link;
  const communities = await Community.find({ link: link });
  const member = communities[0]?.members.get(req.body.user_id) ; null;
  if (!member){
    res.send("false")
  } else {
    res.send("true")
  }
};

module.exports = {
  createCommunity,
  sendMessage,
  getCommunityMessages,
  joinCommunity,
  getCommunity,
  getChannels,
  getUserCommunities,
  createChannel,
  getChannelMessages,
  updateNFTs,
  fetchNewCommunities,
  searchCommunity,
  verifyLink,
  verifyUser,
  getCommunityIdByLink,
  getCommunityInfoByLink
};
