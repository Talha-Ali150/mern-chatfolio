const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const accessChat = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: "no user id provided" });
  }
  let isChat = await Chat.find({
    groupChat: false,
    $and: [
      { members: { $elemMatch: { $eq: req.user._id } } },
      { members: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("members", "-password")
    .populate("lastMessage");
  isChat = await User.populate(isChat, {
    path: "lastMessage.sender",
    select: "name pic email",
  });
  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatTitle: "sender",
      groupChat: false,
      members: [req.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "members",
        "-password"
      );
      res.status(200).send(fullChat);
    } catch (e) {
      res.status(400);
      console.log(e);
    }
  }
};

module.exports = accessChat;
