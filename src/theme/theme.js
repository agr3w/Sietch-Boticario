import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#C47A2C",
    },
    secondary: {
      main: "#6E4B2A",
    },
    success: {
      main: "#2F6F4E",
    },
    background: {
      default: "#F4EDE4",
      paper: "#EFE4D6",
    },
    text: {
      primary: "#3B2F2F",
    },
  },
  sandGradient: "linear-gradient(135deg,#C47A2C,#E7B36A,#8C5A2B)",
  shape: {
    borderRadius: 22,
  },
  typography: {
    fontFamily: '"Cinzel", "Trajan Pro", "Segoe UI", serif',
    h3: {
      fontWeight: 800,
      letterSpacing: "0.06em",
    },
    h5: {
      fontWeight: 700,
      letterSpacing: "0.04em",
    },
    h6: {
      fontWeight: 700,
      letterSpacing: "0.04em",
    },
    subtitle1: {
      color: "#6E4B2A",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: "linear-gradient(180deg,#F4EDE4,#EDE0CF)",
          color: "#3B2F2F",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 22,
          border: "1px solid rgba(100,70,40,0.2)",
          boxShadow: "0 14px 30px rgba(103, 71, 38, 0.16)",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 14,
          textTransform: "none",
          fontWeight: 700,
          padding: "10px 18px",
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
          borderRadius: 22,
          border: "1px solid rgba(100,70,40,0.2)",
        },
      },
    },
  },
});

export default theme;