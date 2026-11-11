import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { useDispatch, useSelector } from "react-redux";
import { upsertChat } from "../../features/chatSlice";
import { API_URL, authConfig } from "../../api";

const MyModal = () => {
  const [chatTitle, setChatTitle] = useState("");
  const [addedUsers, setAddedUsers] = useState([]);
  const [userName, setUserName] = useState("");
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const userInfo = useSelector((state) => state.user.userInfo);
  const dispatch = useDispatch();

  const filteredUsers = useMemo(() => data.filter((person) =>
    person.name.toLowerCase().includes(userName.trim().toLowerCase()) &&
    !addedUsers.some((user) => user.id === person._id)
  ), [addedUsers, data, userName]);

  useEffect(() => {
    let isMounted = true;
    const getUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/chat/getUsers`, authConfig(userInfo.token));
        if (isMounted) setData(response.data);
      } catch {
        if (isMounted) setFeedback({ severity: "error", text: "Could not load people for your group." });
      }
    };
    getUsers();
    return () => { isMounted = false; };
  }, [userInfo.token]);

  const closeModal = () => {
    setIsModalOpen(false);
    setUserName("");
  };

  const createGroup = async () => {
    if (!chatTitle.trim()) return setFeedback({ severity: "warning", text: "Give your group a name first." });
    if (addedUsers.length < 2) return setFeedback({ severity: "warning", text: "Choose at least two people for your group." });
    setSubmitting(true);
    try {
      const { data: createdChat } = await axios.post(`${API_URL}/api/chat/groupChat`, {
        chatTitle: chatTitle.trim(),
        members: addedUsers.map((person) => person.id),
      }, authConfig(userInfo.token));
      dispatch(upsertChat(createdChat));
      closeModal();
      setChatTitle("");
      setAddedUsers([]);
      setFeedback({ severity: "success", text: "Your group is ready." });
    } catch (error) {
      setFeedback({ severity: "error", text: error.response?.data?.error || "Could not create the group." });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleUser = (person) => {
    setAddedUsers((current) => current.some((user) => user.id === person._id)
      ? current.filter((user) => user.id !== person._id)
      : [...current, { id: person._id, name: person.name, pic: person.pic }]);
  };

  return (
    <>
      <Button fullWidth variant="outlined" startIcon={<AddRoundedIcon />} onClick={() => setIsModalOpen(true)} sx={{ borderRadius: 3 }}>
        New group
      </Button>
      <Dialog open={isModalOpen} onClose={closeModal} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ pb: 0.5, fontWeight: 750 }}>Create a group</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Bring a few people into one conversation.</Typography>
          <Stack spacing={1.5}>
            <TextField autoFocus fullWidth label="Group name" value={chatTitle} onChange={(event) => setChatTitle(event.target.value)} />
            <TextField fullWidth label="Find people" value={userName} onChange={(event) => setUserName(event.target.value)} />
          </Stack>

          {addedUsers.length > 0 && (
            <Stack direction="row" useFlexGap flexWrap="wrap" gap={0.75} sx={{ mt: 1.5 }}>
              {addedUsers.map((person) => (
                <Chip key={person.id} avatar={<Avatar src={person.pic}>{person.name[0]}</Avatar>} label={person.name} onDelete={() => toggleUser({ _id: person.id })} size="small" />
              ))}
            </Stack>
          )}

          <Box sx={{ mt: 1.5, maxHeight: 260, overflowY: "auto" }}>
            {filteredUsers.length ? (
              <List disablePadding>
                {filteredUsers.map((person) => (
                  <ListItemButton key={person._id} onClick={() => toggleUser(person)} sx={{ borderRadius: 2 }}>
                    <ListItemAvatar><Avatar src={person.pic}>{person.name?.[0]}</Avatar></ListItemAvatar>
                    <ListItemText primary={person.name} secondary={person.email} />
                  </ListItemButton>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: "center" }}>
                {userName ? "No people found." : "Everyone is already selected."}
              </Typography>
            )}
          </Box>
          <Typography variant="caption" color="text.secondary">Select at least two people. You’ll be added automatically.</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={closeModal} color="inherit">Cancel</Button>
          <Button onClick={createGroup} variant="contained" disabled={submitting}>{submitting ? "Creating…" : "Create group"}</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={Boolean(feedback)} autoHideDuration={4000} onClose={() => setFeedback(null)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        {feedback ? <Alert severity={feedback.severity} onClose={() => setFeedback(null)} sx={{ width: "100%" }}>{feedback.text}</Alert> : undefined}
      </Snackbar>
    </>
  );
};

export default MyModal;
