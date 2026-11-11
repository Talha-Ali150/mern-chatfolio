import React, { useEffect, useState } from "react";
import styles from "./LoginForm.module.css";
import { Alert, Button, Stack, TextField } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { userLoginRequest, userLoginResponse, userLoginFailure, errorReset } from "../../features/userSlice";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../api";

const LoginForm = () => {
  const loginError = useSelector((state) => state.user.error);
  const loading = useSelector((state) => state.user.loading);
  const [values, setValues] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => { dispatch(errorReset()); }, [dispatch]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(errorReset());
    if (!values.email.trim() || !values.password) {
      dispatch(userLoginFailure({ error: "Enter your email and password" }));
      return;
    }
    dispatch(userLoginRequest());
    try {
      const { data } = await axios.post(`${API_URL}/api/users/login`, {
        email: values.email.trim(), password: values.password,
      });
      dispatch(userLoginResponse(data));
      navigate("/chat");
    } catch (error) {
      dispatch(userLoginFailure({ error: error.response?.data?.message || "Unable to log in" }));
    }
  };

  return (
    <form className={styles.loginFormStyling} onSubmit={handleSubmit}>
      <Stack spacing={1.75}>
        <TextField id="login-email" label="Email address" type="email" autoComplete="email" required fullWidth value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} />
        <TextField id="login-password" label="Password" type="password" autoComplete="current-password" required fullWidth value={values.password} onChange={(event) => setValues({ ...values, password: event.target.value })} />
      </Stack>
      {loginError && <Alert severity="error" sx={{ mt: 2, borderRadius: 3 }}>{loginError}</Alert>}
      <Button className={styles.loginBtnStyling} variant="contained" type="submit" fullWidth endIcon={<ArrowForwardRoundedIcon />} disabled={loading}>
        {loading ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
};

export default LoginForm;
