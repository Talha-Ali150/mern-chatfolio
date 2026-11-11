export const API_URL = (process.env.BACKEND_URL || "http://localhost:5000").replace(/\/$/, "");

export const authConfig = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});
