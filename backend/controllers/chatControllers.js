const mongoose = require("mongoose");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const { emitChatUpsert, userRoom } = require("../utils/realtime");

const isId = (value) => mongoose.isValidObjectId(value);
const chatPopulation = [
  { path: "members", select: "name email pic" },
  { path: "lastMessage", select: "message sender createdAt" },
];

const createRetainChat = async (req, res) => {
  const { userId } = req.body;
  if (!isId(userId) || userId === String(req.user._id)) {
    return res.status(400).json({ error: "A valid other user is required" });
  }
  try {
    if (!(await User.exists({ _id: userId }))) {
      return res.status(404).json({ error: "User not found" });
    }
    let chat = await Chat.findOne({
      groupChat: false,
      members: { $all: [req.user._id, userId], $size: 2 },
    }).populate(chatPopulation);
    let status = 200;
    if (!chat) {
      chat = await Chat.create({ members: [req.user._id, userId] });
      chat = await Chat.findById(chat._id).populate(chatPopulation);
      emitChatUpsert(req.app.get("io"), chat);
      status = 201;
    }
    return res.status(status).json(chat);
  } catch (error) {
    return res.status(500).json({ error: "Unable to create chat" });
  }
};

const getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find({ members: req.user._id })
      .populate(chatPopulation)
      .sort({ updatedAt: -1 });
    return res.json(chats);
  } catch (error) {
    return res.status(500).json({ error: "Unable to fetch chats" });
  }
};

const createGroupChat = async (req, res) => {
  const { chatTitle } = req.body;
  let { members } = req.body;
  if (typeof members === "string") {
    try { members = JSON.parse(members); } catch { return res.status(400).json({ error: "Members must be an array of user IDs" }); }
  }
  if (!chatTitle || !chatTitle.trim() || !Array.isArray(members)) {
    return res.status(400).json({ error: "A group title and member list are required" });
  }
  const memberIds = [...new Set(members.map(String))].filter((id) => id !== String(req.user._id));
  if (memberIds.length < 2 || memberIds.some((id) => !isId(id))) {
    return res.status(400).json({ error: "Select at least two valid users" });
  }
  try {
    const users = await User.find({ _id: { $in: memberIds } }).select("_id");
    if (users.length !== memberIds.length) return res.status(400).json({ error: "One or more users do not exist" });
    const allMembers = [...memberIds, String(req.user._id)];
    const existing = await Chat.findOne({
      groupChat: true,
      members: { $all: allMembers, $size: allMembers.length },
    }).populate(chatPopulation);
    if (existing) return res.json(existing);
    const chat = await Chat.create({
      chatTitle: chatTitle.trim(), groupChat: true, admin: req.user._id, members: allMembers,
    });
    const populatedChat = await Chat.findById(chat._id).populate(chatPopulation);
    emitChatUpsert(req.app.get("io"), populatedChat);
    return res.status(201).json(populatedChat);
  } catch (error) {
    return res.status(500).json({ error: "Unable to create group" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select("name email pic");
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: "Unable to fetch users" });
  }
};

const updateGroupMember = (operation) => async (req, res) => {
  const { groupId } = req.body;
  const targetId = req.body[operation === "add" ? "addUserId" : "removeUserId"];
  if (!isId(groupId) || !isId(targetId)) return res.status(400).json({ error: "Valid group and user IDs are required" });
  try {
    const group = await Chat.findOne({ _id: groupId, groupChat: true });
    if (!group) return res.status(404).json({ error: "Group not found" });
    if (String(group.admin) !== String(req.user._id)) return res.status(403).json({ error: "Only the group admin can change membership" });
    if (!(await User.exists({ _id: targetId }))) return res.status(404).json({ error: "User not found" });
    const isMember = group.members.some((id) => String(id) === targetId);
    if (operation === "add" && !isMember) group.members.push(targetId);
    if (operation === "remove") {
      if (String(group.admin) === targetId) return res.status(400).json({ error: "The group admin cannot be removed" });
      if (!isMember) return res.status(400).json({ error: "User is not a group member" });
      group.members.pull(targetId);
    }
    await group.save();
    const populatedChat = await Chat.findById(group._id).populate(chatPopulation);
    const io = req.app.get("io");
    emitChatUpsert(io, populatedChat);
    if (operation === "remove") {
      io?.in(userRoom(targetId)).socketsLeave(String(group._id));
      io?.to(userRoom(targetId)).emit("chat:remove", { chatId: String(group._id) });
    }
    return res.json(populatedChat);
  } catch (error) {
    return res.status(500).json({ error: "Unable to update group membership" });
  }
};

const addUserToGroup = updateGroupMember("add");
const removeUserFromGroup = updateGroupMember("remove");

module.exports = { createRetainChat, getAllChats, createGroupChat, getAllUsers, addUserToGroup, removeUserFromGroup };
