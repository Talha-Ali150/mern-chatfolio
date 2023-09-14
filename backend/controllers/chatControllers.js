const Chat = require("../models/chatModel");

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

module.exports = createRetainChat;
