import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import {
  Box,
  Button,
  Dialog,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function CameraScanner({ open, onClose, ultimaFotoUrl, onCapture }) {
  const webcamRef = useRef(null);
  const [mostrarFantasma, setMostrarFantasma] = useState(false);
  const [mostrarGrid, setMostrarGrid] = useState(false);
  const [mostrarHud, setMostrarHud] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setMostrarFantasma(false);
    setMostrarGrid(false);
    setMostrarHud(false);
  }, [open]);

  const handleCapture = useCallback(() => {
    const imagemCapturada = webcamRef.current?.getScreenshot();

    if (!imagemCapturada) {
      return;
    }

    if (typeof onCapture === "function") {
      onCapture(imagemCapturada);
    }
  }, [onCapture]);

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: "#000",
        },
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          backgroundColor: "#000",
          overflow: "hidden",
        }}
      >
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: "environment" }}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {Boolean(ultimaFotoUrl) && mostrarFantasma && (
          <Box
            component="img"
            src={ultimaFotoUrl}
            alt="Referencia morfologica anterior"
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 2,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.4,
              pointerEvents: "none",
            }}
          />
        )}

        {mostrarGrid && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 3,
              pointerEvents: "none",
              backgroundImage:
                "linear-gradient(to right, rgba(232,224,213,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(232,224,213,0.18) 1px, transparent 1px)",
              backgroundSize: "11.11% 11.11%",
            }}
          />
        )}

        {mostrarHud && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 4,
              pointerEvents: "none",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: "70vw",
                maxWidth: 440,
                height: "70vw",
                maxHeight: 440,
                transform: "translate(-50%, -50%)",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  left: "50%",
                  top: 0,
                  width: 1,
                  height: "100%",
                  backgroundColor: "rgba(27, 128, 196, 0.52)",
                  transform: "translateX(-50%)",
                }}
              />
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: 0,
                  width: "100%",
                  height: 1,
                  backgroundColor: "rgba(232, 224, 213, 0.5)",
                  transform: "translateY(-50%)",
                }}
              />
            </Box>

            <Box
              sx={{
                position: "absolute",
                top: 18,
                left: 18,
                width: 34,
                height: 34,
                borderTop: "2px solid rgba(232,224,213,0.6)",
                borderLeft: "2px solid rgba(232,224,213,0.6)",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: 18,
                right: 18,
                width: 34,
                height: 34,
                borderTop: "2px solid rgba(232,224,213,0.6)",
                borderRight: "2px solid rgba(232,224,213,0.6)",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: 92,
                left: 18,
                width: 34,
                height: 34,
                borderBottom: "2px solid rgba(232,224,213,0.6)",
                borderLeft: "2px solid rgba(232,224,213,0.6)",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: 92,
                right: 18,
                width: 34,
                height: 34,
                borderBottom: "2px solid rgba(232,224,213,0.6)",
                borderRight: "2px solid rgba(232,224,213,0.6)",
              }}
            />
          </Box>
        )}

        <Stack
          spacing={0.2}
          sx={{
            position: "absolute",
            top: 14,
            left: 12,
            zIndex: 5,
            px: 1.2,
            py: 0.8,
            border: "1px solid rgba(126, 195, 241, 0.88)",
            background:
              "linear-gradient(180deg, rgba(7, 13, 18, 0.94) 0%, rgba(7, 13, 18, 0.98) 100%)",
            boxShadow: "0 0 0 1px rgba(0,0,0,0.72), 0 6px 18px rgba(0,0,0,0.52)",
            backdropFilter: "blur(5px)",
            minWidth: 154,
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: "#EAF6FF",
              fontFamily: '"Share Tech Mono", monospace',
              letterSpacing: "0.04em",
              fontWeight: 700,
              textShadow: "0 1px 0 rgba(0,0,0,0.45)",
            }}
          >
            GUIAS DO SCANNER
          </Typography>
          <FormControlLabel
            sx={{
              m: 0,
              "& .MuiFormControlLabel-label": {
                color: "#F4F9FF",
                fontSize: "0.82rem",
                fontWeight: 600,
                letterSpacing: "0.02em",
              },
            }}
            control={
              <Switch
                size="small"
                checked={mostrarFantasma}
                onChange={(event) => setMostrarFantasma(event.target.checked)}
                sx={{
                  mr: 0.5,
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: "#06141E",
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "#7EC3F1",
                    opacity: 1,
                  },
                  "& .MuiSwitch-track": {
                    backgroundColor: "rgba(229, 240, 250, 0.42)",
                    opacity: 1,
                  },
                  "& .MuiSwitch-thumb": {
                    backgroundColor: "#F7FBFF",
                    boxShadow: "0 0 0 1px rgba(0,0,0,0.45)",
                  },
                }}
              />
            }
            label="Ghost"
          />
          <FormControlLabel
            sx={{
              m: 0,
              "& .MuiFormControlLabel-label": {
                color: "#F4F9FF",
                fontSize: "0.82rem",
                fontWeight: 600,
                letterSpacing: "0.02em",
              },
            }}
            control={
              <Switch
                size="small"
                checked={mostrarGrid}
                onChange={(event) => setMostrarGrid(event.target.checked)}
                sx={{
                  mr: 0.5,
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: "#06141E",
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "#7EC3F1",
                    opacity: 1,
                  },
                  "& .MuiSwitch-track": {
                    backgroundColor: "rgba(229, 240, 250, 0.42)",
                    opacity: 1,
                  },
                  "& .MuiSwitch-thumb": {
                    backgroundColor: "#F7FBFF",
                    boxShadow: "0 0 0 1px rgba(0,0,0,0.45)",
                  },
                }}
              />
            }
            label="Grid"
          />
          <FormControlLabel
            sx={{
              m: 0,
              "& .MuiFormControlLabel-label": {
                color: "#F4F9FF",
                fontSize: "0.82rem",
                fontWeight: 600,
                letterSpacing: "0.02em",
              },
            }}
            control={
              <Switch
                size="small"
                checked={mostrarHud}
                onChange={(event) => setMostrarHud(event.target.checked)}
                sx={{
                  mr: 0.5,
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: "#06141E",
                  },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                    backgroundColor: "#7EC3F1",
                    opacity: 1,
                  },
                  "& .MuiSwitch-track": {
                    backgroundColor: "rgba(229, 240, 250, 0.42)",
                    opacity: 1,
                  },
                  "& .MuiSwitch-thumb": {
                    backgroundColor: "#F7FBFF",
                    boxShadow: "0 0 0 1px rgba(0,0,0,0.45)",
                  },
                }}
              />
            }
            label="HUD"
          />
        </Stack>

        <IconButton
          onClick={onClose}
          aria-label="Abortar scanner"
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            zIndex: 6,
            color: "#E8E0D5",
            backgroundColor: "rgba(0,0,0,0.4)",
            border: "1px solid rgba(232,224,213,0.3)",
            backdropFilter: "blur(4px)",
            "&:hover": {
              backgroundColor: "rgba(0,0,0,0.62)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box
          sx={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 6,
            p: 2,
            display: "flex",
            justifyContent: "center",
            background:
              "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.75) 55%, rgba(0,0,0,0.92) 100%)",
          }}
        >
          <Button
            variant="contained"
            onClick={handleCapture}
            sx={{
              minHeight: 54,
              width: "min(92vw, 460px)",
              borderRadius: 0,
              fontWeight: 700,
              letterSpacing: "0.08em",
              clipPath:
                "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
              backgroundColor: "#1B80C4",
              color: "#F2F3EE",
              border: "1px solid rgba(232,224,213,0.28)",
              textAlign: "center",
              px: 2,
              "&:hover": {
                backgroundColor: "#166EA8",
              },
            }}
          >
            CAPTURAR DADOS MORFOLOGICOS
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}

export default CameraScanner;
