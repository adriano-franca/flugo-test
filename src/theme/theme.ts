import { createTheme } from "@mui/material/styles"

declare module "@mui/material/styles" {
  interface TypeBackground {
    PB: string
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: "#10B981",
      contrastText: "#fff",
    },
    background: {
      default: "#fff",
      PB: "#F8FAFC",
    },
    text: {
      primary: "#111827",
      secondary: "#6B7280",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 700,
      color: "#1F2937",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "8px",
          fontWeight: 600,
          boxShadow: "none",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
          border: "1px solid #E5E7EB",
        },
      },
    },
  },
})