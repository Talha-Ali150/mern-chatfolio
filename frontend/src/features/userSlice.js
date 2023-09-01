import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

export const userSlice = createSlice({
  name: "userLogin",
  initialState,
  reducers: {
    userLoginRequest: (state) => {
      state.error = false;
      state.loading = true;
    },
    userLoginResponse: (state, action) => {
      state.loading = false;
      state.userInfo = action.payload;
      console.log(state);
    },
    userLoginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload.error;
    },
    userLogout: (state) => {
      return {};
    },
  },
});

export const { userLoginRequest, userLoginResponse, userLoginFailure } =
  userSlice.actions;

export default userSlice.reducer;
