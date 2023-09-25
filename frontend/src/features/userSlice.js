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
    errorReset: (state) => {
      state.error = false;
    },
    setCurrentlyLoggedUser: (state, action) => {
      return {
        ...state,
        userInfo: {
          ...state.userInfo,
          ...action.payload,
        },
      };
    },
  },
  // extraReducers: (builder) => {
  //   builder.addCase(setCurrentlyLoggedUser, (state, action) => {
  //     return {
  //       ...state,
  //       userInfo: {
  //         ...state.userInfo,
  //         ...action.payload,
  //       },
  //     };
  //   });
  // },
});

export const {
  userLoginRequest,
  userLoginResponse,
  userLoginFailure,
  errorReset,
  userLogout,
  setCurrentlyLoggedUser,
} = userSlice.actions;

export default userSlice.reducer;
