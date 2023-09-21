const Chat = require("../models/chatModel");
const User = require("../models/userModel");

//chatTitle,groupChat,members,lastMessage,admin

// const createRetainChat = async (req, res) => {
//   const { userId } = req.body;
//   if (!userId) {
//     return res.status(400).json({ error: "userId not provided" });
//   }
//   try {
//     const existingChat = await Chat.findOne({
//       groupChat: false,
//       members: {
//         $all: [req.user._id, userId],
//       },
//     })
//       .populate("members", "-password")
//       .populate("lastMessage");
//     if (existingChat) {
//       return res.status(200).json(existingChat);
//     } else {
//       const chatData = {
//         chatTitle: "sender",
//         groupChat: false,
//         members: [userId, req.user._id],
//         lastMessage: null,
//       };
//       let createdChat = await Chat.create(chatData);
//       createdChat = await Chat.findOne({ _id: createdChat._id })
//         .populate("members", "-password")
//         .populate("lastMessage");
//       // createdChat = await User.populate({
//       //   path: "lastMessage",
//       //   select: "email name pic",
//       // });
//       return res.status(201).json(createdChat);
//     }
//   } catch (e) {
//     console.log(e);
//     return res.status(501).json({ error: e });
//   }
// };

const createRetainChat = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: "userId not provided" });
  }
  try {
    const existingChat = await Chat.findOne({
      groupChat: false,
      members: {
        $all: [req.user._id, userId],
      },
    })
      .populate({ path: "members", select: "name", model: "User" })
      .populate({ path: "lastMessage", select: "message", model: "Message" });
    // .populate("members", "-password");
    if (existingChat) {
      return res.status(200).json(existingChat);
    } else {
      const chatData = {
        groupChat: false,
        members: [userId, req.user._id],
        lastMessage: null,
      };
      const createdChat = await Chat.create(chatData);
      const newChat = await Chat.findOne({ _id: createdChat._id });
      // .populate(
      //   "members",
      //   "-password"
      // );
      return res.status(201).json(newChat);
    }
  } catch (e) {
    return res.status(501).json({ error: e });
  }
};

const getAllChats = async (req, res) => {
  try {
    console.log("userId:", req.user._id);
    const allChats = await Chat.find({
      members: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("members", "-password")
      .populate({ path: "lastMessage", select: "message", model: "Message" });
    console.log(allChats);
    return res.status(200).json(allChats);
  } catch (e) {
    return res.status(500).json({ error: e });
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
      chatTitle: chatTitle,
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
    return res.status(500).json({ error: e.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const response = await User.find({ _id: { $ne: req.user._id } });
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "An error occurred" });
  }
};

const addUserToGroup = async (req, res) => {
  const { groupId, addUserId } = req.body;

  if (!groupId || !addUserId) {
    return res.status(400).json({ error: "parameters not provided" });
  }
  try {
    let chat = await Chat.findByIdAndUpdate(
      groupId,
      { $push: { members: addUserId } },
      { new: true }
    ).populate("members", "-password");
    return res.status(201).json(chat);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "an erroooor occured" });
  }
};

const removeUserFromGroup = async (req, res) => {
  const { groupId, removeUserId } = req.body;

  if (!groupId || !removeUserId) {
    return res.status(400).json({ error: "parameters not provided" });
  }
  try {
    let chat = await Chat.findByIdAndUpdate(
      groupId,
      { $pull: { members: removeUserId } },
      { new: true }
    ).populate("members", "-password");
    res.status(201).json(chat);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: "an erroooor occured" });
  }
};

const getLoggedUserId = async (req, res) => {
  try {
    const loggedUserId = req.user._id;
    return res.status(201).json(loggedUserId);
  } catch (e) {
    return res.status(500).json({ error: e });
  }
};

module.exports = {
  createRetainChat,
  getAllChats,
  createGroupChat,
  getAllUsers,
  addUserToGroup,
  removeUserFromGroup,
  getLoggedUserId,
};
