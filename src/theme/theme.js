import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
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
      default: "#0A0A0A",
      paper: "#141414",
    },
    text: {
      primary: "#F5F2EB",
      secondary: "rgba(245, 242, 235, 0.7)",
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
      color: "#D39A2C",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: "linear-gradient(180deg,#11181C,#0B0F12)",
          color: "#F5F2EB",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          color: "#F5F2EB",
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
          color: "#F5F2EB",
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
        contained: {
          color: "#F5F2EB",
        },
        outlined: {
          color: "#F5F2EB",
          borderColor: "rgba(245, 242, 235, 0.5)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-root": {
            color: "#F5F2EB",
            backgroundColor: "rgba(9, 16, 19, 0.58)",
            backdropFilter: "blur(6px)",
          },
          "& .MuiInputLabel-root": {
            color: "#D39A2C",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#F5F2EB",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(245, 242, 235, 0.38)",
          },
          "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(245, 242, 235, 0.62)",
          },
          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#F5F2EB",
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