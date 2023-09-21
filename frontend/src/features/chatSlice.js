import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const getAllChats = createAsyncThunk(
  "chats/getAllChats",
  async (userInfo) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo}`,
        },
      };
      const response = await axios.get(
        "http://localhost:5000/api/chat/",
        config
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const initialState = {
  chats: [],
};

export const chatSlice = createSlice({
  name: "Chats",
  initialState,
  reducers: {
    // getChatRequest: (state) => {
    //   state.error = false;
    //   state.loading = true;
    // },
    // getChatResponse: (state, action) => {
    //   state.loading = false;
    //   state.chatList = action.payload;
    //   console.log(state);
    // },
    // getChatFailure: (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload.error;
    // },
    // userLogout: (state) => {
    //   return {};
    // },
    // errorReset: (state) => {
    //   state.error = false;
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllChats.pending, (state) => {
        state.getChatStatus = "loading";
      })
      .addCase(getAllChats.fulfilled, (state, action) => {
        state.getChatStatus = "succeeded";
        state.chats = action.payload;
      })
      .addCase(getAllChats.rejected, (state, action) => {
        state.getChatStatus = "failed";
        state.getChatError = action.error.message;
      });
  },
});

// export const { getChatRequest, getChatResponse, getChatFailure } =
//   chatSlice.actions;

export default chatSlice.reducer;
