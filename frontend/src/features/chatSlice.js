import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../api";

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
        `${API_URL}/api/chat/`,
        config
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const resetChats = createAction("chats/resetChats");

const initialState = {
  chats: [],
};

export const chatSlice = createSlice({
  name: "Chats",
  initialState,
  reducers: {
    upsertChat: (state, action) => {
      const chat = action.payload;
      const index = state.chats.findIndex((item) => item._id === chat._id);
      if (index === -1) state.chats.push(chat);
      else state.chats[index] = chat;
      state.chats.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
    },
    removeChat: (state, action) => {
      const chatId = typeof action.payload === "string" ? action.payload : action.payload.chatId;
      state.chats = state.chats.filter((chat) => chat._id !== chatId);
    },
    updateChatPreview: (state, action) => {
      const { chatId, lastMessage, updatedAt } = action.payload;
      const chat = state.chats.find((item) => item._id === chatId);
      if (!chat) return;
      chat.lastMessage = lastMessage;
      chat.updatedAt = updatedAt || lastMessage.createdAt;
      state.chats.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
    },
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
      })
      .addCase(resetChats, (state) => {
        return initialState;
      });
  },
});

export const { upsertChat, removeChat, updateChatPreview } = chatSlice.actions;

// export const { getChatRequest, getChatResponse, getChatFailure } =
//   chatSlice.actions;

export default chatSlice.reducer;
