const mongoose = require("mongoose");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const { emitChatUpsert, emitToUsers } = require("../utils/realtime");

const emitReceipt = (io, message) => {
  emitToUsers(io, [message.sender], "message:receipt", {
    messageId: String(message._id),
    chatId: String(message.chat),
    deliveredTo: (message.deliveredTo || []).map(String),
    readBy: (message.readBy || []).map(String),
  });
};

const sendMessage = async (req, res) => {
  const { message, chat: chatId } = req.body;
  const content = typeof message === "string" ? message.trim() : "";
  if (!content || content.length > 5000 || !mongoose.isValidObjectId(chatId)) {
    return res.status(400).json({ error: "A valid chat and message (up to 5000 characters) are required" });
  }
  try {
    const chat = await Chat.findOne({ _id: chatId, members: req.user._id });
    if (!chat) return res.status(404).json({ error: "Chat not found" });
    const created = await Message.create({ sender: req.user._id, message: content, chat: chat._id });
    const populated = await Message.findById(created._id)
      .populate("sender", "_id name email pic");
    chat.lastMessage = created._id;
    await chat.save();
    const io = req.app.get("io");
    const updatedChat = await Chat.findById(chat._id)
      .populate("members", "name email pic")
      .populate({ path: "lastMessage", select: "message sender createdAt deliveredTo readBy" });
    emitChatUpsert(io, updatedChat);
    emitToUsers(io, chat.members, "message:new", populated);
    return res.status(201).json(populated);
  } catch (error) {
    return res.status(500).json({ error: "Unable to send message" });
  }
};

const fetchChatMessages = async (req, res) => {
  const { chatId } = req.params;
  if (!mongoose.isValidObjectId(chatId)) return res.status(400).json({ error: "Invalid chat ID" });
  try {
    const chat = await Chat.exists({ _id: chatId, members: req.user._id });
    if (!chat) return res.status(404).json({ error: "Chat not found" });
    const undelivered = await Message.find({
      chat: chatId,
      sender: { $ne: req.user._id },
      deliveredTo: { $ne: req.user._id },
    }).select("_id");
    if (undelivered.length) {
      const messageIds = undelivered.map((message) => message._id);
      await Message.updateMany({ _id: { $in: messageIds } }, { $addToSet: { deliveredTo: req.user._id } });
      const receipts = await Message.find({ _id: { $in: messageIds } }).select("_id chat sender deliveredTo readBy");
      for (const receipt of receipts) emitReceipt(req.app.get("io"), receipt);
    }
    const messages = await Message.find({ chat: chatId })
      .populate("sender", "_id email name pic")
      .sort({ createdAt: 1 });
    return res.json(messages);
  } catch (error) {
    return res.status(500).json({ error: "Unable to fetch messages" });
  }
};

module.exports = { sendMessage, fetchChatMessages };
