import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { Box, Container, LinearProgress, Stack, Typography } from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import { db } from "../firebase";

function parseUltimaRegaDate(ultimaRega) {
  if (!ultimaRega) {
    return null;
  }

  if (typeof ultimaRega?.toDate === "function") {
    const date = ultimaRega.toDate();
    return Number.isFinite(date.getTime()) ? date : null;
  }

  if (typeof ultimaRega?.seconds === "number") {
    const date = new Date(ultimaRega.seconds * 1000);
    return Number.isFinite(date.getTime()) ? date : null;
  }

  const date = new Date(ultimaRega);
  return Number.isFinite(date.getTime()) ? date : null;
}

function PlantView() {
  const { id } = useParams();
  const [planta, setPlanta] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [climaAtual, setClimaAtual] = useState(null);

  useEffect(() => {
    let ativo = true;

    const carregarPlanta = async () => {
      if (!id) {
        if (ativo) {
          setErro("Identificador da planta inválido.");
          setCarregando(false);
        }
        return;
      }

      try {
        setCarregando(true);
        const plantaRef = doc(db, "plantas", id);
        const plantaSnapshot = await getDoc(plantaRef);

        if (!plantaSnapshot.exists()) {
          throw new Error("PLANTA_NAO_ENCONTRADA");
        }

        if (ativo) {
          setPlanta({ id: plantaSnapshot.id, ...plantaSnapshot.data() });
          setErro("");
        }
      } catch {
        if (ativo) {
          setErro("Planta não encontrada no Sietch.");
          setPlanta(null);
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    };

    void carregarPlanta();

    return () => {
      ativo = false;
    };
  }, [id]);

  useEffect(() => {
    const controller = new AbortController();

    const carregarClima = async () => {
      try {
        const response = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=-25.4284&longitude=-49.2733&current=temperature_2m,relative_humidity_2m",
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("CLIMA_INDISPONIVEL");
        }

        const data = await response.json();

        if (data?.current) {
          setClimaAtual({
            temperatura: data.current.temperature_2m,
            umidade: data.current.relative_humidity_2m,
          });
        }
      } catch {
        setClimaAtual(null);
      }
    };

    void carregarClima();

    return () => {
      controller.abort();
    };
  }, []);

  const sinaisVitais = useMemo(() => {
    const intervaloRega = Number(planta?.intervalo_rega_dias ?? 0);
    const dataRega = parseUltimaRegaDate(planta?.ultima_rega);
    const dataRegaValida = Boolean(dataRega);
    const diasExatosDesdeRega = dataRegaValida
      ? (Date.now() - dataRega.getTime()) / (1000 * 60 * 60 * 24)
      : 0;

    const porcentagemAgua =
      dataRegaValida && Number.isFinite(intervaloRega) && intervaloRega > 0
        ? Math.min(100, Math.max(0, 100 - (diasExatosDesdeRega / intervaloRega) * 100))
        : 0;

    const status =
      porcentagemAgua > 25 ? "prosperando" : porcentagemAgua > 0 ? "alerta" : "critico";

    return {
      porcentagemAgua,
      status,
    };
  }, [planta]);

  const auraColor =
    sinaisVitais.status === "critico"
      ? "rgba(217, 72, 65, 0.34)"
      : sinaisVitais.status === "alerta"
        ? "rgba(211, 154, 44, 0.3)"
        : "rgba(47, 111, 78, 0.34)";

  const barraColor =
    sinaisVitais.porcentagemAgua > 25
      ? "info"
      : sinaisVitais.porcentagemAgua > 0
        ? "secondary"
        : "error";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        py: 5,
        background: "radial-gradient(circle at 50% 0%, #1E2428 0%, #0E1316 100%)",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          opacity: 0.12,
          backgroundImage:
            "radial-gradient(rgba(232,224,213,0.16) 0.7px, transparent 0.7px), radial-gradient(rgba(211,84,0,0.14) 0.8px, transparent 0.8px)",
          backgroundPosition: "0 0, 10px 10px",
          backgroundSize: "18px 18px, 24px 24px",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          inset: "-20%",
          pointerEvents: "none",
          background: `radial-gradient(circle, ${auraColor} 0%, transparent 62%)`,
          filter: "blur(40px)",
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <Stack spacing={2.4} sx={{ textAlign: "center" }}>
          {carregando && (
            <Typography sx={{ color: "#E8E0D5", fontFamily: '"Share Tech Mono", monospace' }}>
              Sincronizando sinais do Sietch...
            </Typography>
          )}

          {!carregando && erro && (
            <Typography sx={{ color: "error.main", fontFamily: '"Share Tech Mono", monospace' }}>
              {erro}
            </Typography>
          )}

          {!carregando && !erro && planta && (
            <>
              <Typography
                variant="h3"
                sx={{
                  color: "#E8E0D5",
                  fontFamily: '"Rajdhani", sans-serif',
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {planta.nome_apelido}
              </Typography>

              <Box
                sx={{
                  mx: "auto",
                  width: 96,
                  height: 96,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  border: "1px solid rgba(211, 84, 0, 0.35)",
                  backgroundColor: "rgba(15, 20, 24, 0.6)",
                }}
              >
                {sinaisVitais.status === "critico" ? (
                  <WarningAmberIcon sx={{ fontSize: 56, color: "error.main" }} />
                ) : (
                  <WaterDropIcon
                    sx={{
                      fontSize: 56,
                      color: sinaisVitais.status === "alerta" ? "secondary.main" : "info.main",
                    }}
                  />
                )}
              </Box>

              <Typography
                sx={{
                  color: "#E8E0D5",
                  fontFamily: '"Share Tech Mono", monospace',
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                Monitor de Sinais Vitais
              </Typography>

              <Box sx={{ px: { xs: 1, sm: 4 } }}>
                <LinearProgress
                  variant="determinate"
                  value={sinaisVitais.porcentagemAgua}
                  color={barraColor}
                  sx={{
                    height: 10,
                    borderRadius: 0,
                    backgroundColor: "rgba(0,0,0,0.42)",
                    border: "1px solid rgba(211,84,0,0.3)",
                  }}
                />
                <Typography
                  sx={{
                    mt: 1,
                    color: "#E8E0D5",
                    fontFamily: '"Share Tech Mono", monospace',
                  }}
                >
                  Umidade disponível: {Math.round(sinaisVitais.porcentagemAgua)}%
                </Typography>
              </Box>

              <Stack
                direction="row"
                justifyContent="center"
                spacing={2.4}
                sx={{
                  color: "#E8E0D5",
                  fontFamily: '"Share Tech Mono", monospace',
                  flexWrap: "wrap",
                  rowGap: 0.8,
                }}
              >
                <Typography sx={{ fontFamily: '"Share Tech Mono", monospace' }}>
                  Saúde: {sinaisVitais.status === "critico" ? "Crítico" : sinaisVitais.status === "alerta" ? "Atenção" : "Prosperando"}
                </Typography>
                <Typography sx={{ fontFamily: '"Share Tech Mono", monospace' }}>
                  Clima: {climaAtual ? `${climaAtual.temperatura}°C / ${climaAtual.umidade}%` : "Sinal indisponível"}
                </Typography>
              </Stack>
            </>
          )}

          <Typography
            variant="caption"
            sx={{
              mt: 1,
              color: "rgba(232,224,213,0.7)",
              fontFamily: '"Share Tech Mono", monospace',
              letterSpacing: "0.06em",
            }}
          >
            Sietch Boticário - Protocolo de Sobrevivência
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}

export default PlantView;