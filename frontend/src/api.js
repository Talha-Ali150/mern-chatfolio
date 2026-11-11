// Create React App only embeds environment variables prefixed with REACT_APP_.
// Keep REACT_APP_API_URL as a fallback for existing deployments.
const backendUrl = process.env.REACT_APP_BACKEND_URL || process.env.REACT_APP_API_URL;

export const API_URL = (backendUrl || "http://localhost:5000").replace(/\/$/, "");

export const authConfig = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});
