import React from "react";
import { Avatar, Box, Button, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import { Link as RouterLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useThemeMode } from "../../theme";

export default function CustomNavbar() {
  const user = useSelector((state) => state.user.userInfo);
  const isLoggedIn = Boolean(user?.token);
  const { mode, toggleMode } = useThemeMode();

  return (
    <Box
      component="header"
      sx={{
        height: 68,
        px: { xs: 2, sm: 3, md: 5 },
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        bgcolor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
        position: "relative",
        zIndex: 1,
      }}
    >
      <Stack component={RouterLink} to="/" direction="row" alignItems="center" spacing={1.2} sx={{ textDecoration: "none", color: "text.primary" }}>
        <Box sx={{ width: 36, height: 36, borderRadius: 2.5, display: "grid", placeItems: "center", bgcolor: "primary.main", color: "primary.contrastText" }}>
          <ForumRoundedIcon sx={{ fontSize: 21 }} />
        </Box>
        <Box>
          <Typography variant="subtitle1" fontWeight={800} lineHeight={1.1}>Chatfolio</Typography>
          <Typography variant="caption" color="text.secondary" lineHeight={1}>Conversations, simply.</Typography>
        </Box>
      </Stack>

      <Stack direction="row" alignItems="center" spacing={1.25}>
        <Tooltip title={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}>
          <IconButton aria-label={`Switch to ${mode === "dark" ? "light" : "dark"} mode`} onClick={toggleMode} size="small">
            {mode === "dark" ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
          </IconButton>
        </Tooltip>
        {isLoggedIn && (
          <Stack direction="row" alignItems="center" spacing={1.25}>
            <Typography variant="body2" color="text.secondary" sx={{ display: { xs: "none", sm: "block" } }}>Your space</Typography>
            <Avatar src={user.pic} alt={user.name} sx={{ width: 34, height: 34, bgcolor: "secondary.main", fontSize: 14 }}>
              {user.name?.[0]?.toUpperCase()}
            </Avatar>
            <Button component={RouterLink} to="/chat" size="small" variant="outlined" sx={{ display: { xs: "none", sm: "inline-flex" } }}>
              Open chats
            </Button>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
