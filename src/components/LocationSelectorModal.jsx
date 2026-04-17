import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import RoomIcon from "@mui/icons-material/Room";
import { atualizarLocalizacaoUsuario } from "../firebase";

function normalizarResultadoCidade(resultado) {
  const cidade = String(resultado?.name ?? "").trim();
  const pais = String(resultado?.country ?? "").trim();
  const estado = String(resultado?.admin1 ?? "").trim();

  const cidadeLabel = [cidade, estado || pais].filter(Boolean).join(" • ");

  return {
    cidade,
    cidadeLabel,
    latitude: Number(resultado?.latitude),
    longitude: Number(resultado?.longitude),
  };
}

function LocationSelectorModal({ open, userId, fallback, onClose, onSaved }) {
  const [cidadeBusca, setCidadeBusca] = useState("");
  const [carregandoBusca, setCarregandoBusca] = useState(false);
  const [erroBusca, setErroBusca] = useState("");
  const [resultados, setResultados] = useState([]);
  const [selecao, setSelecao] = useState(null);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setErroBusca("");
    setResultados([]);
    setSelecao(null);
    setCidadeBusca("");
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const termo = cidadeBusca.trim();
    if (termo.length < 2) {
      setResultados([]);
      setErroBusca("");
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(async () => {
      try {
        setCarregandoBusca(true);
        setErroBusca("");

        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(termo)}&count=6&language=pt&format=json`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Falha na busca de cidades");
        }

        const data = await response.json();
        const lista = Array.isArray(data?.results)
          ? data.results
              .map(normalizarResultadoCidade)
              .filter(
                (item) =>
                  item.cidade && Number.isFinite(item.latitude) && Number.isFinite(item.longitude),
              )
          : [];

        setResultados(lista);

        if (lista.length === 0) {
          setErroBusca("Nenhuma cidade encontrada para este termo.");
        }
      } catch (error) {
        if (error?.name !== "AbortError") {
          setErroBusca("Nao foi possivel buscar a cidade agora.");
        }
      } finally {
        setCarregandoBusca(false);
      }
    }, 320);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [cidadeBusca, open]);

  const cidadeSelecionada = useMemo(() => {
    if (selecao) {
      return selecao;
    }

    if (fallback?.cidade && Number.isFinite(Number(fallback?.latitude)) && Number.isFinite(Number(fallback?.longitude))) {
      return {
        cidade: String(fallback.cidade),
        cidadeLabel: `${fallback.cidade} • Padrao`,
        latitude: Number(fallback.latitude),
        longitude: Number(fallback.longitude),
      };
    }

    return null;
  }, [fallback, selecao]);

  const handleSalvar = async () => {
    if (!userId || !cidadeSelecionada) {
      return;
    }

    setSalvando(true);

    try {
      await atualizarLocalizacaoUsuario(userId, {
        cidade: cidadeSelecionada.cidade,
        latitude: cidadeSelecionada.latitude,
        longitude: cidadeSelecionada.longitude,
      });

      onSaved?.({
        cidade: cidadeSelecionada.cidade,
        latitude: cidadeSelecionada.latitude,
        longitude: cidadeSelecionada.longitude,
      });
      onClose?.();
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          backgroundColor: "background.paper",
          color: "primary.main",
          letterSpacing: "0.08em",
          fontFamily: '"Rajdhani", sans-serif',
          textTransform: "uppercase",
          fontWeight: 700,
        }}
      >
        IDENTIFIQUE SUA COORDENADA
      </DialogTitle>

      <DialogContent sx={{ backgroundColor: "background.paper", pt: 2 }}>
        <Stack spacing={1.5}>
          <Typography variant="body2" color="text.secondary">
            Defina a cidade do seu Sietch para leituras climaticas mais precisas.
          </Typography>

          <TextField
            fullWidth
            autoFocus
            label="Buscar cidade"
            placeholder="Ex: Curitiba"
            value={cidadeBusca}
            onChange={(event) => setCidadeBusca(event.target.value)}
          />

          {carregandoBusca && (
            <Stack direction="row" spacing={1} alignItems="center">
              <CircularProgress size={16} />
              <Typography variant="body2" color="text.secondary">
                Buscando coordenadas...
              </Typography>
            </Stack>
          )}

          {erroBusca && <Alert severity="info">{erroBusca}</Alert>}

          {resultados.length > 0 && (
            <Stack spacing={1}>
              {resultados.map((resultado) => {
                const ativo =
                  selecao?.cidade === resultado.cidade &&
                  selecao?.latitude === resultado.latitude &&
                  selecao?.longitude === resultado.longitude;

                return (
                  <Button
                    key={`${resultado.cidade}-${resultado.latitude}-${resultado.longitude}`}
                    onClick={() => setSelecao(resultado)}
                    variant={ativo ? "contained" : "outlined"}
                    color={ativo ? "primary" : "inherit"}
                    startIcon={<RoomIcon />}
                    sx={{
                      justifyContent: "flex-start",
                      borderRadius: 0,
                      textTransform: "none",
                      ...(ativo
                        ? {}
                        : {
                            borderColor: "rgba(61, 40, 16, 0.2)",
                            color: "text.primary",
                          }),
                    }}
                  >
                    {resultado.cidadeLabel}
                  </Button>
                );
              })}
            </Stack>
          )}

          {!resultados.length && !carregandoBusca && fallback?.cidade && (
            <Box sx={{ border: "1px dashed rgba(61, 40, 16, 0.3)", p: 1.2 }}>
              <Typography variant="caption" color="text.secondary">
                Nenhuma cidade selecionada. Continuaremos com o padrao: {fallback.cidade}.
              </Typography>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ backgroundColor: "background.paper", px: 3, pb: 2.2 }}>
        <Button onClick={onClose} color="inherit" sx={{ borderRadius: 0 }}>
          Depois
        </Button>
        <Button
          onClick={handleSalvar}
          variant="contained"
          color="primary"
          disabled={!cidadeSelecionada || salvando}
          sx={{ borderRadius: 0 }}
        >
          {salvando ? "Salvando..." : "DEFINIR COMO MEU SIETCH"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default LocationSelectorModal;
