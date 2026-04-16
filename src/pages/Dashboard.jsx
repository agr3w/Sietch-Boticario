import { useCallback, useEffect, useRef, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  cadastrarPlantaComFoto,
  db,
  getNotificacoesNaoLidas,
  marcarMensagemComoLida,
} from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import PlantCard from "../components/PlantCard";
import AddPlantModal from "../components/AddPlantModal";
import CameraScanner from "../components/CameraScanner";
import { climateSx, feedbackSx, globalSx, layoutSx } from "../theme/styles";

function gerarDataHoraLocalBr() {
  return new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour12: false,
  });
}

function obterUltimaFotoReferenciaPlanta(planta) {
  const galeria = Array.isArray(planta?.galeria_fotos)
    ? planta.galeria_fotos
    : Array.isArray(planta?.galeriaFotos)
      ? planta.galeriaFotos
      : [];

  return galeria[galeria.length - 1]?.url ?? "";
}

function Dashboard() {
  const { currentUser } = useAuth();
  const mentatNumberSx = {
    fontFamily: '"Share Tech Mono", monospace',
    letterSpacing: '0.03em',
  };
  const [plantas, setPlantas] = useState([]);
  const [arquivoMorto, setArquivoMorto] = useState([]);
  const [climaAtual, setClimaAtual] = useState(null);
  const [climaErro, setClimaErro] = useState("");
  const [notificacoes, setNotificacoes] = useState([]);
  const [badgeCount, setBadgeCount] = useState(0);
  const [notificacoesAnchorEl, setNotificacoesAnchorEl] = useState(null);
  const [marcandoMensagemId, setMarcandoMensagemId] = useState(null);
  const [n8nStatus, setN8nStatus] = useState("nao-validada");
  const [validandoN8n, setValidandoN8n] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [abaPainel, setAbaPainel] = useState(0);
  const [scannerMemorialOpen, setScannerMemorialOpen] = useState(false);
  const [processandoMemorial, setProcessandoMemorial] = useState(false);
  const [restaurandoArquivoId, setRestaurandoArquivoId] = useState("");
  const [plantaMemorialPendente, setPlantaMemorialPendente] = useState(null);
  const fluxoMemorialRef = useRef(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const n8nHealthcheckUrl = import.meta.env.VITE_N8N_HEALTHCHECK_URL;

  const exibirFeedback = useCallback((message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  }, []);

  const formatarDataEnvio = (dataEnvio) => {
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
  };

  const corNivelAlerta = (nivelAlerta) => {
    if (Number(nivelAlerta) === 2) {
      return {
        borderColor: "error.main",
        backgroundColor: "rgba(217, 72, 65, 0.12)",
      };
    }

    return {
      borderColor: "warning.main",
      backgroundColor: "rgba(211, 154, 44, 0.14)",
    };
  };

  const carregarNotificacoesNaoLidas = useCallback(async () => {
    if (!currentUser?.uid) {
      setNotificacoes([]);
      setBadgeCount(0);
      return;
    }

    try {
      const notificacoesNaoLidas = await getNotificacoesNaoLidas(currentUser.uid);
      setNotificacoes(notificacoesNaoLidas);
      setBadgeCount(notificacoesNaoLidas.length);
    } catch {
      setNotificacoes([]);
      setBadgeCount(0);
      exibirFeedback("Não foi possível carregar as notificações.", "error");
    }
  }, [currentUser?.uid, exibirFeedback]);

  const carregarPlantas = async () => {
    if (!currentUser?.uid) {
      setPlantas([]);
      return;
    }

    const plantasQuery = query(
      collection(db, "plantas"),
      where("userId", "==", currentUser.uid),
    );
    const querySnapshot = await getDocs(plantasQuery);
    const listaPlantas = [];

    querySnapshot.forEach((plantaDoc) => {
      listaPlantas.push({ id: plantaDoc.id, ...plantaDoc.data() });
    });

    setPlantas(listaPlantas);
  };

  const carregarArquivoMorto = async () => {
    if (!currentUser?.uid) {
      setArquivoMorto([]);
      return;
    }

    const arquivoQuery = query(
      collection(db, "arquivo_morto"),
      where("userId", "==", currentUser.uid),
    );
    const querySnapshot = await getDocs(arquivoQuery);
    const listaArquivo = [];

    querySnapshot.forEach((arquivoDoc) => {
      listaArquivo.push({ id: arquivoDoc.id, ...arquivoDoc.data() });
    });

    listaArquivo.sort((a, b) => {
      const dataA =
        (typeof a?.data_arquivamento?.seconds === "number"
          ? a.data_arquivamento.seconds * 1000
          : new Date(a?.data_arquivamento ?? 0).getTime()) || 0;
      const dataB =
        (typeof b?.data_arquivamento?.seconds === "number"
          ? b.data_arquivamento.seconds * 1000
          : new Date(b?.data_arquivamento ?? 0).getTime()) || 0;
      return dataB - dataA;
    });

    setArquivoMorto(listaArquivo);
  };

  useEffect(() => {
    if (!currentUser?.uid) {
      setPlantas([]);
      setArquivoMorto([]);
      return;
    }

    void (async () => {
      await carregarPlantas();
      await carregarArquivoMorto();
    })();
  }, [currentUser?.uid]);

  useEffect(() => {
    void carregarNotificacoesNaoLidas();
  }, [carregarNotificacoesNaoLidas]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      void carregarNotificacoesNaoLidas();
    }, 20000);

    return () => {
      clearInterval(intervalId);
    };
  }, [carregarNotificacoesNaoLidas]);

  useEffect(() => {
    const controller = new AbortController();

    const carregarClima = async () => {
      try {
        setClimaErro("");
        const response = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=-25.4284&longitude=-49.2733&current=temperature_2m,relative_humidity_2m",
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Falha ao consultar o clima");
        }

        const data = await response.json();
        const current = data.current;

        if (!current) {
          throw new Error("Resposta de clima inválida");
        }

        setClimaAtual({
          temperatura: current.temperature_2m,
          umidade: current.relative_humidity_2m,
        });
      } catch (error) {
        if (error.name !== "AbortError") {
          setClimaErro(
            "Não foi possível carregar os dados climáticos no momento.",
          );
        }
      }
    };

    void carregarClima();

    return () => {
      controller.abort();
    };
  }, []);

  const regarPlanta = async (id) => {
    try {
      const plantaRef = doc(db, "plantas", id);

      await updateDoc(plantaRef, {
        ultima_rega: serverTimestamp(),
      });

      await carregarPlantas();
      exibirFeedback("Rega registrada com sucesso.", "success");
    } catch {
      exibirFeedback("Não foi possível registrar a rega.", "error");
    }
  };

  const atualizarDadosPlanta = async (id, dadosAtualizados) => {
    try {
      const plantaRef = doc(db, "plantas", id);
      await updateDoc(plantaRef, dadosAtualizados);
      await carregarPlantas();
      exibirFeedback("Dados atualizados.", "success");
    } catch {
      exibirFeedback("Falha ao atualizar os dados da planta.", "error");
      throw new Error("Falha ao atualizar dados da planta");
    }
  };

  const deletarPlanta = async (id) => {
    const plantaSelecionada = plantas.find((item) => item.id === id);
    if (!plantaSelecionada) {
      exibirFeedback("Planta não encontrada para arquivamento.", "error");
      throw new Error("Planta não encontrada");
    }

    exibirFeedback("Capture a Foto de Despedida para arquivar a planta.", "info");

    return new Promise((resolve) => {
      fluxoMemorialRef.current = {
        id,
        resolve,
      };
      setPlantaMemorialPendente(plantaSelecionada);
      setScannerMemorialOpen(true);
    });
  };

  const cancelarFluxoMemorial = () => {
    if (processandoMemorial) {
      return;
    }

    setScannerMemorialOpen(false);
    setPlantaMemorialPendente(null);

    const fluxoAtual = fluxoMemorialRef.current;
    fluxoMemorialRef.current = null;

    if (fluxoAtual) {
      fluxoAtual.resolve(false);
      exibirFeedback("Arquivamento cancelado. Nenhuma planta foi removida.", "info");
    }
  };

  const concluirMemorialEArquivar = async (fotoMemorialBase64) => {
    const fluxoAtual = fluxoMemorialRef.current;

    if (!fluxoAtual?.id || !fotoMemorialBase64) {
      exibirFeedback("Falha ao capturar Foto de Despedida.", "error");
      return;
    }

    if (!currentUser?.uid) {
      exibirFeedback("Sessão inválida para arquivamento memorial.", "error");
      return;
    }

    setProcessandoMemorial(true);

    try {
      const plantaRef = doc(db, "plantas", fluxoAtual.id);
      const plantaSnapshot = await getDoc(plantaRef);

      if (!plantaSnapshot.exists()) {
        throw new Error("Planta não encontrada para arquivamento");
      }

      const plantaData = plantaSnapshot.data();
      const dataHoraLocalBr = gerarDataHoraLocalBr();

      await addDoc(collection(db, "fotos"), {
        planta_id: fluxoAtual.id,
        userId: currentUser.uid,
        url: fotoMemorialBase64,
        data_registro: serverTimestamp(),
        data_registro_local: dataHoraLocalBr,
        nota: "Foto de despedida antes do arquivamento da planta.",
        marco: "memorial",
        status_emocional: "memorial",
        badges: ["memorial"],
        origem: "memorial",
      });

      await addDoc(collection(db, "arquivo_morto"), {
        ...plantaData,
        userId: currentUser.uid,
        planta_id_original: fluxoAtual.id,
        data_arquivamento: serverTimestamp(),
        data_arquivamento_local: dataHoraLocalBr,
        status_emocional: "memorial",
        foto_memorial_url: fotoMemorialBase64,
      });

      await deleteDoc(plantaRef);
      await carregarPlantas();
      await carregarArquivoMorto();

      exibirFeedback("Planta movida para o arquivo_morto do Sietch.", "success");
      fluxoAtual.resolve(true);
    } catch {
      exibirFeedback("Falha ao arquivar a planta no memorial.", "error");
      fluxoAtual.resolve(false);
    } finally {
      fluxoMemorialRef.current = null;
      setProcessandoMemorial(false);
      setScannerMemorialOpen(false);
      setPlantaMemorialPendente(null);
    }
  };

  const restaurarPlantaDoArquivo = async (arquivoId) => {
    if (!arquivoId) {
      return;
    }

    if (!currentUser?.uid) {
      exibirFeedback("Sessão inválida para restauração.", "error");
      return;
    }

    setRestaurandoArquivoId(arquivoId);

    try {
      const arquivoRef = doc(db, "arquivo_morto", arquivoId);
      const arquivoSnapshot = await getDoc(arquivoRef);

      if (!arquivoSnapshot.exists()) {
        throw new Error("Registro não encontrado no arquivo_morto");
      }

      const dadosArquivo = arquivoSnapshot.data();
      const {
        planta_id_original: _plantaIdOriginal,
        data_arquivamento: _dataArquivamento,
        data_arquivamento_local: _dataArquivamentoLocal,
        foto_memorial_url: _fotoMemorialUrl,
        status_emocional: _statusEmocional,
        ...dadosPlantaRestaurada
      } = dadosArquivo;

      await addDoc(collection(db, "plantas"), {
        ...dadosPlantaRestaurada,
        userId: currentUser.uid,
        restaurada_em: serverTimestamp(),
      });

      await deleteDoc(arquivoRef);
      await carregarPlantas();
      await carregarArquivoMorto();
      exibirFeedback("Planta restaurada do arquivo_morto com sucesso.", "success");
    } catch {
      exibirFeedback("Falha ao restaurar a planta do arquivo_morto.", "error");
    } finally {
      setRestaurandoArquivoId("");
    }
  };

  const adicionarPlanta = async (dadosPlanta, fotoNascimentoBase64) => {
    if (!currentUser?.uid) {
      exibirFeedback("Sessão inválida para cadastro de planta.", "error");
      return;
    }

    try {
      await cadastrarPlantaComFoto(
        {
          ...dadosPlanta,
          userId: currentUser.uid,
        },
        fotoNascimentoBase64,
      );

      await carregarPlantas();
      setIsAddModalOpen(false);
      exibirFeedback("Planta cadastrada com sucesso.", "success");
    } catch {
      exibirFeedback("Erro ao cadastrar a planta. Tente novamente.", "error");
      throw new Error("Falha ao cadastrar planta");
    }
  };

  const handleMarcarComoLida = async (mensagemId) => {
    try {
      setMarcandoMensagemId(mensagemId);
      await marcarMensagemComoLida(mensagemId);
      setNotificacoes((prev) => {
        const proximo = prev.filter((mensagem) => mensagem.id !== mensagemId);
        setBadgeCount(proximo.length);
        return proximo;
      });
      exibirFeedback("Mensagem marcada como lida.", "success");
    } catch {
      exibirFeedback("Falha ao atualizar a mensagem.", "error");
    } finally {
      setMarcandoMensagemId(null);
    }
  };

  const validarIntegracaoN8n = useCallback(async ({ silencioso = false } = {}) => {
    if (!n8nHealthcheckUrl) {
      setN8nStatus("inativa");
      if (!silencioso) {
        exibirFeedback(
          "Configure VITE_N8N_HEALTHCHECK_URL para validar a integração.",
          "warning",
        );
      }
      return;
    }

    setValidandoN8n(true);
    setN8nStatus("verificando");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(n8nHealthcheckUrl, {
        method: "GET",
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error("N8N_OFFLINE");
      }

      setN8nStatus("ativa");
      if (!silencioso) {
        exibirFeedback("Integração n8n validada com sucesso.", "success");
      }
    } catch {
      setN8nStatus("inativa");
      if (!silencioso) {
        exibirFeedback("Integração n8n indisponível no momento.", "error");
      }
    } finally {
      clearTimeout(timeoutId);
      setValidandoN8n(false);
    }
  }, [exibirFeedback, n8nHealthcheckUrl]);

  useEffect(() => {
    if (!n8nHealthcheckUrl) {
      return;
    }

    const debounceId = setTimeout(() => {
      void validarIntegracaoN8n({ silencioso: true });
    }, 900);

    return () => {
      clearTimeout(debounceId);
    };
  }, [n8nHealthcheckUrl, validarIntegracaoN8n]);

  const n8nStatusTexto =
    n8nStatus === "ativa"
      ? "Ativa"
      : n8nStatus === "inativa"
        ? "Inativa"
        : n8nStatus === "verificando"
          ? "Sincronizando..."
          : "Não validada";

  const n8nStatusCor =
    n8nStatus === "ativa"
      ? "success.main"
      : n8nStatus === "inativa"
        ? "error.main"
        : n8nStatus === "verificando"
          ? "warning.main"
          : "text.secondary";

  const menuNotificacoesAberto = Boolean(notificacoesAnchorEl);

  return (
    <Container maxWidth="md" sx={[layoutSx.pageContainer, globalSx.pageTexture]}>
      <Box sx={layoutSx.hero}>
        <Box sx={layoutSx.heroContent}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            align="center"
            sx={{ fontFamily: 'Rajdhani', fontWeight: 700, letterSpacing: '0.1em', color: "text.primary" }}
          >
            Sietch Boticário
          </Typography>
          <Typography
            variant="subtitle1"
            gutterBottom
            align="center"
            sx={layoutSx.subtitle, {color: "text.primary"}}
          >
            Painel Fremen para Gestão de Umidade e Controle Botânico
          </Typography>
        </Box>
      </Box>

      <Stack
        direction="row"
        sx={{
          ...layoutSx.addButtonRow,
          justifyContent: "center",
        }}
      >
        <Button
          variant="contained"
          size="large"
          sx={layoutSx.addButton}
          onClick={() => setIsAddModalOpen(true)}
        >
          Adicionar Planta
        </Button>
      </Stack>

      <Card elevation={4} sx={climateSx.card}>
        <CardContent>
          <Typography variant="h6" sx={climateSx.title}>
            Painel Climático • Curitiba
          </Typography>

          {climaErro && <Alert severity="warning">{climaErro}</Alert>}

          {!climaErro && !climaAtual && (
            <Typography variant="body2" sx={climateSx.loadingText}>
              Sincronizando dados climáticos...
            </Typography>
          )}

          {!climaErro && climaAtual && (
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={climateSx.metricBox}>
                  <Typography variant="body2" sx={climateSx.metricLabel}>
                    Temperatura Atual
                  </Typography>
                  <Typography variant="h4" sx={climateSx.metricValue}>
                    <Box component="span" sx={mentatNumberSx}>
                    {climaAtual.temperatura}°C
                    </Box>
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={[climateSx.metricBox, climateSx.metricBoxWater]}>
                  <Typography variant="body2" sx={climateSx.metricLabel}>
                    Umidade Relativa
                  </Typography>
                  <Typography variant="h4" sx={climateSx.metricValue}>
                    <Box component="span" sx={mentatNumberSx}>
                    {climaAtual.umidade}%
                    </Box>
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>

      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent sx={{ py: 1.8, "&:last-child": { pb: 1.8 } }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              🤖 Integração WhatsApp: {" "}
              <Box component="span" sx={{ color: n8nStatusCor, fontWeight: 800 }}>
                {n8nStatusTexto}
              </Box>
            </Typography>

            <Stack direction="row" spacing={1.2} sx={{ flexWrap: "wrap" }}>
              <IconButton
                color="primary"
                onClick={(event) => setNotificacoesAnchorEl(event.currentTarget)}
                aria-label="Abrir notificações"
                sx={{
                  color: "text.primary",
                  border: "1px solid rgba(245, 242, 235, 0.28)",
                  backgroundColor: "rgba(11, 18, 21, 0.52)",
                  "&:hover": {
                    backgroundColor: "rgba(21, 33, 38, 0.78)",
                  },
                }}
              >
                <Badge
                  badgeContent={badgeCount}
                  color="error"
                  sx={{
                    "& .MuiBadge-badge": {
                      color: "#FFFFFF",
                      fontWeight: 800,
                      backgroundColor: "#B3261E",
                      border: "1px solid rgba(255,255,255,0.55)",
                    },
                  }}
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <Button
                variant="contained"
                color="success"
                onClick={validarIntegracaoN8n}
                disabled={validandoN8n}
              >
                {validandoN8n ? "Sincronizando..." : "Validar Integração"}
              </Button>
              <Button
                variant="outlined"
                color="success"
                href="https://wa.me/34644462188"
                target="_blank"
                rel="noopener noreferrer"
              >
                Abrir Chat do Sietch
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      <Menu
        anchorEl={notificacoesAnchorEl}
        open={menuNotificacoesAberto}
        onClose={() => setNotificacoesAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            border: "1px solid rgba(211, 154, 44, 0.45)",
            background:
              "linear-gradient(180deg, rgba(13, 20, 24, 0.98) 0%, rgba(10, 16, 20, 0.96) 100%)",
            color: "text.primary",
            minWidth: 340,
          },
        }}
      >
        {notificacoes.length === 0 ? (
          <MenuItem disabled sx={{ minWidth: 320, color: "rgba(245, 242, 235, 0.7)" }}>
            Nenhuma notificação não lida.
          </MenuItem>
        ) : (
          notificacoes.map((mensagem) => {
            const alertaSx = corNivelAlerta(mensagem.nivel_alerta);

            return (
              <MenuItem
                key={mensagem.id}
                sx={{
                  minWidth: 340,
                  maxWidth: 420,
                  borderLeft: "4px solid",
                  borderColor: alertaSx.borderColor,
                  backgroundColor: alertaSx.backgroundColor,
                  alignItems: "flex-start",
                  gap: 1,
                  whiteSpace: "normal",
                  color: "text.primary",
                }}
              >
                <ListItemText
                  primary={mensagem.planta_nome ?? "Planta"}
                  primaryTypographyProps={{
                    fontWeight: 700,
                    color: "text.primary",
                  }}
                  secondary={(
                    <Box component="span" sx={[mentatNumberSx, { color: "rgba(245, 242, 235, 0.84)" }]}>
                      {formatarDataEnvio(mensagem.data_envio)}
                    </Box>
                  )}
                />
                <IconButton
                  size="small"
                  color="success"
                  onClick={() => void handleMarcarComoLida(mensagem.id)}
                  disabled={marcandoMensagemId === mensagem.id}
                >
                  <CheckIcon fontSize="small" />
                </IconButton>
              </MenuItem>
            );
          })
        )}
      </Menu>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1.2,
          mb: 3.4,
          color: "secondary.main",
          opacity: 0.9,
        }}
      >
        {Array.from({ length: 9 }).map((_, index) => (
          <Box
            key={index}
            component="span"
            sx={{
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: index === 4 ? "1.2rem" : "0.95rem",
              lineHeight: 1,
            }}
          >
            ♦
          </Box>
        ))}
      </Box>

      <Card elevation={3} sx={{ mb: 3 }}>
        <CardContent sx={{ py: 1.4, "&:last-child": { pb: 1.4 } }}>
          <Tabs
            value={abaPainel}
            onChange={(_event, novaAba) => setAbaPainel(novaAba)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              "& .MuiTabs-indicator": { backgroundColor: "#7EC3F1", height: 3 },
              "& .MuiTab-root": {
                color: "rgba(245,242,235,0.88)",
                fontWeight: 700,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                minHeight: 48,
              },
              "& .Mui-selected": {
                color: "#7EC3F1 !important",
              },
              "& .MuiTabs-scrollButtons": {
                color: "text.primary",
              },
            }}
          >
            <Tab label={`Jardim Ativo (${plantas.length})`} />
            <Tab label={`Arquivo Morto (${arquivoMorto.length})`} />
          </Tabs>
        </CardContent>
      </Card>

      {abaPainel === 0 && (
        <Grid container spacing={3}>
          {plantas.map((planta) => (
            <Grid size={{ xs: 12, sm: 6 }} key={planta.id}>
              <PlantCard
                planta={planta}
                onRegar={regarPlanta}
                onAtualizarPlanta={atualizarDadosPlanta}
                onDelete={deletarPlanta}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {abaPainel === 1 && (
        <Stack spacing={2.2} sx={{ mb: 2 }}>
          {arquivoMorto.length === 0 && (
            <Alert severity="info">
              Nenhuma planta memorializada no arquivo_morto.
            </Alert>
          )}

          {arquivoMorto.map((registro) => (
            <Card
              key={registro.id}
              elevation={4}
              sx={{
                border: "1px solid rgba(247, 170, 176, 0.42)",
                background:
                  "linear-gradient(160deg, rgba(43, 14, 17, 0.94) 0%, rgba(26, 11, 13, 0.94) 100%)",
                color: "text.primary",
              }}
            >
              <CardContent>
                <Stack spacing={1.2}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.5}
                    justifyContent="space-between"
                  >
                    <Box>
                      <Typography variant="h6" sx={{ color: "#F6D8D9" }}>
                        {registro.nome_apelido ?? "Planta sem nome"}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "rgba(248, 231, 231, 0.82)" }}>
                        {registro.especie ?? "Espécie não informada"}
                      </Typography>
                    </Box>

                    <Chip
                      label="Memorial"
                      sx={{
                        alignSelf: { xs: "flex-start", sm: "center" },
                        color: "#FFEDEE",
                        backgroundColor: "#7A0E1A",
                        border: "1px solid rgba(255, 214, 218, 0.7)",
                        fontWeight: 800,
                        letterSpacing: "0.04em",
                      }}
                    />
                  </Stack>

                  {registro.foto_memorial_url && (
                    <Box
                      component="img"
                      src={registro.foto_memorial_url}
                      alt={`Foto memorial de ${registro.nome_apelido ?? "planta"}`}
                      sx={{
                        width: "100%",
                        maxWidth: 420,
                        height: { xs: 180, sm: 210 },
                        objectFit: "cover",
                        border: "1px solid rgba(255, 214, 218, 0.35)",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
                      }}
                    />
                  )}

                  <Divider sx={{ borderColor: "rgba(255, 214, 218, 0.25)" }} />

                  <Typography variant="body2" sx={{ color: "rgba(248, 231, 231, 0.88)" }}>
                    Arquivada em: {formatarDataEnvio(registro.data_arquivamento)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "rgba(248, 231, 231, 0.86)" }}>
                    Localização: {registro.localizacao ?? "Não informada"}
                  </Typography>

                  <Button
                    variant="contained"
                    color="info"
                    onClick={() => void restaurarPlantaDoArquivo(registro.id)}
                    disabled={restaurandoArquivoId === registro.id}
                    sx={{ alignSelf: "flex-start", mt: 0.7 }}
                  >
                    {restaurandoArquivoId === registro.id
                      ? "Restaurando..."
                      : "Restaurar para Jardim Ativo"}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      <AddPlantModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={adicionarPlanta}
      />

      <CameraScanner
        open={scannerMemorialOpen}
        onClose={cancelarFluxoMemorial}
        ultimaFotoUrl={obterUltimaFotoReferenciaPlanta(plantaMemorialPendente)}
        onCapture={(fotoBase64) => {
          if (processandoMemorial) {
            return;
          }

          void concluirMemorialEArquivar(fotoBase64);
        }}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={feedbackSx.snackbarAlert}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Dashboard;
