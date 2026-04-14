import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1E3A2F",
    },
    secondary: {
      main: "#D35400",
    },
    success: {
      main: "#2F6F4E",
    },
    info: {
      main: "#1B80C4",
    },
    background: {
      default: "#E8E0D5",
      paper: "#F5F2EB",
    },
    text: {
      primary: "#3B2F2F",
    },
  },
  sandGradient: "linear-gradient(135deg,#1E3A2F,#D35400,#E8E0D5)",
  shape: {
    borderRadius: 0,
  },
  typography: {
    fontFamily: '"Rajdhani", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: "0.05em",
      textTransform: "uppercase",
    },
    h2: {
      fontWeight: 700,
      letterSpacing: "0.05em",
      textTransform: "uppercase",
    },
    h3: {
      fontWeight: 700,
      letterSpacing: "0.05em",
      textTransform: "uppercase",
    },
    h4: {
      fontWeight: 700,
      letterSpacing: "0.05em",
      textTransform: "uppercase",
    },
    h5: {
      fontWeight: 700,
      letterSpacing: "0.05em",
      textTransform: "uppercase",
    },
    h6: {
      fontWeight: 700,
      letterSpacing: "0.05em",
      textTransform: "uppercase",
    },
    subtitle1: {
      color: "#1E3A2F",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: "linear-gradient(180deg,#E8E0D5,#DCD2C2)",
          color: "#3B2F2F",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          backgroundColor: "rgba(30, 58, 47, 0.6)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(211, 84, 0, 0.4)",
          boxShadow:
            "inset 0 1px 0 rgba(232, 224, 213, 0.22), inset 0 -1px 0 rgba(211, 84, 0, 0.35), 0 14px 30px rgba(16, 24, 20, 0.24)",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 0,
          textTransform: "uppercase",
          fontWeight: 700,
          padding: "10px 18px",
          clipPath:
            "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
          boxShadow: "0 8px 16px rgba(114, 73, 36, 0.18)",
          transition: "transform 180ms ease, filter 180ms ease, box-shadow 180ms ease",
          "&:hover": {
            transform: "translateY(-1px)",
            filter: "brightness(1.06)",
            boxShadow: "0 12px 20px rgba(114, 73, 36, 0.26)",
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
          border: "1px solid rgba(100,70,40,0.2)",
        },
      },
    },
  },
});

export default theme;