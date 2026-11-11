import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userLogout } from "../../features/userSlice";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Alert,
  Box,
  Badge,
  Button,
  Divider,
  InputAdornment,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  Skeleton,
  Stack,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { getAllChats, removeChat, resetChats, upsertChat, updateChatPreview } from "../../features/chatSlice";
import axios from "axios";
import MyModal from "../Modal/index";
import ChatWindow from "../chat/ChatWindow";
import { io } from "socket.io-client";
import { API_URL, authConfig } from "../../api";

const avatarFallback = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
const mergeMessages = (history, current) => {
  const byId = new Map();
  [...history, ...current].forEach((item) => {
    const previous = byId.get(item._id);
    byId.set(item._id, previous ? {
      ...previous,
      ...item,
      deliveredTo: [...new Set([...(previous.deliveredTo || []), ...(item.deliveredTo || [])].map(String))],
      readBy: [...new Set([...(previous.readBy || []), ...(item.readBy || [])].map(String))],
    } : item);
  });
  return [...byId.values()].sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
};
const withPendingReceipt = (message, receipts) => {
  const receipt = receipts.current.get(message._id);
  if (!receipt) return message;
  receipts.current.delete(message._id);
  return { ...message, deliveredTo: receipt.deliveredTo, readBy: receipt.readBy };
};

const PresenceAvatar = ({ src, name, online, showStatus = true }) => {
  const avatar = <Avatar src={src} alt={name}>{name?.[0]}</Avatar>;
  if (!showStatus) return avatar;
  return (
    <Badge
      overlap="circular"
      variant="dot"
      aria-label={`${name} is ${online ? "online" : "offline"}`}
      sx={{ "& .MuiBadge-badge": { bgcolor: online ? "success.main" : "grey.500", boxShadow: "0 0 0 2px", color: "background.paper", width: 9, height: 9, borderRadius: "50%" } }}
    >
      {avatar}
    </Badge>
  );
};

export default function ChatsPage() {
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [query, setQuery] = useState("");
  const [messagesList, setMessagesList] = useState([]);
  const [messageData, setMessageData] = useState("");
  const [chatId, setChatId] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUserIds, setOnlineUserIds] = useState(() => new Set());
  const [presenceReady, setPresenceReady] = useState(false);
  const [presenceUnavailable, setPresenceUnavailable] = useState(false);
  const [notice, setNotice] = useState("");
  const userInfo = useSelector((state) => state.user.userInfo);
  const chatsList = useSelector((state) => state.chat.chats);
  const userId = userInfo?._id || userInfo?.id || userInfo?.data;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const activeChatRef = useRef("");
  const pendingReceiptsRef = useRef(new Map());

  useEffect(() => {
    if (!userInfo?.token) return undefined;
    dispatch(getAllChats(userInfo.token));
    const socket = io(API_URL, { auth: { token: userInfo.token } });
    socketRef.current = socket;
    socket.on("connect", () => {
      setPresenceReady(true);
      setPresenceUnavailable(false);
      socket.emit("presence:sync");
      dispatch(getAllChats(userInfo.token));
      const activeChatId = activeChatRef.current;
      if (activeChatId) {
        socket.emit("join chat", activeChatId);
        axios.get(`${API_URL}/api/message/${activeChatId}`, authConfig(userInfo.token))
          .then(({ data }) => {
            if (activeChatRef.current === activeChatId) setMessagesList((current) => mergeMessages(data, current));
          })
          .catch(() => setNotice("Could not sync the current conversation."));
        socket.emit("chat:read", { chatId: activeChatId });
      }
    });
    socket.on("disconnect", () => {
      setPresenceReady(false);
      setPresenceUnavailable(false);
      setOnlineUserIds(new Set());
      setIsTyping(false);
    });
    socket.on("chat:upsert", (chat) => dispatch(upsertChat(chat)));
    socket.on("chat:remove", ({ chatId: removedChatId }) => {
      dispatch(removeChat(removedChatId));
      if (activeChatRef.current === removedChatId) {
        activeChatRef.current = "";
        setChatId("");
        setMessagesList([]);
      }
    });
    socket.on("message:new", (incoming) => {
      const incomingChatId = String(incoming.chat?._id || incoming.chat);
      const senderId = String(incoming.sender?._id || incoming.sender);
      if (senderId !== String(userId)) {
        socket.emit("message:delivered", { messageId: incoming._id });
      }
      if (incomingChatId === activeChatRef.current) {
        const messageWithReceipt = withPendingReceipt(incoming, pendingReceiptsRef);
        setMessagesList((previous) => mergeMessages(previous, [messageWithReceipt]));
        if (senderId !== String(userId)) socket.emit("chat:read", { chatId: incomingChatId });
      }
    });
    socket.on("message:receipt", (receipt) => {
      setMessagesList((previous) => {
        const exists = previous.some((item) => item._id === receipt.messageId);
        if (!exists && receipt.chatId === activeChatRef.current) {
          pendingReceiptsRef.current.set(receipt.messageId, receipt);
          if (pendingReceiptsRef.current.size > 200) pendingReceiptsRef.current.delete(pendingReceiptsRef.current.keys().next().value);
        }
        return previous.map((item) => item._id === receipt.messageId
          ? { ...item, deliveredTo: receipt.deliveredTo, readBy: receipt.readBy }
          : item);
      });
    });
    socket.on("user typing", ({ room, userId: typingUserId }) => {
      if (room === activeChatRef.current && String(typingUserId) !== String(userId)) setIsTyping(true);
    });
    socket.on("user stopped typing", ({ room, userId: typingUserId }) => {
      if (room === activeChatRef.current && String(typingUserId) !== String(userId)) setIsTyping(false);
    });
    socket.on("presence:snapshot", (ids) => setOnlineUserIds(new Set(ids.map(String))));
    socket.on("presence:update", ({ userId: changedUserId, online }) => {
      setOnlineUserIds((current) => {
        const next = new Set(current);
        if (online) next.add(String(changedUserId));
        else next.delete(String(changedUserId));
        return next;
      });
    });
    socket.on("connect_error", () => {
      setPresenceReady(false);
      setPresenceUnavailable(true);
      setNotice("Realtime connection failed. Check the server and sign in again.");
    });
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [dispatch, userInfo?.token, userId]);

  useEffect(() => {
    activeChatRef.current = chatId;
    if (!chatId || !socketRef.current) return undefined;
    socketRef.current.emit("join chat", chatId);
    setIsTyping(false);
    return () => {
      socketRef.current?.emit("stopped typing", chatId);
      socketRef.current?.emit("leave chat", chatId);
    };
  }, [chatId]);

  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      return undefined;
    }
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${API_URL}/api/users/?search=${encodeURIComponent(query)}`, authConfig(userInfo.token));
        if (!cancelled) setSearchResults(data);
      } catch {
        if (!cancelled) setNotice("Unable to search users.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [query, userInfo.token]);

  const createChat = async (id) => {
    try {
      const { data } = await axios.post(`${API_URL}/api/chat/`, { userId: id }, authConfig(userInfo.token));
      await dispatch(getAllChats(userInfo.token));
      setQuery("");
      activeChatRef.current = data._id;
      setChatId(data._id);
      setMessagesList([]);
      setMessageData("");
      dispatch(upsertChat(data));
      const response = await axios.get(`${API_URL}/api/message/${data._id}`, authConfig(userInfo.token));
      if (activeChatRef.current === data._id) setMessagesList((current) => mergeMessages(response.data, current));
      socketRef.current?.emit("chat:read", { chatId: data._id });
    } catch {
      setNotice("Unable to open this chat.");
    }
  };

  const openChat = async (id) => {
    activeChatRef.current = id;
    setChatId(id);
    setMessagesList([]);
    setMessageData("");
    try {
      const { data } = await axios.get(`${API_URL}/api/message/${id}`, authConfig(userInfo.token));
      if (activeChatRef.current === id) {
        setMessagesList((current) => mergeMessages(data, current));
        socketRef.current?.emit("chat:read", { chatId: id });
      }
    } catch {
      setNotice("Unable to load messages.");
    }
  };

  const sendMessage = async () => {
    const content = messageData.trim();
    if (!content || !chatId || isSending) return;
    setIsSending(true);
    try {
      const { data } = await axios.post(`${API_URL}/api/message/`, { message: content, chat: chatId }, authConfig(userInfo.token));
      dispatch(updateChatPreview({ chatId, lastMessage: data, updatedAt: data.createdAt }));
      if (activeChatRef.current === chatId) {
        const messageWithReceipt = withPendingReceipt(data, pendingReceiptsRef);
        setMessagesList((previous) => mergeMessages(previous, [messageWithReceipt]));
        socketRef.current?.emit("chat:read", { chatId });
      }
      setMessageData("");
    } catch {
      setNotice("Message could not be sent.");
    } finally {
      setIsSending(false);
    }
  };

  const logout = () => {
    socketRef.current?.disconnect();
    dispatch(userLogout());
    dispatch(resetChats());
    navigate("/");
  };

  const activeChat = chatsList?.find((chat) => chat._id === chatId);
  const otherMembers = activeChat?.members?.filter((member) => member._id !== userId) || [];
  const recipient = activeChat ? {
    name: activeChat.chatTitle || otherMembers.map((member) => member.name).join(", "),
    pic: activeChat.groupChat ? avatarFallback : (otherMembers[0]?.pic || avatarFallback),
    isOnline: Boolean(!activeChat.groupChat && onlineUserIds.has(String(otherMembers[0]?._id))),
    presenceReady,
    presenceUnavailable,
    isGroup: activeChat.groupChat,
  } : null;

  return (
    <Box sx={{ width: "100%", maxWidth: 1600, mx: "auto", height: { xs: "auto", md: "calc(100vh - 68px)" }, minHeight: { xs: "calc(100vh - 68px)", md: 540 }, p: { xs: 1.25, sm: 2, md: 3 }, display: "flex", flexDirection: "column", gap: 2 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
        <Box minWidth={0}>
          <Typography variant="h5" fontWeight={750}>Messages</Typography>
          <Typography variant="body2" color="text.secondary" noWrap>Welcome, {userInfo?.name}</Typography>
        </Box>
        <Button onClick={logout} startIcon={<LogoutRoundedIcon />} color="inherit">Log out</Button>
      </Stack>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ flex: 1, minHeight: 0 }}>
        <Paper variant="outlined" sx={{ display: "flex", flexDirection: "column", width: { xs: "100%", md: 330 }, height: { xs: 235, md: "100%" }, flexShrink: 0, minHeight: 0, overflow: "hidden", borderRadius: 4 }}>
          <Box sx={{ p: 1.5 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search people"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              inputProps={{ "aria-label": "Search people" }}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon color="action" /></InputAdornment> }}
            />
          </Box>
          <Divider />
          <Typography variant="overline" color="text.secondary" sx={{ px: 2, pt: 1.25 }}>
            {query.trim() ? "People" : "Conversations"}
          </Typography>
          <List disablePadding sx={{ flex: 1, minHeight: 0, overflowY: "auto", py: 0.5 }}>
            {loading ? <Box sx={{ px: 2, py: 1 }}><Skeleton /><Skeleton /><Skeleton /></Box> : query.trim() ? (
              searchResults.length ? searchResults.map((person) => (
                <ListItemButton key={person._id} onClick={() => createChat(person._id)}>
                  <ListItemAvatar><PresenceAvatar src={person.pic} name={person.name} online={onlineUserIds.has(String(person._id))} /></ListItemAvatar>
                  <ListItemText primary={person.name} secondary={person.email} primaryTypographyProps={{ noWrap: true }} secondaryTypographyProps={{ noWrap: true }} />
                </ListItemButton>
              )) : <Typography variant="body2" color="text.secondary" sx={{ display: "block", px: 2, py: 2 }}>No people matched that search.</Typography>
            ) : chatsList?.length ? chatsList.map((chat) => {
              const members = chat.members.filter((member) => member._id !== userId);
              const title = chat.chatTitle || members.map((member) => member.name).join(", ");
              const picture = chat.groupChat ? avatarFallback : (members[0]?.pic || avatarFallback);
              return (
                <ListItemButton key={chat._id} selected={chatId === chat._id} onClick={() => openChat(chat._id)}>
                  <ListItemAvatar><PresenceAvatar src={picture} name={title} online={onlineUserIds.has(String(members[0]?._id))} showStatus={!chat.groupChat} /></ListItemAvatar>
                  <ListItemText primary={title || "Conversation"} secondary={chat.lastMessage?.message || "No messages yet"} primaryTypographyProps={{ noWrap: true, fontWeight: 650 }} secondaryTypographyProps={{ noWrap: true }} />
                </ListItemButton>
              );
            }) : (
              <Typography variant="body2" color="text.secondary" sx={{ display: "block", px: 2, py: 2 }}>No conversations yet. Search for someone to start one.</Typography>
            )}
          </List>
          <Divider />
          <Box sx={{ p: 1.5 }}><MyModal /></Box>
        </Paper>

        <ChatWindow
          recipient={recipient}
          height={{ xs: "58vh", md: "100%" }}
          messages={messagesList}
          currentUserId={userId}
          recipientIds={otherMembers.map((member) => member._id)}
          isTyping={isTyping}
          message={messageData}
          onMessageChange={setMessageData}
          onSend={sendMessage}
          sending={isSending}
          onTypingStart={() => chatId && socketRef.current?.emit("typing", chatId)}
          onTypingStop={() => chatId && socketRef.current?.emit("stopped typing", chatId)}
        />
      </Stack>
      <Snackbar open={Boolean(notice)} autoHideDuration={4500} onClose={() => setNotice("")} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity="error" onClose={() => setNotice("")} sx={{ width: "100%" }}>{notice}</Alert>
      </Snackbar>
    </Box>
  );
}
