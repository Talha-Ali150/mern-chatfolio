import React, { createContext, useContext, useMemo, useState } from "react";
import { CssBaseline, ThemeProvider, useMediaQuery } from "@mui/material";
import { createTheme } from "@mui/material/styles";

const ThemeModeContext = createContext({ mode: "light", toggleMode: () => {} });

export const useThemeMode = () => useContext(ThemeModeContext);

export function AppThemeProvider({ children }) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [manualMode, setManualMode] = useState(() => {
    const savedMode = window.localStorage.getItem("chatfolio-theme-mode");
    return savedMode === "dark" || savedMode === "light" ? savedMode : null;
  });
  const mode = manualMode || (prefersDarkMode ? "dark" : "light");
  const theme = useMemo(() => createAppTheme(mode), [mode]);
  const toggleMode = () => {
    const nextMode = mode === "dark" ? "light" : "dark";
    window.localStorage.setItem("chatfolio-theme-mode", nextMode);
    setManualMode(nextMode);
  };

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

export const createAppTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: { main: mode === "dark" ? "#FFB1C4" : "#E37DAC", contrastText: mode === "dark" ? "#2A1A22" : "#2A1720" },
    secondary: { main: mode === "dark" ? "#E37DAC" : "#FFB1C4", contrastText: "#2A1720" },
    success: { main: mode === "dark" ? "#FFB1C4" : "#E37DAC", contrastText: "#2A1720" },
    background: {
      default: mode === "dark" ? "#21171D" : "#FFFFFF",
      paper: mode === "dark" ? "#2C2027" : "#FFFFFF",
    },
    text: {
      primary: mode === "dark" ? "#FFF7FA" : "#2A1720",
      secondary: mode === "dark" ? "#D8C3CC" : "#725966",
    },
    divider: mode === "dark" ? "rgba(255, 177, 196, 0.16)" : "rgba(42, 23, 32, 0.10)",
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: { fontWeight: 750, letterSpacing: "-0.055em" },
    h2: { fontWeight: 730, letterSpacing: "-0.045em" },
    h5: { fontWeight: 700, letterSpacing: "-0.03em" },
    button: { fontWeight: 650, textTransform: "none" },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "html, body, #root": { minHeight: "100%" },
        body: { margin: 0, backgroundImage: "none" },
        "*": { boxSizing: "border-box" },
        "::selection": { backgroundColor: mode === "dark" ? "rgba(255, 177, 196, 0.32)" : "rgba(227, 125, 172, 0.24)" },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 999, paddingInline: 20, minHeight: 42 },
        contained: { boxShadow: "none" },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          "& .MuiOutlinedInput-notchedOutline": { borderColor: mode === "dark" ? "rgba(255, 177, 196, 0.20)" : "rgba(42, 23, 32, 0.14)" },
          "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: mode === "dark" ? "#FFB1C4" : "#E37DAC" },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          margin: "2px 8px",
          width: "calc(100% - 16px)",
          borderRadius: 12,
          "&.Mui-selected": { backgroundColor: mode === "dark" ? "rgba(255, 177, 196, 0.13)" : "rgba(227, 125, 172, 0.12)" },
          "&.Mui-selected:hover": { backgroundColor: mode === "dark" ? "rgba(255, 177, 196, 0.20)" : "rgba(227, 125, 172, 0.18)" },
        },
      },
    },
    MuiPaper: { styleOverrides: { outlined: { borderColor: mode === "dark" ? "rgba(255, 177, 196, 0.16)" : "rgba(42, 23, 32, 0.10)" } } },
    MuiTextField: { defaultProps: { variant: "outlined", size: "medium" } },
  },
});
