export const layoutSx = {
  pageContainer: {
    mt: 4,
    pb: 6,
    minHeight: "100vh",
  },
  hero: {
    position: "relative",
    mb: 4,
    pt: 2,
    pb: 2,
    "&::before": {
      content: '""',
      position: "absolute",
      width: "360px",
      height: "360px",
      borderRadius: "50%",
      left: "50%",
      top: "-120px",
      transform: "translateX(-50%)",
      background: "radial-gradient(circle, rgba(196,122,44,0.22) 0%, rgba(196,122,44,0.04) 55%, transparent 80%)",
      pointerEvents: "none",
      zIndex: 0,
    },
  },
  heroContent: {
    position: "relative",
    zIndex: 1,
  },
  subtitle: {
    mb: 3,
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
    color: "#fff7ed",
    background: "linear-gradient(135deg,#8C5A2B,#C47A2C)",
    boxShadow: "0 18px 32px rgba(126, 76, 30, 0.34)",
    backdropFilter: "blur(6px)",
  },
  metricBox: {
    p: 2.2,
    borderRadius: 1,
    backgroundColor: "rgba(248, 234, 212, 0.2)",
    border: "1px solid rgba(245, 222, 179, 0.28)",
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
    backgroundColor: "#EFE4D6",
    boxShadow: "0 14px 26px rgba(118, 82, 43, 0.2)",
    border: "1px solid rgba(100,70,40,0.2)",
  },
  cardNeedWater: {
    border: "2px solid #D94841",
    boxShadow: "0 14px 30px rgba(217, 72, 65, 0.25)",
    background: "linear-gradient(180deg, #F5DFD8 0%, #EFE4D6 100%)",
  },
  cardNearWater: {
    border: "2px solid #D39A2C",
    boxShadow: "0 14px 30px rgba(211, 154, 44, 0.23)",
    background: "linear-gradient(180deg, #F5ECCE 0%, #EFE4D6 100%)",
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
    color: "#7B1E1E",
    backgroundColor: "rgba(217, 72, 65, 0.16)",
    borderColor: "rgba(217, 72, 65, 0.45)",
  },
  statusBadgeNearWater: {
    color: "#6B4A00",
    backgroundColor: "rgba(211, 154, 44, 0.18)",
    borderColor: "rgba(211, 154, 44, 0.42)",
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
    color: "#7B1E1E",
    fontWeight: 700,
    backgroundColor: "rgba(217, 72, 65, 0.14)",
    border: "1px solid rgba(217, 72, 65, 0.35)",
  },
  nearAlertText: {
    mb: 2,
    px: 1.2,
    py: 0.7,
    borderRadius: 1,
    color: "#6B4A00",
    fontWeight: 700,
    backgroundColor: "rgba(211, 154, 44, 0.16)",
    border: "1px solid rgba(211, 154, 44, 0.36)",
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
    borderRadius: 2,
    backgroundColor: "#EFE4D6",
    border: "1px solid rgba(100,70,40,0.2)",
    boxShadow: "0 16px 26px rgba(112, 77, 42, 0.24)",
  },
  title: {
    pb: 1,
    letterSpacing: "0.03em",
  },
  form: {
    display: "grid",
    gap: 2,
    pt: "10px !important",
  },
  actions: {
    px: 3,
    pb: 2,
  },
};

export const feedbackSx = {
  snackbarAlert: {
    width: "100%",
  },
};