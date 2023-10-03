const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const sendMessage = async (req, res) => {
  const { message, chat } = req.body;
  if (!message || !chat) {
    return res.status(400).json({ error: "parameters not provided" });
  }
  try {
    const newMessage = {
      sender: req.user._id,
      message: message,
      chat: chat,
    };
    let myMessage = await Message.create(newMessage);
    myMessage = await User.populate(myMessage, {
      path: "sender",
      select: "name",
    });
    myMessage = await Chat.populate(myMessage, {
      path: "chat",
      select: "chatTitle members",
    });
    myMessage = await User.populate(myMessage, {
      path: "chat.members",
      select: "name email",
    });
    await Chat.findByIdAndUpdate(chat, {
      lastMessage: myMessage,
    });
    res.status(201).json(myMessage);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e });
  }
};

const fetchChatMessages = async (req, res) => {
  try {
    const fetchedChat = await Message.find({
      chat: req.params.chatId,
    }).populate("sender", "email name pic");
    // console.log(fetchedChat);
    return res.status(201).json(fetchedChat);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ error: e });
  }
};

module.exports = { sendMessage, fetchChatMessages };
