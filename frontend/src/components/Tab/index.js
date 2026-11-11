import React, { useState } from "react";
import { Alert, Box, Button, Tab, Tabs, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoginForm from "../LoginForm";
import SignupForm from "../SignupForm";

export default function AuthTabs() {
  const user = useSelector((state) => state.user.userInfo);
  const [tab, setTab] = useState(0);
  const navigate = useNavigate();

  if (user?.token) {
    return (
      <Box>
        <Alert severity="success" sx={{ mb: 2, borderRadius: 3 }}>You’re already signed in.</Alert>
        <Button fullWidth variant="contained" onClick={() => navigate("/chat")}>Continue to your chats</Button>
      </Box>
    );
  }

  return (
    <Box>
      <Tabs value={tab} onChange={(_, nextTab) => setTab(nextTab)} variant="fullWidth" aria-label="Account access" sx={{ mb: 2.5, borderBottom: 1, borderColor: "divider", "& .MuiTab-root": { minHeight: 46, fontWeight: 650 } }}>
        <Tab label="Sign in" />
        <Tab label="Create account" />
      </Tabs>
      {tab === 0 ? <LoginForm /> : <SignupForm />}
      <Typography variant="caption" color="text.secondary" sx={{ display: "block", textAlign: "center", mt: 2.5 }}>
        {tab === 0 ? "New here? Create an account to join in." : "Already a member? Sign in anytime."}
      </Typography>
    </Box>
  );
}
