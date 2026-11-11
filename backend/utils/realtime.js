const userRoom = (userId) => `user:${String(userId)}`;

const emitToUsers = (io, userIds, event, payload) => {
  if (!io) return;
  for (const userId of userIds) {
    io.to(userRoom(userId?._id || userId)).emit(event, payload);
  }
};

const emitChatUpsert = (io, chat) => {
  if (!chat) return;
  emitToUsers(io, chat.members || [], "chat:upsert", chat);
};

module.exports = { userRoom, emitToUsers, emitChatUpsert };
