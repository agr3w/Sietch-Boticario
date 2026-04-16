export const globalSx = {
  pageTexture: {
    position: "relative",
    isolation: "isolate",
  },
  appTopbar: {
    position: "sticky",
    top: 0,
    zIndex: 1200,
    px: { xs: 1.5, sm: 2.5 },
    py: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid rgba(61, 40, 16, 0.1)",
    background: "rgba(245, 236, 215, 0.85)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 10px 26px rgba(0,0,0,0.34)",
  },
  appBrand: {
    display: "flex",
    alignItems: "center",
    gap: 1.2,
  },
  appMascot: {
    width: 48,
    height: 48,
    objectFit: "cover",
    clipPath:
      "polygon(25% 3%, 75% 3%, 97% 50%, 75% 97%, 25% 97%, 3% 50%)",
    border: "1px solid rgba(211, 154, 44, 0.78)",
    boxShadow: "0 0 14px rgba(211, 154, 44, 0.35)",
  },
  appBrandTitle: {
    color: "text.primary",
    fontFamily: '"Rajdhani", sans-serif',
    fontWeight: 700,
    fontSize: { xs: "1rem", sm: "1.2rem" },
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    lineHeight: 1,
  },
};

export const layoutSx = {
  pageContainer: {
    position: "relative",
    isolation: "isolate",
    mt: 4,
    pb: 6,
    minHeight: "100vh",
    "&::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      zIndex: -1,
      opacity: 0.03,
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
      backgroundRepeat: "repeat",
    },
  },
  hero: {
    position: "relative",
    mb: 4,
    px: { xs: 2, sm: 3 },
    py: 3,
    borderBottom: "4px solid #A64D13",
    color: "#0D3028",
    background: "linear-gradient(to right, #E0EDF5, #E8F4F0)",
  },
  heroContent: {
    position: "relative",
    zIndex: 1,
  },
  subtitle: {
    mb: 3,
    color: "#E8E0D5",
  },
  addButtonRow: {
    mb: 3,
  },
  addButton: {
    background: "linear-gradient(135deg,#C47A2C,#E7B36A,#8C5A2B)",
    color: "#fff7ed",
  },
};

export const climateSx = {
  card: {
    mb: 4,
    color: "#0D3028",
    backgroundColor: "#E0EDF5",
    borderLeft: "4px solid rgba(13, 48, 40, 0.65)",
    border: "1px solid rgba(13, 48, 40, 0.16)",
  },
  metricBox: {
    p: 2.2,
    borderRadius: 0,
    backgroundColor: "rgba(232, 224, 213, 0.08)",
    border: "1px solid rgba(211, 84, 0, 0.22)",
    borderLeft: "4px solid rgba(211, 84, 0, 0.9)",
    boxShadow: "none",
    backdropFilter: "blur(4px)",
  },
  metricBoxWater: {
    borderLeft: "4px solid #1B80C4",
    borderColor: "rgba(27, 128, 196, 0.3)",
    backgroundColor: "rgba(27, 128, 196, 0.12)",
    boxShadow: "none",
    backdropFilter: "blur(8px)",
  },
  metricLabel: {
    opacity: 0.92,
  },
  metricValue: {
    fontWeight: 700,
    letterSpacing: "0.02em",
  },
  title: {
    mb: 2,
  },
  loadingText: {
    opacity: 0.9,
  },
};

export const plantCardSx = {
  card: {
    backgroundColor: "#E8EDE4",
    boxShadow: "0 14px 26px rgba(118, 82, 43, 0.2)",
    border: "1px solid rgba(100,70,40,0.2)",
  },
  cardNeedWater: {
    border: "2px solid #9E3D22",
    boxShadow: "0 14px 30px rgba(158, 61, 34, 0.22)",
    background: "linear-gradient(180deg, #F3DFD8 0%, #E8EDE4 100%)",
  },
  cardNearWater: {
    border: "2px solid #C48A31",
    boxShadow: "0 14px 30px rgba(196, 138, 49, 0.22)",
    background: "linear-gradient(180deg, #F7EACF 0%, #E8EDE4 100%)",
  },
  cardHydrated: {
    border: "2px solid #1B80C4",
    boxShadow: "0 14px 30px rgba(27, 128, 196, 0.2)",
    background: "linear-gradient(180deg, #E1EEF7 0%, #E8EDE4 100%)",
  },
  content: {
    p: 3,
  },
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: 999,
    px: 1.2,
    py: 0.45,
    mb: 1.2,
    fontSize: "0.75rem",
    fontWeight: 800,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    border: "1px solid transparent",
  },
  statusBadgeNeedWater: {
    color: "#9E3D22",
    backgroundColor: "rgba(158, 61, 34, 0.1)",
    borderColor: "rgba(158, 61, 34, 0.36)",
  },
  statusBadgeNearWater: {
    color: "#7A551C",
    backgroundColor: "rgba(196, 138, 49, 0.16)",
    borderColor: "rgba(196, 138, 49, 0.38)",
  },
  statusBadgeHydrated: {
    color: "#0D3028",
    backgroundColor: "rgba(27, 128, 196, 0.14)",
    borderColor: "rgba(27, 128, 196, 0.36)",
  },
  actionRow: {
    mt: 2,
  },
  title: {
    fontWeight: 700,
    letterSpacing: "0.03em",
  },
  secondaryText: {
    mb: 2,
  },
  intervalText: {
    mb: 1,
  },
  lastWatering: {
    mb: 2.5,
  },
  alertText: {
    mb: 2,
    px: 1.2,
    py: 0.7,
    borderRadius: 1,
    color: "#9E3D22",
    fontWeight: 700,
    backgroundColor: "rgba(158, 61, 34, 0.1)",
    border: "1px solid rgba(158, 61, 34, 0.35)",
  },
  nearAlertText: {
    mb: 2,
    px: 1.2,
    py: 0.7,
    borderRadius: 1,
    color: "#7A551C",
    fontWeight: 700,
    backgroundColor: "rgba(196, 138, 49, 0.16)",
    border: "1px solid rgba(196, 138, 49, 0.36)",
  },
  hydratedAlertText: {
    mb: 2,
    px: 1.2,
    py: 0.7,
    borderRadius: 1,
    color: "#0D3028",
    fontWeight: 700,
    backgroundColor: "rgba(27, 128, 196, 0.12)",
    border: "1px solid rgba(27, 128, 196, 0.34)",
  },
  waterButton: {
    py: 1.2,
    fontSize: "0.98rem",
  },
  adjustButton: {
    py: 1.2,
  },
  icon: {
    fontSize: "1.15rem",
    lineHeight: 1,
  },
};

export const addPlantModalSx = {
  dialogPaper: {
    borderRadius: 0,
    background: "#EEF0E8",
    border: "1px solid rgba(166, 77, 19, 0.2)",
    boxShadow: "0 12px 28px rgba(61, 40, 16, 0.12)",
    color: "#3D2810",
  },
  title: {
    pb: 1.1,
    color: "#0D3028",
    fontFamily: '"Rajdhani", sans-serif',
    textTransform: "uppercase",
    fontWeight: 700,
    letterSpacing: "0.06em",
    borderBottom: "1px solid rgba(13, 48, 40, 0.16)",
    backgroundColor: "#E0EDF5",
  },
  form: {
    display: "grid",
    gap: 2,
    pt: "10px !important",
    "& .MuiTextField-root .MuiInputBase-root": {
      backgroundColor: "rgba(255, 255, 255, 0.6)",
      color: "#3D2810",
    },
    "& .MuiTextField-root .MuiInputLabel-root": {
      color: "#6E553B",
    },
    "& .MuiTextField-root .MuiInputLabel-root.Mui-focused": {
      color: "#345A14",
    },
    "& .MuiTextField-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(61, 40, 16, 0.2)",
    },
    "& .MuiTextField-root .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(61, 40, 16, 0.32)",
    },
    "& .MuiTextField-root .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#345A14",
    },
    "& .MuiInputBase-input::placeholder": {
      color: "rgba(61, 40, 16, 0.55)",
      opacity: 1,
    },
  },
  divider: {
    borderColor: "rgba(211, 154, 44, 0.28)",
  },
  captureButton: {
    py: 1.2,
    borderColor: "rgba(126, 195, 241, 0.8)",
    color: "#EAF6FF",
    backgroundColor: "rgba(17, 35, 46, 0.55)",
    "&:hover": {
      borderColor: "#7EC3F1",
      backgroundColor: "rgba(20, 46, 61, 0.74)",
    },
  },
  previewImage: {
    width: "100%",
    maxWidth: 240,
    height: 170,
    objectFit: "cover",
    border: "1px solid rgba(126, 166, 194, 0.45)",
    boxShadow: "0 8px 20px rgba(0,0,0,0.42)",
  },
  actions: {
    px: 3,
    pb: 2,
    pt: 1,
    borderTop: "1px solid rgba(126, 195, 241, 0.25)",
    backgroundColor: "rgba(12, 19, 24, 0.72)",
  },
  cancelButton: {
    color: "rgba(245, 242, 235, 0.84)",
    "&:hover": {
      color: "#F5F2EB",
      backgroundColor: "rgba(126, 195, 241, 0.12)",
    },
  },
  submitButton: {
    background: "linear-gradient(135deg, #345A14 0%, #4A7A1F 100%)",
    color: "#F5F2EB",
    "&:hover": {
      background: "linear-gradient(135deg, #2C4D11 0%, #3F691A 100%)",
    },
  },
};

export const feedbackSx = {
  snackbarAlert: {
    width: "100%",
  },
};