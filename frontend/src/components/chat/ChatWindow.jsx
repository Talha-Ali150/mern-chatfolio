import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import {
  Avatar,
  Badge,
  Box,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import "./chat.css";

const smoothScrollToBottom = (element, offset) => {
  element.scrollBy({ top: offset, behavior: "smooth" });
};

export default function ChatWindow({
  recipient,
  messages = [],
  currentUserId,
  recipientIds = [],
  isTyping = false,
  message,
  onMessageChange,
  onSend,
  sending = false,
  onTypingStart,
  onTypingStop,
  height = "100%",
}) {
  const hasRecipient = Boolean(recipient);

  return (
    <Paper
      elevation={0}
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minWidth: 0,
        minHeight: 0,
        height,
        maxHeight: height,
        overflow: "hidden",
        bgcolor: "background.default",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        sx={{ px: { xs: 1.5, sm: 2.5 }, py: 1.5, minHeight: 72, bgcolor: "background.paper" }}
      >
        {hasRecipient ? (
          <>
            {recipient.isGroup ? (
              <Avatar src={recipient.pic} alt={recipient.name} sx={{ width: 42, height: 42 }}>
                {recipient.name?.[0]?.toUpperCase()}
              </Avatar>
            ) : (
              <Badge
                overlap="circular"
                variant="dot"
                sx={{
                  "& .MuiBadge-badge": {
                    bgcolor: recipient.isOnline ? "success.main" : recipient.presenceReady ? "grey.500" : "action.disabled",
                    boxShadow: "0 0 0 2px",
                    color: "background.paper",
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                  },
                }}
              >
                <Avatar src={recipient.pic} alt={recipient.name} sx={{ width: 42, height: 42 }}>
                  {recipient.name?.[0]?.toUpperCase()}
                </Avatar>
              </Badge>
            )}
            <Box minWidth={0}>
              <Typography variant="subtitle1" fontWeight={700} noWrap>{recipient.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {recipient.isGroup
                  ? "Group conversation"
                  : !recipient.presenceReady
                    ? recipient.presenceUnavailable ? "Status unavailable" : "Checking status…"
                    : recipient.isOnline ? "Online" : "Offline"}
              </Typography>
            </Box>
          </>
        ) : (
          <Typography variant="subtitle1" color="text.secondary">Select a conversation</Typography>
        )}
      </Stack>

      <Divider />

      <Box sx={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, overflow: "hidden" }}>
        <ScrollableFeed
          className="chat-scroll-feed"
          forceScroll
          animateScroll={smoothScrollToBottom}
        >
          {messages.length ? messages.map((item) => (
            <MessageBubble
              key={item._id}
              message={item}
              isOutgoing={String(item.sender?._id) === String(currentUserId)}
              recipientIds={recipientIds}
            />
          )) : (
            <Box sx={{ minHeight: "100%", display: "grid", placeItems: "center", px: 3 }}>
              <Stack alignItems="center" spacing={1} sx={{ textAlign: "center", maxWidth: 280, py: 5 }}>
                <Box sx={{ width: 52, height: 52, display: "grid", placeItems: "center", borderRadius: 3, color: "primary.main", bgcolor: "action.hover" }}>
                  <ForumOutlinedIcon />
                </Box>
                <Typography variant="subtitle2" fontWeight={700}>
                  {hasRecipient ? "A fresh start" : "Your conversations live here"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {hasRecipient ? "Send a message and get the conversation going." : "Choose a person or search for someone to begin."}
                </Typography>
              </Stack>
            </Box>
          )}
        </ScrollableFeed>
        {isTyping && hasRecipient && (
          <Typography variant="caption" color="text.secondary" sx={{ px: 2, pb: 0.75 }}>
            {recipient.name} is typing…
          </Typography>
        )}
      </Box>

      <Divider />
      <Box sx={{ p: { xs: 1.25, sm: 2 }, bgcolor: "background.paper" }}>
        <ChatInput
          value={message || ""}
          onChange={onMessageChange}
          onSend={onSend}
          disabled={!hasRecipient}
          sending={sending}
          onTypingStart={onTypingStart}
          onTypingStop={onTypingStop}
        />
      </Box>
    </Paper>
  );
}
