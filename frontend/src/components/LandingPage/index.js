import React from "react";
import {
  Avatar,
  Box,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Tab from "../Tab";

const PreviewMessage = ({ children, mine = false }) => (
  <Box sx={{ display: "flex", justifyContent: mine ? "flex-end" : "flex-start" }}>
    <Box sx={{ px: 1.5, py: 1, borderRadius: mine ? "16px 16px 4px 16px" : "16px 16px 16px 4px", maxWidth: "82%", bgcolor: mine ? "primary.main" : "action.hover", color: mine ? "primary.contrastText" : "text.primary" }}>
      <Typography variant="body2">{children}</Typography>
    </Box>
  </Box>
);

export default function LandingPage() {
  return (
    <Box sx={{ minHeight: "calc(100vh - 68px)", px: { xs: 2, sm: 4, lg: 8 }, py: { xs: 4, md: 7 }, display: "grid", placeItems: "center", overflow: "hidden" }}>
      <Box sx={{ width: "100%", maxWidth: 1160, display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.05fr 0.95fr" }, alignItems: "center", gap: { xs: 5, md: 9 } }}>
        <Box sx={{ position: "relative", maxWidth: 550, mx: { xs: "auto", md: 0 } }}>
          <Chip
            icon={<AutoAwesomeRoundedIcon />}
            label="A calmer place to connect"
            size="small"
            sx={{ mb: 3, bgcolor: "action.hover", fontWeight: 650, px: 0.5 }}
          />
          <Typography variant="h1" sx={{ fontSize: { xs: "2.8rem", sm: "3.4rem", lg: "4.25rem" }, lineHeight: 1.04, maxWidth: 540 }}>
            Make room for the <Box component="span" sx={{ color: "primary.main" }}>good conversations.</Box>
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 2.5, maxWidth: 450, fontSize: { xs: "1rem", md: "1.1rem" }, lineHeight: 1.8 }}>
            A simple, thoughtful space for the people you want to keep close. Pick up where you left off, anytime.
          </Typography>

          <Box sx={{ mt: 5, position: "relative", maxWidth: 420, mx: { xs: "auto", md: 0 } }}>
            <Box sx={{ position: "absolute", inset: "12% 8%", bgcolor: "primary.main", opacity: 0.2, filter: "blur(54px)", borderRadius: "50%" }} />
            <Paper variant="outlined" sx={{ position: "relative", p: 2.5, borderRadius: 5, bgcolor: "background.paper", boxShadow: "0 24px 70px rgba(227, 125, 172, 0.15)", transform: { md: "rotate(-2deg)" } }}>
              <Stack direction="row" alignItems="center" spacing={1.25}>
                <Stack direction="row" spacing={-0.8}>
                  <Avatar sx={{ width: 34, height: 34, fontSize: 13, border: 2, borderColor: "background.paper", bgcolor: "primary.main", color: "primary.contrastText" }}>M</Avatar>
                  <Avatar sx={{ width: 34, height: 34, fontSize: 13, border: 2, borderColor: "background.paper", bgcolor: "secondary.main", color: "secondary.contrastText" }}>J</Avatar>
                </Stack>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" fontWeight={700}>Weekend plans</Typography>
                  <Typography variant="caption" color="text.secondary">Just now · 2 people</Typography>
                </Box>
                <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "success.main" }} />
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Stack spacing={1.1}>
                <PreviewMessage>Farmers market, then that new little café?</PreviewMessage>
                <PreviewMessage mine>That sounds like a perfect Saturday ☀️</PreviewMessage>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 2.5, px: 1.25, py: 0.8, bgcolor: "action.hover", borderRadius: 3 }}>
                <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>Write a message…</Typography>
                <Box sx={{ display: "grid", placeItems: "center", width: 28, height: 28, color: "primary.contrastText", bgcolor: "primary.main", borderRadius: "50%", fontSize: 13 }}>↗</Box>
              </Stack>
            </Paper>
          </Box>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 3, color: "text.secondary" }}>
            <LockOutlinedIcon sx={{ fontSize: 16 }} />
            <Typography variant="caption">Your conversations stay yours.</Typography>
          </Stack>
        </Box>

        <Paper variant="outlined" sx={{ width: "100%", maxWidth: 440, justifySelf: { xs: "center", md: "end" }, p: { xs: 2.5, sm: 4 }, borderRadius: 5, bgcolor: "background.paper", boxShadow: "0 24px 70px rgba(227, 125, 172, 0.12)" }}>
          <Typography variant="h5" sx={{ mb: 0.75 }}>Welcome to Chatfolio</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>Sign in or create an account to get started.</Typography>
          <Tab />
        </Paper>
      </Box>
    </Box>
  );
}
