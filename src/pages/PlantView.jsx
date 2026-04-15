import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { addDoc, collection, doc, getDoc, serverTimestamp } from "firebase/firestore";
import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  LinearProgress,
  MenuItem,
  Select,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import BrightnessMediumIcon from "@mui/icons-material/BrightnessMedium";
import CloudIcon from "@mui/icons-material/Cloud";
import TerrainIcon from "@mui/icons-material/Terrain";
import PetsIcon from "@mui/icons-material/Pets";
import WarningIcon from "@mui/icons-material/Warning";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CameraScanner from "../components/CameraScanner";
import { adicionarFotoGaleriaPlanta, db, getHistoricoFotos } from "../firebase";

function parseUltimaRegaDate(ultimaRega) {
  if (!ultimaRega) {
    return null;
  }

  if (typeof ultimaRega?.toDate === "function") {
    const date = ultimaRega.toDate();
    return Number.isFinite(date.getTime()) ? date : null;
  }

  if (typeof ultimaRega?.seconds === "number") {
    const milliseconds =
      ultimaRega.seconds * 1000 + Math.floor((ultimaRega.nanoseconds ?? 0) / 1000000);
    const date = new Date(milliseconds);
    return Number.isFinite(date.getTime()) ? date : null;
  }

  const date = new Date(ultimaRega);
  return Number.isFinite(date.getTime()) ? date : null;
}

function extrairDataRegistro(dataRegistro) {
  if (!dataRegistro) {
    return null;
  }

  if (typeof dataRegistro?.toDate === "function") {
    const date = dataRegistro.toDate();
    return Number.isFinite(date.getTime()) ? date : null;
  }

  if (typeof dataRegistro?.seconds === "number") {
    const milliseconds =
      dataRegistro.seconds * 1000 + Math.floor((dataRegistro.nanoseconds ?? 0) / 1000000);
    const date = new Date(milliseconds);
    return Number.isFinite(date.getTime()) ? date : null;
  }

  const date = new Date(dataRegistro);
  return Number.isFinite(date.getTime()) ? date : null;
}

function formatarDataRegistroCurta(dataRegistro, dataRegistroLocal) {
  if (typeof dataRegistroLocal === "string" && dataRegistroLocal.trim()) {
    return `Registro de ${dataRegistroLocal}`;
  }

  const date = extrairDataRegistro(dataRegistro);
  if (!date) {
    return "Registro sem data";
  }

  return `Registro de ${date.toLocaleDateString("pt-BR", {
    timeZone: "America/Sao_Paulo",
  })} às ${date.toLocaleTimeString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

function ordenarFotosPorDataAsc(fotos) {
  return [...fotos].sort((a, b) => {
    const dataA = extrairDataRegistro(a?.data_registro ?? a?.data_captura);
    const dataB = extrairDataRegistro(b?.data_registro ?? b?.data_captura);
    return (dataA?.getTime() ?? 0) - (dataB?.getTime() ?? 0);
  });
}

function PlantView() {
  const { id } = useParams();
  const [planta, setPlanta] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [climaAtual, setClimaAtual] = useState(null);
  const [fotos, setFotos] = useState([]);
  const [indexFoto, setIndexFoto] = useState(0);
  const [carregandoFotos, setCarregandoFotos] = useState(false);
  const [autoplayAtivo, setAutoplayAtivo] = useState(false);
  const [velocidadeTimelapse, setVelocidadeTimelapse] = useState(1400);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [salvandoFoto, setSalvandoFoto] = useState(false);
  const [erroFoto, setErroFoto] = useState("");

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
    if (!planta?.id) {
      setFotos([]);
      return;
    }

    let ativo = true;

    const carregarFotos = async () => {
      try {
        setCarregandoFotos(true);
        const historicoFotos = await getHistoricoFotos(planta.id);
        if (!ativo) {
          return;
        }

        if (historicoFotos.length > 0) {
          setFotos(ordenarFotosPorDataAsc(historicoFotos));
        } else {
          const fallbackGaleria = Array.isArray(planta?.galeria_fotos)
            ? planta.galeria_fotos
            : Array.isArray(planta?.galeriaFotos)
              ? planta.galeriaFotos
              : [];
          setFotos(ordenarFotosPorDataAsc(fallbackGaleria));
        }
      } catch {
        if (ativo) {
          const fallbackGaleria = Array.isArray(planta?.galeria_fotos)
            ? planta.galeria_fotos
            : Array.isArray(planta?.galeriaFotos)
              ? planta.galeriaFotos
              : [];
          setFotos(ordenarFotosPorDataAsc(fallbackGaleria));
        }
      } finally {
        if (ativo) {
          setCarregandoFotos(false);
        }
      }
    };

    void carregarFotos();

    return () => {
      ativo = false;
    };
  }, [planta?.id, planta?.galeria_fotos, planta?.galeriaFotos]);

  useEffect(() => {
    setIndexFoto((valorAtual) => {
      if (fotos.length === 0) {
        return 0;
      }

      return Math.min(valorAtual, fotos.length - 1);
    });
  }, [fotos.length]);

  useEffect(() => {
    if (!autoplayAtivo || fotos.length <= 1) {
      return;
    }

    const intervalId = setInterval(() => {
      setIndexFoto((valorAtual) => (valorAtual >= fotos.length - 1 ? 0 : valorAtual + 1));
    }, velocidadeTimelapse);

    return () => {
      clearInterval(intervalId);
    };
  }, [autoplayAtivo, fotos.length, velocidadeTimelapse]);

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

    const statusTelemetrico =
      porcentagemAgua === 0
        ? "Seca Critica"
        : porcentagemAgua <= 25
          ? "Reserva Baixa"
          : "Nivel Estavel";

    const corTelemetria =
      porcentagemAgua === 0
        ? "#D94841"
        : porcentagemAgua <= 25
          ? "#D39A2C"
          : "#1B80C4";

    return {
      porcentagemAgua,
      statusTelemetrico,
      corTelemetria,
    };
  }, [planta]);

  const vitalidadeAtual = planta?.vitalidade || "estavel";
  const vitalidadeConfig = {
    prosperando: {
      label: "Prosperando",
      cor: "#2F6F4E",
      icon: <WaterDropIcon sx={{ fontSize: 32, color: "#2F6F4E" }} />,
    },
    estavel: {
      label: "Estavel",
      cor: "#1B80C4",
      icon: <WaterDropIcon sx={{ fontSize: 32, color: "#1B80C4" }} />,
    },
    recuperacao: {
      label: "Em Recuperacao",
      cor: "#D39A2C",
      icon: <WarningAmberIcon sx={{ fontSize: 32, color: "#D39A2C" }} />,
    },
    critico: {
      label: "Critico",
      cor: "#D94841",
      icon: <WarningAmberIcon sx={{ fontSize: 32, color: "#D94841" }} />,
    },
  };
  const estadoVisual = vitalidadeConfig[vitalidadeAtual] ?? vitalidadeConfig.estavel;
  const necessidadeLuz = planta?.necessidade_luz ?? planta?.necessidadeLuz ?? planta?.luz ?? "Meia Sombra";
  const tipoSubstrato =
    planta?.tipo_substrato ?? planta?.tipoSubstrato ?? planta?.substrato ?? "Nao informado";
  const toxicidadePets = Boolean(planta?.eh_toxica ?? planta?.ehToxica ?? planta?.toxica ?? false);

  const luzVisual = useMemo(() => {
    const luzNormalizada = String(necessidadeLuz).toLowerCase();

    if (luzNormalizada.includes("sol")) {
      return {
        label: "Sol Pleno",
        icon: <WbSunnyIcon sx={{ color: "#E0B52C", fontSize: 26 }} />,
      };
    }

    if (luzNormalizada.includes("sombra")) {
      return {
        label: "Sombra",
        icon: <CloudIcon sx={{ color: "#9BA6B2", fontSize: 26 }} />,
      };
    }

    return {
      label: "Meia Sombra",
      icon: <BrightnessMediumIcon sx={{ color: "#D6C277", fontSize: 26 }} />,
    };
  }, [necessidadeLuz]);

  const tendencia24h = useMemo(() => {
    const clamp = (valor, min, max) => Math.min(max, Math.max(min, valor));
    const assinatura = String(planta?.id ?? "")
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const ajusteVitalidade =
      vitalidadeAtual === "prosperando"
        ? 6
        : vitalidadeAtual === "estavel"
          ? 2
          : vitalidadeAtual === "recuperacao"
            ? -4
            : -8;

    const base = clamp(Math.round(sinaisVitais.porcentagemAgua) + ajusteVitalidade, 6, 96);

    const pontos = Array.from({ length: 8 }, (_, index) => {
      const oscilacao = ((assinatura + index * 7) % 9) - 4;
      const tendencia = (index - 3.5) * (vitalidadeAtual === "critico" ? -2.1 : -1.1);
      return clamp(Math.round(base + oscilacao + tendencia), 3, 99);
    });

    const largura = 196;
    const altura = 58;
    const pontosSvg = pontos
      .map((valor, index) => {
        const x = (index / (pontos.length - 1)) * largura;
        const y = altura - (valor / 100) * altura;
        return `${x},${y}`;
      })
      .join(" ");

    return { pontos, pontosSvg, largura, altura };
  }, [planta?.id, sinaisVitais.porcentagemAgua, vitalidadeAtual]);

  const auraColor =
    sinaisVitais.statusTelemetrico === "Seca Critica"
      ? "rgba(217, 72, 65, 0.34)"
      : sinaisVitais.statusTelemetrico === "Reserva Baixa"
        ? "rgba(211, 154, 44, 0.3)"
        : "rgba(47, 111, 78, 0.34)";

  const ultimaFoto = fotos.length > 0 ? fotos[fotos.length - 1] : null;
  const dataUltimoRegistro = useMemo(
    () => extrairDataRegistro(ultimaFoto?.data_registro ?? ultimaFoto?.data_captura),
    [ultimaFoto?.data_captura, ultimaFoto?.data_registro],
  );
  const diasSemAtualizacao = useMemo(() => {
    if (!dataUltimoRegistro) {
      return null;
    }

    return Math.floor((Date.now() - dataUltimoRegistro.getTime()) / (1000 * 60 * 60 * 24));
  }, [dataUltimoRegistro]);

  const requerAtualizacaoMorfologica =
    !carregando &&
    !erro &&
    !carregandoFotos &&
    Boolean(planta?.id) &&
    (fotos.length === 0 || Number(diasSemAtualizacao) > 15);

  const janelaToleranciaTexto =
    fotos.length === 0
      ? "Sem registro fotografico"
      : `${diasSemAtualizacao} dia${diasSemAtualizacao === 1 ? "" : "s"} sem registro`;

  const handleCapturaMissao = async (fotoBase64) => {
    if (!planta?.id || !fotoBase64) {
      setErroFoto("Nao foi possivel concluir a captura morfologica.");
      return;
    }

    setErroFoto("");
    setSalvandoFoto(true);

    const dataHoraLocalBr = new Date().toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
      hour12: false,
    });

    const fotoLocal = {
      id: `local-${Date.now()}`,
      url: fotoBase64,
      data_registro: new Date().toISOString(),
      data_registro_local: dataHoraLocalBr,
      nota: "Atualizacao morfologica via scanner QR",
    };

    try {
      await addDoc(collection(db, "fotos"), {
        planta_id: planta.id,
        url: fotoBase64,
        data_registro: serverTimestamp(),
        data_registro_local: dataHoraLocalBr,
        nota: "Atualizacao morfologica via scanner QR",
      });
      await adicionarFotoGaleriaPlanta(planta.id, fotoBase64);
      setFotos((prev) => {
        const proximo = ordenarFotosPorDataAsc([...prev, fotoLocal]);
        setIndexFoto(proximo.length - 1);
        return proximo;
      });
      setScannerOpen(false);
    } catch (error) {
      console.error("Falha ao registrar missao morfologica:", error);
      setErroFoto("Falha ao salvar a nova foto morfologica.");
    } finally {
      setSalvandoFoto(false);
    }
  };

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
      {requerAtualizacaoMorfologica && (
        <Button
          variant="contained"
          color="info"
          startIcon={<CameraAltIcon />}
          onClick={() => setScannerOpen(true)}
          disabled={salvandoFoto}
          sx={{
            position: "fixed",
            top: 12,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 12,
            minHeight: 50,
            px: 2,
            borderRadius: 0,
            border: "1px solid rgba(232,224,213,0.32)",
            backgroundColor: "info.main",
            color: "#EAF5FF",
            boxShadow: "0 0 16px rgba(27,128,196,0.48)",
            animation: "missaoPulse 1.3s ease-in-out infinite",
            "@keyframes missaoPulse": {
              "0%": { boxShadow: "0 0 8px rgba(27,128,196,0.35)" },
              "50%": { boxShadow: "0 0 20px rgba(27,128,196,0.8)" },
              "100%": { boxShadow: "0 0 8px rgba(27,128,196,0.35)" },
            },
            "&:hover": {
              backgroundColor: "#2A96DD",
            },
          }}
        >
          <Stack spacing={0.1} alignItems="flex-start">
            <Typography
              sx={{
                fontSize: { xs: "0.73rem", sm: "0.8rem" },
                fontWeight: 700,
                letterSpacing: "0.06em",
                lineHeight: 1.12,
                textAlign: "left",
              }}
            >
              [ 📸 REQUER ATUALIZAÇÃO MORFOLÓGICA ]
            </Typography>
            <Typography
              sx={{
                fontSize: "0.68rem",
                letterSpacing: "0.03em",
                opacity: 0.95,
                textAlign: "left",
                fontFamily: '"Share Tech Mono", monospace',
              }}
            >
              {janelaToleranciaTexto}
            </Typography>
          </Stack>
        </Button>
      )}

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

              <Grid container spacing={1.6} sx={{ textAlign: "left" }}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Box
                    sx={{
                      minHeight: 192,
                      p: 2,
                      border: "1px solid rgba(232, 224, 213, 0.2)",
                      borderTop: `2px solid ${estadoVisual.cor}`,
                      background: "rgba(12, 16, 20, 0.58)",
                      backdropFilter: "blur(6px)",
                      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.25)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "rgba(232,224,213,0.82)",
                        fontFamily: '"Share Tech Mono", monospace',
                        letterSpacing: "0.08em",
                      }}
                    >
                      DIAGNOSTICO FREMEN (VISUAL)
                    </Typography>

                    <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mt: 1.2 }}>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 1,
                          border: `1px solid ${estadoVisual.cor}`,
                          backgroundColor: "rgba(0,0,0,0.22)",
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        {estadoVisual.icon}
                      </Box>
                      <Typography
                        sx={{
                          color: estadoVisual.cor,
                          fontFamily: '"Share Tech Mono", monospace',
                          fontSize: "1.05rem",
                          letterSpacing: "0.04em",
                          textTransform: "uppercase",
                        }}
                      >
                        {estadoVisual.label}
                      </Typography>
                    </Stack>

                    <Box sx={{ mt: 1.2 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          color: "rgba(232,224,213,0.75)",
                          fontFamily: '"Share Tech Mono", monospace',
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                        }}
                      >
                        Evolucao nas ultimas 24h (simulada)
                      </Typography>
                      <Box
                        component="svg"
                        viewBox={`0 0 ${tendencia24h.largura} ${tendencia24h.altura}`}
                        sx={{ width: "100%", mt: 0.7 }}
                      >
                        <polyline
                          points={tendencia24h.pontosSvg}
                          fill="none"
                          stroke={estadoVisual.cor}
                          strokeWidth="2.2"
                          strokeLinecap="square"
                        />
                      </Box>
                    </Box>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Box
                    sx={{
                      minHeight: 192,
                      p: 2,
                      border: "1px solid rgba(232, 224, 213, 0.2)",
                      borderTop: `2px solid ${sinaisVitais.corTelemetria}`,
                      background: "rgba(12, 16, 20, 0.58)",
                      backdropFilter: "blur(6px)",
                      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.25)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "rgba(232,224,213,0.82)",
                        fontFamily: '"Share Tech Mono", monospace',
                        letterSpacing: "0.08em",
                      }}
                    >
                      LEITURA DE SENSORES (AGUA)
                    </Typography>

                    <Box sx={{ mt: 1.3 }}>
                      <LinearProgress
                        variant="determinate"
                        value={sinaisVitais.porcentagemAgua}
                        sx={{
                          height: 16,
                          borderRadius: 0,
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                          border: "1px solid rgba(232, 224, 213, 0.2)",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: sinaisVitais.corTelemetria,
                            backgroundImage:
                              sinaisVitais.statusTelemetrico === "Seca Critica"
                                ? "repeating-linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.2) 8px, transparent 8px, transparent 16px)"
                                : "none",
                          },
                        }}
                      />
                      <Typography
                        sx={{
                          mt: 1,
                          color: sinaisVitais.corTelemetria,
                          fontFamily: '"Share Tech Mono", monospace',
                          fontSize: "1.3rem",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {Math.round(sinaisVitais.porcentagemAgua)}%
                      </Typography>
                      <Typography
                        sx={{
                          mt: 0.4,
                          color: "rgba(232,224,213,0.9)",
                          fontFamily: '"Share Tech Mono", monospace',
                          textTransform: "uppercase",
                        }}
                      >
                        {sinaisVitais.statusTelemetrico}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              <Stack
                direction="row"
                spacing={1.2}
                sx={{
                  flexWrap: "wrap",
                  justifyContent: "center",
                  rowGap: 1.2,
                }}
              >
                <Box
                  sx={{
                    minHeight: 62,
                    minWidth: 164,
                    px: 1.4,
                    py: 1.1,
                    border: "1px solid rgba(232,224,213,0.2)",
                    backgroundColor: "rgba(0,0,0,0.4)",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  {luzVisual.icon}
                  <Box>
                    <Typography sx={{ color: "rgba(232,224,213,0.78)", fontSize: "0.72rem" }}>
                      LUZ
                    </Typography>
                    <Typography sx={{ color: "#E8E0D5", fontSize: "0.9rem" }}>{luzVisual.label}</Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    minHeight: 62,
                    minWidth: 164,
                    px: 1.4,
                    py: 1.1,
                    border: "1px solid rgba(232,224,213,0.2)",
                    backgroundColor: "rgba(0,0,0,0.4)",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <TerrainIcon sx={{ color: "#8E6A48", fontSize: 26 }} />
                  <Box>
                    <Typography sx={{ color: "rgba(232,224,213,0.78)", fontSize: "0.72rem" }}>
                      SUBSTRATO
                    </Typography>
                    <Typography sx={{ color: "#E8E0D5", fontSize: "0.9rem" }}>{tipoSubstrato}</Typography>
                  </Box>
                </Box>

                {toxicidadePets ? (
                  <Box
                    sx={{
                      minHeight: 62,
                      minWidth: 184,
                      px: 1.4,
                      py: 1.1,
                      border: "1px solid rgba(217,72,65,0.82)",
                      backgroundColor: "rgba(0,0,0,0.4)",
                      display: "flex",
                      alignItems: "center",
                      gap: 0.8,
                    }}
                  >
                    <WarningIcon sx={{ color: "#D94841", fontSize: 24 }} />
                    <PetsIcon sx={{ color: "#D94841", fontSize: 23 }} />
                    <Typography sx={{ color: "#E8E0D5", fontWeight: 700, fontSize: "0.9rem" }}>
                      TOXICA
                    </Typography>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      minHeight: 62,
                      minWidth: 184,
                      px: 1.4,
                      py: 1.1,
                      border: "1px solid rgba(89,166,107,0.62)",
                      backgroundColor: "rgba(0,0,0,0.4)",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <PetsIcon sx={{ color: "#59A66B", fontSize: 24 }} />
                    <Typography sx={{ color: "#E8E0D5", fontSize: "0.9rem" }}>
                      Segura para Pets
                    </Typography>
                  </Box>
                )}
              </Stack>

              {carregandoFotos && (
                <Typography
                  sx={{
                    color: "rgba(232,224,213,0.75)",
                    fontFamily: '"Share Tech Mono", monospace',
                  }}
                >
                  Carregando timelapse botanico...
                </Typography>
              )}

              {fotos.length > 0 && (
                <Stack spacing={1.1} sx={{ width: "100%", maxWidth: 560, mx: "auto" }}>
                  <Box
                    sx={{
                      position: "relative",
                      border: "1px solid rgba(100, 70, 40, 0.3)",
                      backgroundColor: "rgba(0, 0, 0, 0.42)",
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        zIndex: 1,
                        px: 1,
                        py: 0.45,
                        border: "1px solid rgba(232,224,213,0.36)",
                        backgroundColor: "rgba(7, 11, 15, 0.72)",
                        color: "#E8E0D5",
                        fontFamily: '"Share Tech Mono", monospace',
                        fontSize: "0.74rem",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {indexFoto + 1}/{fotos.length}
                      {autoplayAtivo ? " • AUTO" : ""}
                    </Box>

                    <Box
                      component="img"
                      key={fotos[indexFoto]?.id ?? fotos[indexFoto]?.url}
                      src={fotos[indexFoto]?.url}
                      alt="Registro fotografico da planta"
                      sx={{
                        width: "100%",
                        height: { xs: 220, sm: 300 },
                        objectFit: "cover",
                        opacity: 1,
                        transition: "opacity 320ms ease-in-out",
                      }}
                    />
                  </Box>

                  <Typography
                    sx={{
                      color: "rgba(232,224,213,0.88)",
                      fontFamily: '"Share Tech Mono", monospace',
                      fontSize: "0.88rem",
                    }}
                  >
                    {formatarDataRegistroCurta(
                      fotos[indexFoto]?.data_registro ?? fotos[indexFoto]?.data_captura,
                      fotos[indexFoto]?.data_registro_local,
                    )}
                  </Typography>

                  {fotos.length > 1 && (
                    <Stack spacing={1.1}>
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1}
                        justifyContent="space-between"
                      >
                        <Button
                          variant={autoplayAtivo ? "contained" : "outlined"}
                          color="info"
                          startIcon={autoplayAtivo ? <PauseIcon /> : <PlayArrowIcon />}
                          onClick={() => setAutoplayAtivo((valor) => !valor)}
                          sx={{ minWidth: { xs: "100%", sm: 190 } }}
                        >
                          {autoplayAtivo ? "Pausar Timelapse" : "Iniciar Timelapse"}
                        </Button>

                        <Select
                          size="small"
                          value={velocidadeTimelapse}
                          onChange={(event) => setVelocidadeTimelapse(Number(event.target.value))}
                          sx={{
                            minWidth: { xs: "100%", sm: 165 },
                            "& .MuiSelect-select": {
                              fontFamily: '"Share Tech Mono", monospace',
                            },
                          }}
                        >
                          <MenuItem value={800}>Velocidade: Rapida</MenuItem>
                          <MenuItem value={1400}>Velocidade: Media</MenuItem>
                          <MenuItem value={2200}>Velocidade: Lenta</MenuItem>
                        </Select>
                      </Stack>

                      <Slider
                        min={0}
                        max={fotos.length - 1}
                        step={1}
                        value={indexFoto}
                        onChange={(_event, valor) => setIndexFoto(Number(valor))}
                        sx={{
                          color: "#D39A2C",
                          "& .MuiSlider-rail": {
                            backgroundColor: "rgba(0,0,0,0.62)",
                            opacity: 1,
                            border: "1px solid rgba(90, 64, 36, 0.45)",
                          },
                          "& .MuiSlider-track": {
                            backgroundColor: "#1B80C4",
                            border: "none",
                          },
                          "& .MuiSlider-thumb": {
                            width: 18,
                            height: 18,
                            borderRadius: 0,
                            backgroundColor: "#D39A2C",
                            border: "2px solid #E8E0D5",
                            boxShadow: "0 0 0 2px rgba(211,154,44,0.25)",
                          },
                        }}
                      />
                    </Stack>
                  )}
                </Stack>
              )}

              <Typography
                sx={{
                  color: "#E8E0D5",
                  fontFamily: '"Share Tech Mono", monospace',
                }}
              >
                Clima: {climaAtual ? `${climaAtual.temperatura}°C / ${climaAtual.umidade}%` : "Sinal indisponível"}
              </Typography>

              {erroFoto && (
                <Alert severity="error" sx={{ textAlign: "left" }}>
                  {erroFoto}
                </Alert>
              )}
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

      <CameraScanner
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        ultimaFotoUrl={ultimaFoto?.url ?? ""}
        onCapture={(fotoBase64) => {
          void handleCapturaMissao(fotoBase64);
        }}
      />
    </Box>
  );
}

export default PlantView;