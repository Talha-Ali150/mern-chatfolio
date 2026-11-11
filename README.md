# Mern Chatfolio

A React chat client and Express, MongoDB, and Socket.IO API.

## Run locally

1. Install dependencies in `backend` and `frontend` with `npm install`.
2. Copy `backend/.env.example` to `backend/.env` and set `MONGO_URI` and a private `JWT_SECRET`.
3. Start MongoDB.
4. In `backend`, run `npm run dev`.
5. In `frontend`, run `npm start`.

The client defaults to `http://localhost:5000`. Set `REACT_APP_BACKEND_URL` (or `REACT_APP_API_URL`) in the frontend build environment to use a different API URL. Create React App only embeds variables prefixed with `REACT_APP_`. Set `FRONTEND_URL` in the backend environment to the deployed client origin.

## API overview

- `POST /api/users/` registers an account; `POST /api/users/login` returns a 30-day bearer token.
- `/api/chat` lists the current user's chats and creates or reuses a one-to-one chat.
- `/api/chat/groupChat` creates a group. Only its admin can change membership.
- `/api/message` sends a message; `/api/message/:chatId` fetches chat history.
- Socket.IO requires the same bearer token in `auth.token`; chat room joins are checked against membership.

Passwords are hashed with bcrypt. Keep `.env` out of version control and rotate any secret that has ever been committed or shared.
