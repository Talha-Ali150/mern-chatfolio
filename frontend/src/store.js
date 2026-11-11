import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import chatSlice from "./features/chatSlice";
const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const rootReducer = combineReducers({ user: userSlice, chat: chatSlice });

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: ["persist/PERSIST", "persist/REHYDRATE", "persist/REGISTER", "persist/FLUSH", "persist/PAUSE", "persist/PURGE"],
    },
  }),
});

export const persistor = persistStore(store);
