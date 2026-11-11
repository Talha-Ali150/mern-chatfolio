import React, { useRef } from "react";
import { IconButton, InputAdornment, TextField, Tooltip } from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

export default function ChatInput({
  value,
  onChange,
  onSend,
  disabled = false,
  sending = false,
  onTypingStart,
  onTypingStop,
}) {
  const isTypingRef = useRef(false);

  const stopTyping = () => {
    if (isTypingRef.current) onTypingStop?.();
    isTypingRef.current = false;
  };

  const handleChange = (event) => {
    const nextValue = event.target.value;
    onChange(nextValue);
    if (nextValue.trim() && !isTypingRef.current) {
      isTypingRef.current = true;
      onTypingStart?.();
    } else if (!nextValue.trim()) {
      stopTyping();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (disabled || sending || !value.trim()) return;
    stopTyping();
    onSend();
  };

  return (
    <TextField
      fullWidth
      multiline
      maxRows={4}
      value={value}
      disabled={disabled}
      placeholder={disabled ? "Choose a chat to start messaging" : "Write a message…"}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={stopTyping}
      inputProps={{ "aria-label": "Message" }}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: 4,
          bgcolor: "action.hover",
          py: 0.6,
          pr: 0.6,
        },
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end" sx={{ alignSelf: "flex-end", mb: 0.25 }}>
            <Tooltip title="Send message">
              <span>
                <IconButton
                  aria-label="Send message"
                  color="primary"
                  onClick={handleSend}
                  disabled={disabled || sending || !value.trim()}
                  edge="end"
                >
                  <SendRoundedIcon />
                </IconButton>
              </span>
            </Tooltip>
          </InputAdornment>
        ),
      }}
    />
  );
}
