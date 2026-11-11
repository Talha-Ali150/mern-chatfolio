import React from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";

const formatTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
};

export default function MessageBubble({ message, isOutgoing, recipientIds = [] }) {
  const deliveredTo = new Set((message.deliveredTo || []).map(String));
  const readBy = new Set((message.readBy || []).map(String));
  const hasRecipients = recipientIds.length > 0;
  const delivered = hasRecipients
    ? recipientIds.every((id) => deliveredTo.has(String(id)))
    : Boolean(message.deliveredAt || message.status === "delivered" || message.status === "read");
  const read = hasRecipients
    ? recipientIds.every((id) => readBy.has(String(id)))
    : Boolean(message.readAt || message.status === "read");

  return (
    <Box sx={{ display: "flex", justifyContent: isOutgoing ? "flex-end" : "flex-start", px: { xs: 1.5, sm: 2 }, py: 0.45 }}>
      <Paper
        elevation={0}
        sx={{
          maxWidth: { xs: "88%", sm: "75%", md: "68%" },
          px: 1.6,
          py: 1,
          borderRadius: isOutgoing ? "18px 18px 5px 18px" : "18px 18px 18px 5px",
          color: isOutgoing ? "primary.contrastText" : "text.primary",
          bgcolor: isOutgoing ? "primary.main" : "background.paper",
          border: isOutgoing ? "none" : 1,
          borderColor: "divider",
          overflowWrap: "anywhere",
        }}
      >
        {!isOutgoing && message.sender?.name && (
          <Typography variant="caption" color="primary.main" fontWeight={700} display="block" mb={0.25}>
            {message.sender.name}
          </Typography>
        )}
        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
          {message.message}
        </Typography>
        <Stack direction="row" spacing={0.5} justifyContent="flex-end" alignItems="center" mt={0.4}>
          <Typography variant="caption" sx={{ opacity: 0.72, fontSize: "0.68rem" }}>
            {formatTime(message.createdAt)}
          </Typography>
          {isOutgoing && delivered && (read
            ? <DoneAllIcon aria-label="Read" sx={{ fontSize: 14, color: "info.light" }} />
            : <DoneIcon aria-label="Delivered" sx={{ fontSize: 14, opacity: 0.75 }} />)}
        </Stack>
      </Paper>
    </Box>
  );
}
