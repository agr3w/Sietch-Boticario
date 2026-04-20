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
import MyLocationIcon from "@mui/icons-material/MyLocation";
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
  const [loadingLocalizacao, setLoadingLocalizacao] = useState(false);

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

  const salvarLocalizacao = async (dados) => {
    if (!userId || !dados) {
      return;
    }

    setSalvando(true);

    try {
      await atualizarLocalizacaoUsuario(userId, {
        cidade: dados.cidade,
        latitude: dados.latitude,
        longitude: dados.longitude,
      });

      onSaved?.({
        cidade: dados.cidade,
        latitude: dados.latitude,
        longitude: dados.longitude,
      });
      onClose?.();
    } catch {
      setErroBusca("Nao foi possivel salvar sua coordenada agora.");
    } finally {
      setSalvando(false);
    }
  };

  const handleSalvar = async () => {
    if (!cidadeSelecionada) {
      return;
    }

    await salvarLocalizacao(cidadeSelecionada);
  };

  const handleDetectarGPS = () => {
    if (!navigator?.geolocation) {
      setErroBusca("Geolocalizacao nao suportada neste dispositivo.");
      return;
    }

    setLoadingLocalizacao(true);
    setErroBusca("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = Number(position.coords.latitude);
        const longitude = Number(position.coords.longitude);

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}&format=json`,
          );

          if (!response.ok) {
            throw new Error("Falha ao resolver cidade por coordenada");
          }

          const data = await response.json();
          const address = data?.address ?? {};
          const cidadeDetectada =
            String(address.city ?? address.town ?? address.village ?? address.municipality ?? "").trim() ||
            String(data?.name ?? "").trim() ||
            "Localizacao atual";

          setCidadeBusca(cidadeDetectada);
          const detectada = {
            cidade: cidadeDetectada,
            cidadeLabel: `${cidadeDetectada} • GPS`,
            latitude,
            longitude,
          };
          setSelecao(detectada);
          await salvarLocalizacao(detectada);
        } catch {
          setErroBusca("Nao foi possivel detectar sua cidade pelo GPS.");
        } finally {
          setLoadingLocalizacao(false);
        }
      },
      () => {
        setErroBusca("Permita acesso a localizacao para detectar sua coordenada.");
        setLoadingLocalizacao(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      },
    );
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

          <Button
            variant="outlined"
            onClick={handleDetectarGPS}
            disabled={loadingLocalizacao || salvando}
            startIcon={loadingLocalizacao ? <CircularProgress size={14} /> : <MyLocationIcon />}
            sx={{
              borderRadius: 0,
              borderColor: "#0D3028",
              color: "#0D3028",
              fontWeight: 700,
              letterSpacing: "0.05em",
            }}
          >
            [ DETECTAR MINHA POSICAO ]
          </Button>

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
