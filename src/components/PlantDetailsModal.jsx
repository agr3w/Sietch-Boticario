import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Box,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  Slider,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import EditNoteIcon from "@mui/icons-material/EditNote";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import CloseIcon from "@mui/icons-material/Close";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { QRCode } from "react-qr-code";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import { AnimatePresence, motion } from "framer-motion";
import CameraScanner from "./CameraScanner";
import {
  adicionarFotoGaleriaPlanta,
  adicionarNotaManual,
  getHistoricoFotos,
  getHistoricoPlanta,
  setMarcoFoto,
} from "../firebase";

const placeholderFantasma =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Epipremnum_aureum_31082012.jpg/800px-Epipremnum_aureum_31082012.jpg";

const vitalidadeConfig = {
  prosperando: { cor: "#345A14", label: "Prosperando" },
  estavel: { cor: "#1B80C4", label: "Estavel" },
  recuperacao: { cor: "#C48A31", label: "Em Recuperacao" },
  critico: { cor: "#9E3D22", label: "Critico" },
};

function formatarDataBr(dataEnvio) {
  if (!dataEnvio) {
    return "Sem data";
  }

  if (typeof dataEnvio?.toDate === "function") {
    return dataEnvio.toDate().toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    });
  }

  if (typeof dataEnvio?.seconds === "number") {
    return new Date(dataEnvio.seconds * 1000).toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    });
  }

  const date = new Date(dataEnvio);
  if (Number.isFinite(date.getTime())) {
    return date.toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    });
  }

  return "Sem data";
}

function obterDataRega(ultimaRega) {
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

function normalizarBadgeSlug(valor) {
  return String(valor ?? "")
    .trim()
    .toLowerCase();
}

function obterBadgesFoto(foto) {
  const marcoComoBadge = normalizarTipoMarco(foto?.marco);

  if (Array.isArray(foto?.badges) && foto.badges.length > 0) {
    const badges = [
      ...new Set(
        foto.badges
          .filter((badge) => typeof badge === "string")
          .map((badge) => normalizarBadgeSlug(badge))
          .filter(Boolean),
      ),
    ];

    if (marcoComoBadge && !badges.includes(marcoComoBadge)) {
      badges.push(marcoComoBadge);
    }

    return badges;
  }

  const badgeLegado = normalizarBadgeSlug(foto?.status_emocional ?? foto?.statusEmocional ?? "");
  const badges = badgeLegado ? [badgeLegado] : [];

  if (marcoComoBadge && !badges.includes(marcoComoBadge)) {
    badges.push(marcoComoBadge);
  }

  return badges;
}

function formatarBadgeLabel(badgeSlug) {
  return badgeSlug
    .split(" ")
    .filter(Boolean)
    .map((parte) => parte.charAt(0).toUpperCase() + parte.slice(1))
    .join(" ");
}

function normalizarTipoMarco(valor) {
  return String(valor ?? "").trim().toLowerCase();
}

function hexParaRgba(hexColor, alpha) {
  const hex = String(hexColor ?? "").replace("#", "");
  if (hex.length !== 6) {
    return `rgba(126, 195, 241, ${alpha})`;
  }

  const r = Number.parseInt(hex.slice(0, 2), 16);
  const g = Number.parseInt(hex.slice(2, 4), 16);
  const b = Number.parseInt(hex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getVitalidadeFrameConfig(vitalidadeAtual) {
  if (vitalidadeAtual === "prosperando") {
    return {
      borderColor: "#58D68D",
      glow: "rgba(88, 214, 141, 0.55)",
      label: "Prosperando",
    };
  }

  if (vitalidadeAtual === "recuperacao") {
    return {
      borderColor: "#E2A72E",
      glow: "rgba(226, 167, 46, 0.5)",
      label: "Recuperacao",
    };
  }

  if (vitalidadeAtual === "critico") {
    return {
      borderColor: "#EB4E5A",
      glow: "rgba(235, 78, 90, 0.58)",
      label: "Critico",
    };
  }

  return {
    borderColor: "#7EC3F1",
    glow: "rgba(126, 195, 241, 0.48)",
    label: "Estavel",
  };
}

function getMarcoFrameConfig(marcoAtual) {
  if (marcoAtual === "nascimento") {
    return {
      borderColor: "#7EC3F1",
      glow: "rgba(126, 195, 241, 0.56)",
    };
  }

  if (marcoAtual === "crescimento") {
    return {
      borderColor: "#5FC88A",
      glow: "rgba(95, 200, 138, 0.56)",
    };
  }

  if (marcoAtual === "memorial") {
    return {
      borderColor: "#D39A2C",
      glow: "rgba(211, 154, 44, 0.56)",
    };
  }

  return null;
}

function FotoMiniaturaHud({ foto, ativa, onSelecionar }) {
  const marcoFoto = normalizarTipoMarco(foto?.marco);
  const ehNascimento = marcoFoto === "nascimento";
  const ehMemorial = marcoFoto === "memorial";
  const vitalidadeMiniatura = String(foto?.vitalidade ?? "")
    .trim()
    .toLowerCase();
  const vitalidadeMiniaturaConfig =
    vitalidadeConfig[vitalidadeMiniatura] ?? vitalidadeConfig.estavel;

  return (
    <Box
      role="button"
      tabIndex={0}
      aria-label="Selecionar foto da linha do tempo"
      onClick={onSelecionar}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelecionar?.();
        }
      }}
      sx={{
        position: "relative",
        width: { xs: 86, sm: 96 },
        height: { xs: 86, sm: 96 },
        border: "1px solid",
        borderColor: ehMemorial
          ? "secondary.main"
          : ativa
            ? "info.main"
            : "rgba(126, 195, 241, 0.34)",
        clipPath:
          "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
        cursor: "pointer",
        overflow: "hidden",
        transition: "border-color 180ms ease, transform 180ms ease",
        transform: ativa ? "translateY(-1px)" : "none",
        boxShadow: ativa ? `0 0 10px ${hexParaRgba(vitalidadeMiniaturaConfig.cor, 0.52)}` : "none",
        "&:hover": {
          borderColor: "info.main",
        },
        "&:focus-visible": {
          outline: "3px solid #7EC3F1",
          outlineOffset: 2,
          borderColor: "#7EC3F1",
          boxShadow: "0 0 0 2px rgba(5,10,14,0.86), 0 0 0 5px rgba(126,195,241,0.55)",
        },
      }}
    >
      <Box
        component="img"
        src={foto?.url}
        alt="Miniatura tática da galeria"
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: ativa ? "none" : "saturate(0.85) contrast(1.02)",
        }}
      />

      {ehNascimento && (
        <Box
          component="span"
          sx={{
            position: "absolute",
            top: 6,
            left: 8,
            zIndex: 3,
            color: "info.main",
            fontSize: "0.92rem",
            lineHeight: 1,
            textShadow: "0 0 8px rgba(126, 195, 241, 0.65)",
          }}
        >
          ♦
        </Box>
      )}

      <Box
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 4,
          backgroundColor: vitalidadeMiniaturaConfig.cor,
          boxShadow: `0 0 10px ${hexParaRgba(vitalidadeMiniaturaConfig.cor, 0.6)}`,
          zIndex: 2,
        }}
      />
    </Box>
  );
}

function PlantDetailsModal({ planta, open, onClose, onUpdate, onDelete }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const mentatMonoSx = {
    fontFamily: '"Share Tech Mono", monospace',
    letterSpacing: "0.03em",
  };
  const [abaAtiva, setAbaAtiva] = useState(0);
  const [historico, setHistorico] = useState([]);
  const [carregandoHistorico, setCarregandoHistorico] = useState(false);
  const [notificarWhatsapp, setNotificarWhatsapp] = useState(Boolean(planta?.notificar));
  const [intervaloRega, setIntervaloRega] = useState(planta?.intervalo_rega_dias ?? 1);
  const [luz, setLuz] = useState(
    planta?.necessidade_luz ?? planta?.necessidadeLuz ?? "Meia Sombra",
  );
  const [substrato, setSubstrato] = useState(
    planta?.tipo_substrato ?? planta?.tipoSubstrato ?? "",
  );
  const [vitalidade, setVitalidade] = useState(planta?.vitalidade ?? "estavel");
  const [toxica, setToxica] = useState(
    Boolean(planta?.eh_toxica ?? planta?.ehToxica ?? false),
  );
  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [notaManual, setNotaManual] = useState("");
  const [salvandoNota, setSalvandoNota] = useState(false);
  const [statusCopiaQr, setStatusCopiaQr] = useState("idle");
  const [confirmarExclusaoOpen, setConfirmarExclusaoOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [salvandoFoto, setSalvandoFoto] = useState(false);
  const [galeriaFotos, setGaleriaFotos] = useState([]);
  const [fotosTimelapse, setFotosTimelapse] = useState([]);
  const [carregandoFotos, setCarregandoFotos] = useState(false);
  const [indexFoto, setIndexFoto] = useState(0);
  const [autoplayAtivo, setAutoplayAtivo] = useState(false);
  const [velocidadeTimelapse, setVelocidadeTimelapse] = useState(1400);
  const [erroFoto, setErroFoto] = useState("");
  const [filtroBadgeAtivo, setFiltroBadgeAtivo] = useState("todas");
  const [salvandoMarco, setSalvandoMarco] = useState(false);
  const [erroMarco, setErroMarco] = useState("");
  const vitalidadeAtualConfig =
    vitalidadeConfig[vitalidade] ?? vitalidadeConfig.estavel;
  const ultimaFotoReferenciaUrl =
    fotosTimelapse[fotosTimelapse.length - 1]?.url ??
    galeriaFotos[galeriaFotos.length - 1]?.url ??
    placeholderFantasma;
  const badgesDisponiveis = useMemo(() => {
    const badges = fotosTimelapse.flatMap((foto) => obterBadgesFoto(foto));
    return [...new Set(badges)].sort((a, b) => a.localeCompare(b));
  }, [fotosTimelapse]);
  const fotosTimelapseVisiveis = useMemo(() => {
    if (filtroBadgeAtivo === "todas") {
      return fotosTimelapse;
    }
    return fotosTimelapse.filter((foto) => obterBadgesFoto(foto).includes(filtroBadgeAtivo));
  }, [filtroBadgeAtivo, fotosTimelapse]);
  const fotoAtualTimelapse = fotosTimelapseVisiveis[indexFoto] ?? null;
  const badgesFotoAtual = useMemo(
    () => obterBadgesFoto(fotoAtualTimelapse),
    [fotoAtualTimelapse],
  );
  const statusEmocionalAtual = String(
    fotoAtualTimelapse?.status_emocional ?? fotoAtualTimelapse?.statusEmocional ?? "",
  )
    .trim()
    .toLowerCase();
  const marcoAtualFoto = normalizarTipoMarco(fotoAtualTimelapse?.marco);
  const vitalidadeHistorica = useMemo(() => {
    const chave = String(fotoAtualTimelapse?.vitalidade ?? "")
      .trim()
      .toLowerCase();
    return vitalidadeConfig[chave] ? chave : "estavel";
  }, [fotoAtualTimelapse?.vitalidade]);
  const vitalidadeHistoricaConfig = vitalidadeConfig[vitalidadeHistorica] ?? vitalidadeConfig.estavel;
  const ehNascimentoAtual =
    badgesFotoAtual.includes("nascimento") ||
    statusEmocionalAtual === "nascimento" ||
    marcoAtualFoto === "nascimento";
  const ehMemorialAtual = marcoAtualFoto === "memorial";
  const frameVitalidadeConfig = getVitalidadeFrameConfig(vitalidade);

  useEffect(() => {
    setNotificarWhatsapp(Boolean(planta?.notificar));
    setIntervaloRega(planta?.intervalo_rega_dias ?? 1);
    setLuz(planta?.necessidade_luz ?? planta?.necessidadeLuz ?? "Meia Sombra");
    setSubstrato(planta?.tipo_substrato ?? planta?.tipoSubstrato ?? "");
    setVitalidade(planta?.vitalidade || "estavel");
    setToxica(Boolean(planta?.eh_toxica ?? planta?.ehToxica ?? false));
    setSalvando(false);
    setExcluindo(false);
    setNotaManual("");
    setSalvandoNota(false);
    setStatusCopiaQr("idle");
    setConfirmarExclusaoOpen(false);
    setScannerOpen(false);
    setSalvandoFoto(false);
    setErroFoto("");
    setCarregandoFotos(false);
    setIndexFoto(0);
    setAutoplayAtivo(false);
    setVelocidadeTimelapse(1400);
    setFiltroBadgeAtivo("todas");
    setSalvandoMarco(false);
    setErroMarco("");
    setGaleriaFotos(
      Array.isArray(planta?.galeria_fotos)
        ? planta.galeria_fotos
        : Array.isArray(planta?.galeriaFotos)
          ? planta.galeriaFotos
          : [],
    );
    const fallbackGaleria =
      Array.isArray(planta?.galeria_fotos)
        ? planta.galeria_fotos
        : Array.isArray(planta?.galeriaFotos)
          ? planta.galeriaFotos
          : [];
    setFotosTimelapse(ordenarFotosPorDataAsc(fallbackGaleria));
  }, [
    open,
    planta?.id,
    planta?.intervalo_rega_dias,
    planta?.notificar,
    planta?.necessidade_luz,
    planta?.necessidadeLuz,
    planta?.tipo_substrato,
    planta?.tipoSubstrato,
    planta?.vitalidade,
    planta?.galeria_fotos,
    planta?.galeriaFotos,
    planta?.eh_toxica,
    planta?.ehToxica,
  ]);

  useEffect(() => {
    if (filtroBadgeAtivo === "todas") {
      return;
    }

    if (!badgesDisponiveis.includes(filtroBadgeAtivo)) {
      setFiltroBadgeAtivo("todas");
    }
  }, [badgesDisponiveis, filtroBadgeAtivo]);

  useEffect(() => {
    if (!open || !planta?.id || !planta?.userId) {
      setFotosTimelapse([]);
      return;
    }

    let ativo = true;

    const carregarHistoricoFotos = async () => {
      try {
        setCarregandoFotos(true);
        const fotosHistorico = await getHistoricoFotos(planta.id, planta.userId);
        if (!ativo) {
          return;
        }

        if (fotosHistorico.length > 0) {
          setFotosTimelapse(ordenarFotosPorDataAsc(fotosHistorico));
        } else {
          setFotosTimelapse(ordenarFotosPorDataAsc(galeriaFotos));
        }
      } catch (error) {
        console.error("Erro ao carregar histórico de fotos:", error);
        if (ativo) {
          setFotosTimelapse(ordenarFotosPorDataAsc(galeriaFotos));
        }
      } finally {
        if (ativo) {
          setCarregandoFotos(false);
        }
      }
    };

    void carregarHistoricoFotos();

    return () => {
      ativo = false;
    };
  }, [open, planta?.id, planta?.userId, galeriaFotos]);

  useEffect(() => {
    setIndexFoto((valorAtual) => {
      if (fotosTimelapseVisiveis.length === 0) {
        return 0;
      }

      return Math.min(valorAtual, fotosTimelapseVisiveis.length - 1);
    });
  }, [fotosTimelapseVisiveis.length]);

  useEffect(() => {
    if (abaAtiva !== 3) {
      setAutoplayAtivo(false);
    }
  }, [abaAtiva]);

  useEffect(() => {
    if (!autoplayAtivo || fotosTimelapseVisiveis.length <= 1) {
      return;
    }

    const intervalId = setInterval(() => {
      setIndexFoto((valorAtual) =>
        valorAtual >= fotosTimelapseVisiveis.length - 1 ? 0 : valorAtual + 1,
      );
    }, velocidadeTimelapse);

    return () => {
      clearInterval(intervalId);
    };
  }, [autoplayAtivo, fotosTimelapseVisiveis.length, velocidadeTimelapse]);

  const qrCodeValue = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/planta/${planta?.id ?? ""}`;
  }, [planta?.id]);

  useEffect(() => {
    if (!open || !planta?.id || !planta?.userId) {
      setHistorico([]);
      return;
    }

    let ativo = true;

    const carregarHistorico = async () => {
      try {
        setCarregandoHistorico(true);
        const mensagens = await getHistoricoPlanta(planta.id, planta.userId);

        if (ativo) {
          setHistorico(mensagens);
        }
      } catch (error) {
        console.error("Erro ao buscar histórico do Firebase:", error);
        if (ativo) {
          setHistorico([]);
        }
      } finally {
        if (ativo) {
          setCarregandoHistorico(false);
        }
      }
    };

    void carregarHistorico();

    return () => {
      ativo = false;
    };
  }, [open, planta?.id, planta?.userId]);

  const resumoRega = useMemo(() => {
    const intervalo = Number(planta?.intervalo_rega_dias ?? 0);
    const dataUltimaRega = obterDataRega(planta?.ultima_rega);

    if (!dataUltimaRega || intervalo <= 0) {
      return {
        diasParaRegar: "N/A",
        ultimaRega: dataUltimaRega
          ? dataUltimaRega.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
          : "Sem registro",
      };
    }

    const diasDesdeRega = Math.floor((Date.now() - dataUltimaRega.getTime()) / (1000 * 60 * 60 * 24));
    const diasRestantes = intervalo - diasDesdeRega;

    return {
      diasParaRegar:
        diasRestantes > 0
          ? `${diasRestantes} dia${diasRestantes === 1 ? "" : "s"}`
          : "Regar hoje",
      ultimaRega: dataUltimaRega.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }),
    };
  }, [planta?.intervalo_rega_dias, planta?.ultima_rega]);

  const diasReadoutCritico = resumoRega.diasParaRegar === "Regar hoje";

  const handleSalvar = async () => {
    if (!planta?.id || typeof onUpdate !== "function") {
      return;
    }

    setSalvando(true);
    try {
      await onUpdate(planta.id, {
        notificar: notificarWhatsapp,
        intervalo_rega_dias: Number(intervaloRega),
        necessidade_luz: luz,
        tipo_substrato: substrato,
        vitalidade,
        eh_toxica: toxica,
      });
      onClose?.();
    } finally {
      setSalvando(false);
    }
  };

  const handleAdicionarNota = async () => {
    const textoLimpo = notaManual.trim();
    if (!textoLimpo || !planta?.id) {
      return;
    }

    const notaTemporaria = {
      id: `tmp-${Date.now()}`,
      planta_nome: planta?.nome_apelido ?? "Planta",
      mensagem: textoLimpo,
      tipo: "manual",
      nivel_alerta: 0,
      data_envio: new Date(),
    };

    setHistorico((prev) => [notaTemporaria, ...prev]);
    setNotaManual("");
    setSalvandoNota(true);

    try {
      await adicionarNotaManual(
        planta.id,
        textoLimpo,
        planta?.nome_apelido ?? "Planta",
        planta?.userId,
      );
      const historicoAtualizado = await getHistoricoPlanta(planta.id, planta.userId);
      setHistorico(historicoAtualizado);
    } catch (error) {
      console.error("Erro ao adicionar nota manual:", error);
      setHistorico((prev) => prev.filter((item) => item.id !== notaTemporaria.id));
      setNotaManual(textoLimpo);
    } finally {
      setSalvandoNota(false);
    }
  };

  const handleExcluirPlanta = async () => {
    if (!planta?.id || typeof onDelete !== "function") {
      return;
    }

    setConfirmarExclusaoOpen(true);
  };

  const handleCancelarExclusao = () => {
    if (excluindo) {
      return;
    }

    setConfirmarExclusaoOpen(false);
  };

  const handleConfirmarExclusao = async () => {
    if (!planta?.id || typeof onDelete !== "function") {
      return;
    }

    setExcluindo(true);
    try {
      const exclusaoConcluida = await onDelete(planta.id);
      if (exclusaoConcluida === false) {
        return;
      }

      setConfirmarExclusaoOpen(false);
      onClose?.();
    } finally {
      setExcluindo(false);
    }
  };

  const handleCopiarLinkQr = async () => {
    if (!planta?.id) {
      setStatusCopiaQr("error");
      return;
    }

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(qrCodeValue);
      } else {
        const tempInput = document.createElement("textarea");
        tempInput.value = qrCodeValue;
        tempInput.setAttribute("readonly", "");
        tempInput.style.position = "absolute";
        tempInput.style.left = "-9999px";
        document.body.appendChild(tempInput);
        tempInput.select();
        const copiou = document.execCommand("copy");
        document.body.removeChild(tempInput);

        if (!copiou) {
          throw new Error("Falha ao copiar link do QR");
        }
      }

      setStatusCopiaQr("success");
    } catch (error) {
      console.error("Erro ao copiar link do QR:", error);
      setStatusCopiaQr("error");
    }
  };

  const handleCapturarFoto = async (imagemUrl) => {
    if (!planta?.id || !imagemUrl) {
      setErroFoto("Nao foi possivel capturar a imagem.");
      return;
    }

    const dataHoraLocalBr = new Date().toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
      hour12: false,
    });

    const fotoTemporaria = {
      id: `tmp-${Date.now()}`,
      url: imagemUrl,
      origem: "scanner",
      vitalidade,
      data_captura: new Date().toISOString(),
      data_registro: new Date().toISOString(),
      data_registro_local: dataHoraLocalBr,
      badges: [],
    };

    setErroFoto("");
    setSalvandoFoto(true);
    setGaleriaFotos((prev) => [fotoTemporaria, ...prev]);

    try {
      const resultado = await adicionarFotoGaleriaPlanta(planta.id, imagemUrl, vitalidade);
      const fotoPersistida = {
        id: resultado?.id ?? `foto-${Date.now()}`,
        url: imagemUrl,
        origem: "scanner",
        vitalidade,
        data_captura: new Date().toISOString(),
        data_registro: new Date().toISOString(),
        data_registro_local: dataHoraLocalBr,
        badges: [],
      };
      setGaleriaFotos((prev) => [
        fotoPersistida,
        ...prev.filter((foto) => foto.id !== fotoTemporaria.id),
      ]);
      setFotosTimelapse((prev) =>
        ordenarFotosPorDataAsc([
          ...prev.filter((foto) => foto.id !== fotoTemporaria.id),
          fotoPersistida,
        ]),
      );
      setScannerOpen(false);
    } catch (error) {
      console.error("Erro ao salvar captura na galeria:", error);
      setGaleriaFotos((prev) => prev.filter((foto) => foto.id !== fotoTemporaria.id));
      setErroFoto("Falha ao salvar a captura no prontuario.");
    } finally {
      setSalvandoFoto(false);
    }
  };

  const atualizarMarcoEmMemoria = (fotoId, tipoMarco) => {
    setFotosTimelapse((prev) =>
      prev.map((foto) => (foto.id === fotoId ? { ...foto, marco: tipoMarco } : foto)),
    );
    setGaleriaFotos((prev) =>
      prev.map((foto) => (foto.id === fotoId ? { ...foto, marco: tipoMarco } : foto)),
    );
  };

  const handleToggleMarco = async (novoMarco) => {
    if (!fotoAtualTimelapse?.id || !planta?.id) {
      return;
    }

    const fotoId = fotoAtualTimelapse.id;
    const tipoMarcoNormalizado = novoMarco ? normalizarTipoMarco(novoMarco) : null;
    const marcoAnterior = normalizarTipoMarco(fotoAtualTimelapse?.marco) || null;

    setErroMarco("");
    setSalvandoMarco(true);
    atualizarMarcoEmMemoria(fotoId, tipoMarcoNormalizado);

    try {
      await setMarcoFoto(fotoId, tipoMarcoNormalizado);
    } catch (error) {
      console.error("Erro ao definir marco da foto:", error);
      atualizarMarcoEmMemoria(fotoId, marcoAnterior);
      setErroMarco("Falha ao aplicar marco tatico nesta foto.");
    } finally {
      setSalvandoMarco(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          height: isMobile ? "100dvh" : undefined,
          m: isMobile ? 0 : undefined,
        },
      }}
    >
      <DialogTitle
        sx={{
          position: "relative",
          top: 0,
          zIndex: 2,
          overflow: "hidden",
          pr: { xs: 2, sm: 8 },
          pb: 1.2,
          borderBottom: "4px solid",
          borderColor: vitalidadeAtualConfig.cor,
          boxShadow: `inset 0 -10px 22px -16px ${hexParaRgba(vitalidadeAtualConfig.cor, 0.2)}`,
          textTransform: "uppercase",
          fontFamily: '"Rajdhani", sans-serif',
          letterSpacing: "0.1em",
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        <Button
          onClick={onClose}
          aria-label="Fechar prontuario"
          sx={{
            position: "absolute",
            right: { xs: 8, sm: 10 },
            top: { xs: 8, sm: 10 },
            minWidth: 36,
            width: 36,
            height: 36,
            p: 0,
            borderRadius: 1,
            color: "#E8E0D5",
            border: "1px solid rgba(232,224,213,0.3)",
            backgroundColor: "rgba(7, 10, 12, 0.32)",
            backdropFilter: "blur(3px)",
            "&:hover": {
              backgroundColor: "rgba(7, 10, 12, 0.56)",
              borderColor: "rgba(232,224,213,0.56)",
            },
            "&:focus-visible": {
              outline: "3px solid #7EC3F1",
              outlineOffset: 2,
              borderColor: "#7EC3F1",
              boxShadow: "0 0 0 2px rgba(7,10,12,0.92), 0 0 0 5px rgba(126,195,241,0.52)",
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </Button>
        <WaterDropIcon sx={{ color: "secondary.main" }} />
        <Box component="span">{planta?.nome_apelido ?? "Prontuário da Planta"}</Box>
        <Chip
          size="small"
          label={vitalidadeAtualConfig.label}
          sx={{
            ml: 0.8,
            height: 22,
            color: "#FFFFFF",
            backgroundColor: vitalidadeAtualConfig.cor,
            border: "1px solid rgba(255,255,255,0.18)",
            textTransform: "none",
          }}
        />
        <WaterDropIcon
          sx={{
            position: "absolute",
            right: -8,
            top: -10,
            fontSize: 66,
            opacity: 0.08,
            color: "info.main",
            pointerEvents: "none",
          }}
        />
      </DialogTitle>

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {!isMobile && (
          <Tabs
            value={abaAtiva}
            onChange={(_event, novaAba) => setAbaAtiva(novaAba)}
            aria-label="Abas do prontuário da planta"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              px: { xs: 1, sm: 3 },
              position: "sticky",
              top: 0,
              zIndex: 2,
              backgroundColor: "#E8EDE4",
              borderBottom: "1px solid rgba(61, 40, 16, 0.14)",
              "& .MuiTabs-indicator": {
                height: 3,
                backgroundColor: "primary.main",
              },
              "& .MuiTab-root": {
                minWidth: { xs: 126, sm: 140 },
                fontSize: { xs: "0.74rem", sm: "0.82rem" },
                px: { xs: 1.1, sm: 1.8 },
                whiteSpace: "nowrap",
                fontFamily: '"Rajdhani", sans-serif',
                fontWeight: 700,
                letterSpacing: "0.03em",
                color: "text.secondary",
                "&:hover": {
                  color: "primary.main",
                  backgroundColor: "rgba(13, 48, 40, 0.08)",
                },
                "&:focus-visible": {
                  outline: "3px solid #1B80C4",
                  outlineOffset: -2,
                  backgroundColor: "rgba(27, 128, 196, 0.12)",
                },
              },
              "& .Mui-selected": {
                color: "#0D3028 !important",
              },
            }}
          >
            <Tab label="Visão Geral" />
            <Tab label="Diário de Bordo" />
            <Tab label="Identificação" />
            <Tab label="Galeria" />
          </Tabs>
        )}

        <DialogContent
          dividers
          sx={{
            position: "relative",
            px: { xs: 1.25, sm: 3 },
            py: { xs: 1.25, sm: 2.2 },
            pb: { xs: 10, sm: 2.2 },
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              width: 20,
              height: 20,
              borderTop: "2px solid",
              borderLeft: "2px solid",
              borderColor: "secondary.main",
              opacity: 0.7,
              pointerEvents: "none",
            },
            "&::after": {
              content: '""',
              position: "absolute",
              right: 0,
              bottom: 0,
              width: 20,
              height: 20,
              borderBottom: "2px solid",
              borderRight: "2px solid",
              borderColor: "info.main",
              opacity: 0.7,
              pointerEvents: "none",
            },
          }}
        >
        <AnimatePresence mode="wait">
        {abaAtiva === 0 && (
          <motion.div
            key={0}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.2 }}
          >
          <Stack spacing={2.2}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 5 }}>
                <Box
                  sx={{
                    p: 1.5,
                    backgroundColor: "rgba(0,0,0,0.2)",
                    border: "1px solid rgba(211, 84, 0, 0.34)",
                    clipPath:
                      "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
                  }}
                >
                  <Typography variant="caption" sx={{ color: "secondary.main", letterSpacing: "0.08em" }}>
                    READOUT
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    Dias para regar
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={[
                      mentatMonoSx,
                      { color: diasReadoutCritico ? "secondary.main" : "info.main" },
                    ]}
                  >
                    {resumoRega.diasParaRegar}
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 7 }}>
                <Box
                  sx={{
                    p: 1.5,
                    backgroundColor: "rgba(0,0,0,0.2)",
                    border: "1px solid rgba(27, 128, 196, 0.34)",
                    clipPath:
                      "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
                  }}
                >
                  <Typography variant="caption" sx={{ color: "secondary.main", letterSpacing: "0.08em" }}>
                    READOUT
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    Última rega
                  </Typography>
                  <Typography variant="body1" sx={[mentatMonoSx, { color: "info.main" }]}>
                    {resumoRega.ultimaRega}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            <TextField
              label="Intervalo de rega (dias)"
              type="number"
              value={intervaloRega}
              onChange={(event) => setIntervaloRega(event.target.value)}
              slotProps={{ htmlInput: { min: 1 } }}
              sx={{ "& input": mentatMonoSx }}
              fullWidth
            />

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth>
                  <InputLabel id="necessidade-luz-geral-label">Necessidade de luz</InputLabel>
                  <Select
                    labelId="necessidade-luz-geral-label"
                    label="Necessidade de luz"
                    value={luz}
                    onChange={(event) => setLuz(event.target.value)}
                  >
                    <MenuItem value="Sol Pleno">Sol Pleno</MenuItem>
                    <MenuItem value="Meia Sombra">Meia Sombra</MenuItem>
                    <MenuItem value="Sombra">Sombra</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 5 }}>
                <TextField
                  label="Tipo de substrato"
                  value={substrato}
                  onChange={(event) => setSubstrato(event.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={toxica}
                      onChange={(event) => setToxica(event.target.checked)}
                    />
                  }
                  label="Tóxica para Pets"
                />
              </Grid>
            </Grid>

            <Stack spacing={1}>
              <Typography variant="subtitle2" color="text.secondary">
                Sinais Vitais
              </Typography>
              <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
                {Object.entries(vitalidadeConfig).map(([value, config]) => (
                  <Chip
                    key={value}
                    label={config.label}
                    variant={vitalidade === value ? "filled" : "outlined"}
                    onClick={() => setVitalidade(value)}
                    size="small"
                    sx={{
                      borderRadius: 1,
                      borderColor: config.cor,
                      color: vitalidade === value ? "#FFFFFF" : config.cor,
                      backgroundColor: vitalidade === value ? config.cor : "transparent",
                      fontWeight: 700,
                      letterSpacing: "0.03em",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor:
                          vitalidade === value
                            ? config.cor
                            : hexParaRgba(config.cor, 0.16),
                      },
                      "&:focus-visible": {
                        outline: "3px solid #7EC3F1",
                        outlineOffset: 2,
                        boxShadow: "0 0 0 2px rgba(7, 13, 18, 0.84)",
                      },
                    }}
                  />
                ))}
              </Stack>
            </Stack>

            <FormControlLabel
              control={
                <Switch
                  checked={notificarWhatsapp}
                  onChange={(event) => setNotificarWhatsapp(event.target.checked)}
                />
              }
              label="Notificar via WhatsApp"
            />

            <Stack spacing={1.4}>
              <Button
                variant="contained"
                onClick={handleSalvar}
                disabled={salvando || excluindo}
                fullWidth
              >
                {salvando ? "Salvando..." : "Salvar Alterações"}
              </Button>

              <Box
                sx={{
                  border: "1px dashed rgba(217, 72, 65, 0.55)",
                  backgroundColor: "rgba(217, 72, 65, 0.08)",
                  borderRadius: 1,
                  p: 1,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    mb: 0.8,
                    color: "error.light",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  Zona de risco
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleExcluirPlanta}
                  disabled={excluindo || salvando || typeof onDelete !== "function"}
                  fullWidth
                >
                  DEVOLVER ÁGUA AO SIETCH (EXCLUIR PLANTA)
                </Button>
              </Box>
            </Stack>
          </Stack>
          </motion.div>
        )}

        {abaAtiva === 1 && (
          <motion.div
            key={1}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.2 }}
          >
          <Stack spacing={2}>
            <TextField
              label="Adicionar nota manual"
              multiline
              minRows={3}
              value={notaManual}
              onChange={(event) => setNotaManual(event.target.value)}
              placeholder="Registre um evento (ex: adubação, poda)..."
              fullWidth
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                onClick={handleAdicionarNota}
                disabled={salvandoNota || !notaManual.trim()}
              >
                {salvandoNota ? "Salvando nota..." : "Adicionar Nota"}
              </Button>
            </Box>

            {carregandoHistorico && (
              <Typography variant="body2" color="text.secondary">
                Carregando histórico...
              </Typography>
            )}

            {!carregandoHistorico && historico.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                Nenhum evento registrado para esta planta.
              </Typography>
            )}

            {!carregandoHistorico && historico.length > 0 && (
              <List
                sx={{
                  p: 0,
                  position: "relative",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    left: "18px",
                    top: "6px",
                    bottom: "6px",
                    width: "2px",
                    background:
                      "linear-gradient(180deg, rgba(211,84,0,0.55), rgba(27,128,196,0.55))",
                    opacity: 0.8,
                  },
                }}
              >
                {historico.map((mensagem) => {
                  const ehManual = mensagem.tipo === "manual";
                  const nivelAlerta = Number(mensagem.nivel_alerta ?? 0);
                  const ehCritico = !ehManual && nivelAlerta >= 2;
                  const corEvento = ehManual ? "#607D8B" : ehCritico ? "#D94841" : "#D39A2C";
                  const fundoEvento = ehManual
                    ? "rgba(96, 125, 139, 0.12)"
                    : ehCritico
                      ? "rgba(217, 72, 65, 0.18)"
                      : "rgba(211, 154, 44, 0.16)";

                  return (
                    <ListItem
                      key={mensagem.id}
                      sx={{
                        mb: 1,
                        pl: 6,
                        borderRadius: 2,
                        border: "1px solid rgba(100, 70, 40, 0.16)",
                        backgroundColor: fundoEvento,
                        alignItems: "flex-start",
                        gap: 1.2,
                        position: "relative",
                      }}
                    >
                      <Box
                        sx={{
                          position: "absolute",
                          left: "6px",
                          top: "10px",
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          backgroundColor: "rgba(23, 30, 33, 0.86)",
                          border: `1px solid ${corEvento}`,
                          color: corEvento,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          zIndex: 1,
                        }}
                      >
                        {ehManual ? (
                          <EditNoteIcon sx={{ fontSize: 15 }} />
                        ) : ehCritico ? (
                          <WarningAmberIcon sx={{ fontSize: 15 }} />
                        ) : (
                          <WarningAmberIcon sx={{ fontSize: 15 }} />
                        )}
                      </Box>

                      <ListItemText
                        primary={
                          ehManual
                            ? `Nota manual: ${mensagem.mensagem ?? "Sem descrição"}`
                            : mensagem.titulo ?? mensagem.mensagem ?? "Alerta de rega"
                        }
                        secondary={
                          <Box component="span" sx={mentatMonoSx}>
                            {`Planta: ${mensagem.planta_nome ?? planta?.nome_apelido ?? "-"} • ${formatarDataBr(mensagem.data_envio)}`}
                          </Box>
                        }
                      />
                    </ListItem>
                  );
                })}
              </List>
            )}
          </Stack>
          </motion.div>
        )}

        {abaAtiva === 2 && (
          <motion.div
            key={2}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.2 }}
          >
          <Stack spacing={2} alignItems="center">
            <Box
              sx={{
                width: "100%",
                maxWidth: 360,
                p: 3,
                borderRadius: 2,
                border: "1px solid rgba(0, 0, 0, 0.1)",
                backgroundColor: "#FFFFFF",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
              }}
            >
              <QRCode
                value={qrCodeValue}
                size={180}
                bgColor="#FFFFFF"
                fgColor="#111111"
                level="M"
              />
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase" }}>
                Codigo de rastreio
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: '"Share Tech Mono", monospace',
                  color: "#111111",
                  letterSpacing: "0.03em",
                  wordBreak: "break-all",
                  textAlign: "center",
                }}
              >
                ID: {planta?.id ?? "-"}
              </Typography>

              <Button
                variant="contained"
                size="small"
                onClick={handleCopiarLinkQr}
                disabled={!planta?.id}
              >
                Copiar Link do QR
              </Button>
            </Box>

            {statusCopiaQr === "success" && (
              <Alert severity="success" sx={{ width: "100%", maxWidth: 360 }}>
                Link copiado. Agora voce pode colar no WhatsApp.
              </Alert>
            )}

            {statusCopiaQr === "error" && (
              <Alert severity="error" sx={{ width: "100%", maxWidth: 360 }}>
                Nao foi possivel copiar automaticamente. Use o link do QR manualmente.
              </Alert>
            )}
          </Stack>
          </motion.div>
        )}

        {abaAtiva === 3 && (
          <motion.div
            key={3}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.2 }}
          >
          <Box>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} sx={{ mb: 2 }}>
              <Box
                component="img"
                src={ultimaFotoReferenciaUrl}
                alt="Ultima foto registrada para alinhar o proximo clique"
                sx={{
                  width: "100%",
                  maxWidth: 420,
                  height: 220,
                  objectFit: "cover",
                  border: "1px solid rgba(100, 70, 40, 0.35)",
                  boxShadow: "0 10px 28px rgba(30, 18, 8, 0.45)",
                }}
              />
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} sx={{ mb: 2 }}>
              <Button
                variant="contained"
                color="info"
                startIcon={<CameraAltIcon />}
                onClick={() => setScannerOpen(true)}
                disabled={!planta?.id || salvandoFoto}
              >
                {salvandoFoto
                  ? "Processando captura..."
                  : "[ 📷 INICIAR SCANNER MORFOLÓGICO ]"}
              </Button>
            </Stack>

            {erroFoto && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {erroFoto}
              </Alert>
            )}

            {erroMarco && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {erroMarco}
              </Alert>
            )}

            {galeriaFotos.length === 0 && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Nenhuma captura registrada ainda. Use o scanner para iniciar a galeria da planta.
              </Alert>
            )}

            {carregandoFotos && (
              <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
                Carregando linha do tempo fotografica...
              </Typography>
            )}

            {!carregandoFotos &&
              filtroBadgeAtivo !== "todas" &&
              galeriaFotos.length > 0 &&
              fotosTimelapseVisiveis.length === 0 && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Nenhuma foto com o badge selecionado foi encontrada.
                </Alert>
              )}

            {fotosTimelapseVisiveis.length > 0 && (
              <Stack spacing={1.2}>
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: 520,
                    mx: "auto",
                    position: "relative",
                    border: "2px solid",
                    borderColor: vitalidadeHistoricaConfig.cor,
                    borderBottom: `4px solid ${vitalidadeHistoricaConfig.cor}`,
                    overflow: "hidden",
                    boxShadow: `0 8px 32px ${vitalidadeHistoricaConfig.cor}40`,
                    clipPath:
                      "polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)",
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      inset: 0,
                      zIndex: 2,
                      pointerEvents: "none",
                      border: ehMemorialAtual ? "1px solid" : "1px solid transparent",
                      borderColor: ehMemorialAtual ? "secondary.main" : "transparent",
                      opacity: ehMemorialAtual ? 0.95 : 0,
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      left: 8,
                      bottom: 8,
                      zIndex: 2,
                      px: 1,
                      py: 0.4,
                      border: "1px solid rgba(232,224,213,0.34)",
                      backgroundColor: "rgba(7, 11, 15, 0.72)",
                      color: frameVitalidadeConfig.borderColor,
                      fontFamily: '"Share Tech Mono", monospace',
                      fontSize: "0.7rem",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                  >
                    Sinal Vital: {frameVitalidadeConfig.label}
                  </Box>

                  <Box
                    sx={{
                      position: "absolute",
                      right: 8,
                      bottom: 8,
                      zIndex: 2,
                      px: 1,
                      py: 0.4,
                      border: `1px solid ${hexParaRgba(vitalidadeHistoricaConfig.cor, 0.86)}`,
                      backgroundColor: hexParaRgba(vitalidadeHistoricaConfig.cor, 0.2),
                      color: "#E9F3FF",
                      fontFamily: '"Share Tech Mono", monospace',
                      fontSize: "0.7rem",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                    }}
                  >
                    SAUDE NA EPOCA: {vitalidadeHistoricaConfig.label}
                  </Box>

                  {ehNascimentoAtual && (
                    <Chip
                      label="NASCIMENTO"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        zIndex: 2,
                        borderRadius: 1,
                        fontWeight: 700,
                        letterSpacing: "0.05em",
                        color: "#0A141B",
                        backgroundColor: "#7EC3F1",
                        border: "1px solid rgba(255, 255, 255, 0.38)",
                        boxShadow: "0 0 14px rgba(126,195,241,0.45)",
                      }}
                    />
                  )}

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
                    {indexFoto + 1}/{fotosTimelapseVisiveis.length}
                    {autoplayAtivo ? " • AUTO" : ""}
                  </Box>

                  <Box
                    component="img"
                    key={fotoAtualTimelapse?.id ?? fotoAtualTimelapse?.url}
                    src={fotoAtualTimelapse?.url}
                    alt="Registro cronologico da planta"
                    sx={{
                      width: "100%",
                      height: { xs: 220, sm: 280 },
                      objectFit: "cover",
                      opacity: 1,
                      transition: "opacity 320ms ease-in-out",
                    }}
                  />
                </Box>

                <ToggleButtonGroup
                  exclusive
                  value={marcoAtualFoto || null}
                  onChange={(_event, novoMarco) => {
                    void handleToggleMarco(novoMarco);
                  }}
                  sx={{
                    width: "100%",
                    maxWidth: 520,
                    mx: "auto",
                    mt: 0.8,
                    mb: 0.2,
                    borderRadius: 0,
                    "& .MuiToggleButtonGroup-grouped": {
                      borderRadius: "0 !important",
                      borderColor: "rgba(126, 195, 241, 0.45)",
                      fontFamily: '"Share Tech Mono", monospace',
                      letterSpacing: "0.03em",
                      fontSize: { xs: "0.68rem", sm: "0.76rem" },
                      color: "rgba(221, 233, 242, 0.88)",
                      backgroundColor: "rgba(7, 14, 20, 0.56)",
                      flex: 1,
                      minHeight: 40,
                    },
                  }}
                >
                  <ToggleButton
                    value="nascimento"
                    disabled={salvandoMarco}
                    sx={{
                      "&.Mui-selected": {
                        color: "#06141E",
                        backgroundColor: "#7EC3F1",
                      },
                      "&.Mui-selected:hover": {
                        backgroundColor: "#8FCEF5",
                      },
                      "&:focus-visible": {
                        outline: "3px solid #7EC3F1",
                        outlineOffset: -2,
                      },
                    }}
                  >
                    [♦ NASCIMENTO]
                  </ToggleButton>
                  <ToggleButton
                    value="crescimento"
                    disabled={salvandoMarco}
                    sx={{
                      "&.Mui-selected": {
                        color: "#072212",
                        backgroundColor: "#5FC88A",
                      },
                      "&.Mui-selected:hover": {
                        backgroundColor: "#72D599",
                      },
                      "&:focus-visible": {
                        outline: "3px solid #7EC3F1",
                        outlineOffset: -2,
                      },
                    }}
                  >
                    [↗ CRESCIMENTO]
                  </ToggleButton>
                  <ToggleButton
                    value="memorial"
                    disabled={salvandoMarco}
                    sx={{
                      "&.Mui-selected": {
                        color: "#231005",
                        backgroundColor: "#D39A2C",
                      },
                      "&.Mui-selected:hover": {
                        backgroundColor: "#DEAA48",
                      },
                      "&:focus-visible": {
                        outline: "3px solid #7EC3F1",
                        outlineOffset: -2,
                      },
                    }}
                  >
                    [† MEMORIAL]
                  </ToggleButton>
                </ToggleButtonGroup>

                {fotosTimelapseVisiveis.length > 1 && (
                  <Stack
                    direction="row"
                    spacing={0.9}
                    sx={{
                      maxWidth: 520,
                      mx: "auto",
                      width: "100%",
                      overflowX: "auto",
                      pb: 0.2,
                      pr: 0.2,
                    }}
                  >
                    {fotosTimelapseVisiveis.map((foto, indice) => (
                      <FotoMiniaturaHud
                        key={foto.id ?? `${foto.url}-${indice}`}
                        foto={foto}
                        ativa={indice === indexFoto}
                        onSelecionar={() => {
                          setIndexFoto(indice);
                          setAutoplayAtivo(false);
                        }}
                      />
                    ))}
                  </Stack>
                )}

                <Typography
                  variant="caption"
                  sx={{
                    color: "rgba(232,224,213,0.86)",
                    fontFamily: '"Share Tech Mono", monospace',
                    letterSpacing: "0.03em",
                    textAlign: "center",
                  }}
                >
                  {formatarDataRegistroCurta(
                    fotoAtualTimelapse?.data_registro ?? fotoAtualTimelapse?.data_captura,
                    fotoAtualTimelapse?.data_registro_local,
                  )}
                </Typography>

                {ehNascimentoAtual && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: "#7EC3F1",
                      fontFamily: '"Share Tech Mono", monospace',
                      letterSpacing: "0.05em",
                      textAlign: "center",
                      textTransform: "uppercase",
                      display: "block",
                    }}
                  >
                    Marco de Nascimento registrado
                  </Typography>
                )}
                {marcoAtualFoto && marcoAtualFoto !== "nascimento" && (
                  <Typography
                    variant="caption"
                    sx={{
                      color: "rgba(216, 229, 241, 0.86)",
                      fontFamily: '"Share Tech Mono", monospace',
                      letterSpacing: "0.05em",
                      textAlign: "center",
                      textTransform: "uppercase",
                      display: "block",
                    }}
                  >
                    Marco ativo: {formatarBadgeLabel(marcoAtualFoto)}
                  </Typography>
                )}

                {fotosTimelapseVisiveis.length > 1 && (
                  <Stack spacing={1.1} sx={{ maxWidth: 520, mx: "auto", width: "100%" }}>
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
                      max={fotosTimelapseVisiveis.length - 1}
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
          </Box>
          </motion.div>
        )}
        </AnimatePresence>
        </DialogContent>

        {isMobile && (
          <Box
            sx={{
              position: "sticky",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 3,
              px: 1,
              py: 0.9,
              borderTop: "1px solid rgba(126, 166, 194, 0.36)",
              background:
                "linear-gradient(180deg, rgba(13, 19, 24, 0.9) 0%, rgba(13, 19, 24, 0.96) 100%)",
              backdropFilter: "blur(8px)",
            }}
          >
          <Stack direction="row" spacing={0.8} justifyContent="space-between">
            <Button
              fullWidth
              size="small"
              variant={abaAtiva === 0 ? "contained" : "outlined"}
              onClick={() => setAbaAtiva(0)}
              startIcon={<DashboardIcon sx={{ fontSize: 16 }} />}
              sx={{
                fontSize: "0.72rem",
                py: 0.7,
                minHeight: 38,
                borderColor: "rgba(96, 150, 191, 0.65)",
                color: abaAtiva === 0 ? "#0E1418" : "#DCE8F0",
                backgroundColor: abaAtiva === 0 ? "#7EC3F1" : "rgba(10, 14, 18, 0.38)",
                boxShadow:
                  abaAtiva === 0 ? "0 0 12px rgba(126,195,241,0.42)" : "none",
                "&:hover": {
                  backgroundColor:
                    abaAtiva === 0 ? "#90CEF5" : "rgba(18, 26, 33, 0.82)",
                  borderColor: "rgba(126, 195, 241, 0.85)",
                },
                  "&:focus-visible": {
                    outline: "3px solid #7EC3F1",
                    outlineOffset: 2,
                  },
              }}
            >
              Geral
            </Button>
            <Button
              fullWidth
              size="small"
              variant={abaAtiva === 1 ? "contained" : "outlined"}
              onClick={() => setAbaAtiva(1)}
              startIcon={<MenuBookIcon sx={{ fontSize: 16 }} />}
              sx={{
                fontSize: "0.72rem",
                py: 0.7,
                minHeight: 38,
                borderColor: "rgba(96, 150, 191, 0.65)",
                color: abaAtiva === 1 ? "#0E1418" : "#DCE8F0",
                backgroundColor: abaAtiva === 1 ? "#7EC3F1" : "rgba(10, 14, 18, 0.38)",
                boxShadow:
                  abaAtiva === 1 ? "0 0 12px rgba(126,195,241,0.42)" : "none",
                "&:hover": {
                  backgroundColor:
                    abaAtiva === 1 ? "#90CEF5" : "rgba(18, 26, 33, 0.82)",
                  borderColor: "rgba(126, 195, 241, 0.85)",
                },
                  "&:focus-visible": {
                    outline: "3px solid #7EC3F1",
                    outlineOffset: 2,
                  },
              }}
            >
              Diario
            </Button>
            <Button
              fullWidth
              size="small"
              variant={abaAtiva === 2 ? "contained" : "outlined"}
              onClick={() => setAbaAtiva(2)}
              startIcon={<QrCode2Icon sx={{ fontSize: 16 }} />}
              sx={{
                fontSize: "0.72rem",
                py: 0.7,
                minHeight: 38,
                borderColor: "rgba(96, 150, 191, 0.65)",
                color: abaAtiva === 2 ? "#0E1418" : "#DCE8F0",
                backgroundColor: abaAtiva === 2 ? "#7EC3F1" : "rgba(10, 14, 18, 0.38)",
                boxShadow:
                  abaAtiva === 2 ? "0 0 12px rgba(126,195,241,0.42)" : "none",
                "&:hover": {
                  backgroundColor:
                    abaAtiva === 2 ? "#90CEF5" : "rgba(18, 26, 33, 0.82)",
                  borderColor: "rgba(126, 195, 241, 0.85)",
                },
                  "&:focus-visible": {
                    outline: "3px solid #7EC3F1",
                    outlineOffset: 2,
                  },
              }}
            >
              ID
            </Button>
            <Button
              fullWidth
              size="small"
              variant={abaAtiva === 3 ? "contained" : "outlined"}
              onClick={() => setAbaAtiva(3)}
              startIcon={<PhotoLibraryIcon sx={{ fontSize: 16 }} />}
              sx={{
                fontSize: "0.72rem",
                py: 0.7,
                minHeight: 38,
                borderColor: "rgba(96, 150, 191, 0.65)",
                color: abaAtiva === 3 ? "#0E1418" : "#DCE8F0",
                backgroundColor: abaAtiva === 3 ? "#7EC3F1" : "rgba(10, 14, 18, 0.38)",
                boxShadow:
                  abaAtiva === 3 ? "0 0 12px rgba(126,195,241,0.42)" : "none",
                "&:hover": {
                  backgroundColor:
                    abaAtiva === 3 ? "#90CEF5" : "rgba(18, 26, 33, 0.82)",
                  borderColor: "rgba(126, 195, 241, 0.85)",
                },
                  "&:focus-visible": {
                    outline: "3px solid #7EC3F1",
                    outlineOffset: 2,
                  },
              }}
            >
              Galeria
            </Button>
          </Stack>
          </Box>
        )}
      </motion.div>

      <CameraScanner
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        ultimaFotoUrl={ultimaFotoReferenciaUrl}
        onCapture={(fotoBase64) => {
          console.log("Foto tirada!", fotoBase64);
          void handleCapturarFoto(fotoBase64);
          setScannerOpen(false);
        }}
      />

      <Dialog
        open={confirmarExclusaoOpen}
        onClose={handleCancelarExclusao}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle sx={{ color: "error.main" }}>
          Confirmar exclusão da planta
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 1 }}>
            Você realmente deseja excluir
            {` "${planta?.nome_apelido ?? "esta planta"}"`}?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Esta ação é permanente e removerá os registros associados no prontuário.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelarExclusao} disabled={excluindo}>
            Cancelar
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleConfirmarExclusao}
            disabled={excluindo}
          >
            {excluindo ? "Excluindo..." : "Sim, excluir tudo"}
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
}

export default PlantDetailsModal;
