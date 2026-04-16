import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0D3028",
    },
    secondary: {
      main: "#A64D13",
    },
    success: {
      main: "#345A14",
    },
    warning: {
      main: "#C48A31",
    },
    error: {
      main: "#9E3D22",
    },
    info: {
      main: "#1B80C4",
    },
    background: {
      default: "#F5ECD7",
      paper: "#EEF0E8",
    },
    text: {
      primary: "#3D2810",
      secondary: "#6E553B",
    },
  },
  sandGradient: "linear-gradient(135deg,#F5ECD7,#0D3028,#A64D13)",
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
      color: "#6E553B",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: "#F5ECD7",
          color: "#3D2810",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          color: "#3D2810",
          borderRadius: 0,
          backgroundColor: "#EEF0E8",
          border: "1px solid rgba(61, 40, 16, 0.1)",
          boxShadow: "0 10px 30px rgba(61, 40, 16, 0.08)",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          color: "#3D2810",
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
          color: "#F5ECD7",
        },
        outlined: {
          borderColor: "rgba(61, 40, 16, 0.3)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-root": {
            color: "#3D2810",
            backgroundColor: "rgba(255, 255, 255, 0.4)",
          },
          "& .MuiInputLabel-root": {
            color: "#6E553B",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#6E553B",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(61, 40, 16, 0.2)",
          },
          "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(61, 40, 16, 0.3)",
          },
          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(61, 40, 16, 0.2)",
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