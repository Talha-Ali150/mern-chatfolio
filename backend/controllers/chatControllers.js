const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const createRetainChat = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    res.status(400).json({ error: "userId not provided" });
    return;
  }
  try {
    const existingChat = await Chat.findOne({
      groupChat: false,
      members: {
        $all: [req.user._id, userId],
      },
    });
    if (existingChat) {
      res.status(200).json(existingChat);
    } else {
      const chatData = {
        groupChat: false,
        members: [userId, req.user._id],
      };
      const createdChat = await Chat.create(chatData);
      const newChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "members",
        "-password"
      );
      res.status(201).json(newChat);
    }
  } catch (e) {
    res.status(501).json({ error: e });
    console.log(e);
  }
};

const getAllChats = async (req, res) => {
  try {
    console.log("userId:", req.user._id);
    const allChats = await Chat.find({
      members: { $elemMatch: { $eq: req.user._id } },
    }).populate("members", "-password");
    res.status(200).json(allChats);
    console.log("chats found", allChats);
  } catch (e) {
    res.status(500).json({ error: e });
  }
};
const createGroupChat = async (req, res) => {
  const { chatTitle, members } = req.body;

  if (!chatTitle || !members) {
    return res.status(400).json({ error: "Invalid request data" });
  }

  // Sort the members array to ensure consistency in checking for duplicates
  const sortedMembers = JSON.parse(members).sort();

  if (sortedMembers.length < 2) {
    return res
      .status(400)
      .json({ error: "more than 2 users required to create group" });
  }
  if (chatTitle.trim() === "") {
    return res.status(400).json({ error: "Chat title cannot be empty" });
  }

  try {
    const existingChat = await Chat.findOne({
      groupChat: true,
      members: sortedMembers,
    }).populate("members", "-password");

    if (existingChat) {
      return res.status(200).json(existingChat);
    }
    sortedMembers.push(req.user._id);
    const groupChat = await Chat.create({
      chatTitle,
      groupChat: true,
      isAdmin: req.user._id,
      members: sortedMembers,
    });

    const fullChat = await Chat.findOne({ _id: groupChat._id }).populate(
      "members",
      "-password"
    );

    res.status(201).json(fullChat);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const response = await User.find({ _id: { $ne: req.user._id } });
    res.status(200).json(response);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "An error occurred" });
  }
};

module.exports = {
  createRetainChat,
  getAllChats,
  createGroupChat,
  getAllUsers,
};
