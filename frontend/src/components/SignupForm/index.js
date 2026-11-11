import React, { useState } from "react";
import styles from "./SignupForm.module.css";
import { Alert, Button, Stack, TextField } from "@mui/material";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import UploadImage from "../UploadImage";
import axios from "axios";
import { API_URL } from "../../api";

const defaultPic = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

const SignupForm = () => {
  const [values, setValues] = useState({ name: "", email: "", password: "", confirmPassword: "", pic: defaultPic });
  const [feedback, setFeedback] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const setField = (field) => (event) => setValues((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { email, password, name, confirmPassword, pic } = values;
    if (!name.trim() || !email.trim() || !password || !confirmPassword) return setFeedback({ severity: "warning", text: "Please fill in each field." });
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim())) return setFeedback({ severity: "warning", text: "Enter a valid email address." });
    if (password.length < 8) return setFeedback({ severity: "warning", text: "Use at least 8 characters for your password." });
    if (password !== confirmPassword) return setFeedback({ severity: "warning", text: "Your passwords don’t match." });

    setSubmitting(true);
    setFeedback(null);
    try {
      await axios.post(`${API_URL}/api/users/`, { name: name.trim(), email: email.trim(), password, pic });
      setFeedback({ severity: "success", text: "Your account is ready. Sign in to start a conversation." });
      setValues({ name: "", email: "", password: "", confirmPassword: "", pic: defaultPic });
    } catch (error) {
      setFeedback({ severity: "error", text: error.response?.data?.message || "We couldn’t create your account. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className={styles.signupForm} onSubmit={handleSubmit}>
      <Stack spacing={1.5}>
        <TextField label="Your name" autoComplete="name" required fullWidth value={values.name} onChange={setField("name")} />
        <TextField label="Email address" type="email" autoComplete="email" required fullWidth value={values.email} onChange={setField("email")} />
        <TextField label="Password" type="password" autoComplete="new-password" required fullWidth value={values.password} onChange={setField("password")} />
        <TextField label="Confirm password" type="password" autoComplete="new-password" required fullWidth value={values.confirmPassword} onChange={setField("confirmPassword")} />
      </Stack>
      <UploadImage onImageUpload={(url) => setValues((current) => ({ ...current, pic: url }))} />
      {feedback && <Alert severity={feedback.severity} sx={{ mt: 1.5, borderRadius: 3 }}>{feedback.text}</Alert>}
      <Button className={styles.signupButton} variant="contained" type="submit" fullWidth endIcon={<PersonAddAltRoundedIcon />} disabled={submitting}>
        {submitting ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
};

export default SignupForm;
