import { useCallback, useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import NotificationsIcon from "@mui/icons-material/Notifications";
import {
  db,
  getNotificacoesNaoLidas,
  marcarMensagemComoLida,
} from "../firebase";
import PlantCard from "../components/PlantCard";
import AddPlantModal from "../components/AddPlantModal";
import { climateSx, feedbackSx, globalSx, layoutSx } from "../theme/styles";

function Dashboard() {
  const [plantas, setPlantas] = useState([]);
  const [climaAtual, setClimaAtual] = useState(null);
  const [climaErro, setClimaErro] = useState("");
  const [notificacoes, setNotificacoes] = useState([]);
  const [badgeCount, setBadgeCount] = useState(0);
  const [notificacoesAnchorEl, setNotificacoesAnchorEl] = useState(null);
  const [marcandoMensagemId, setMarcandoMensagemId] = useState(null);
  const [n8nStatus, setN8nStatus] = useState("nao-validada");
  const [validandoN8n, setValidandoN8n] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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
    try {
      const notificacoesNaoLidas = await getNotificacoesNaoLidas();
      setNotificacoes(notificacoesNaoLidas);
      setBadgeCount(notificacoesNaoLidas.length);
    } catch {
      setNotificacoes([]);
      setBadgeCount(0);
      exibirFeedback("Não foi possível carregar as notificações.", "error");
    }
  }, [exibirFeedback]);

  const carregarPlantas = async () => {
    const querySnapshot = await getDocs(collection(db, "plantas"));
    const listaPlantas = [];

    querySnapshot.forEach((plantaDoc) => {
      listaPlantas.push({ id: plantaDoc.id, ...plantaDoc.data() });
    });

    setPlantas(listaPlantas);
  };

  useEffect(() => {
    void (async () => {
      await carregarPlantas();
    })();
  }, []);

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

  const atualizarIntervaloRega = async (id, novoIntervalo) => {
    try {
      const plantaRef = doc(db, "plantas", id);

      await updateDoc(plantaRef, {
        intervalo_rega_dias: novoIntervalo,
      });

      await carregarPlantas();
      exibirFeedback("Intervalo de rega atualizado.", "success");
    } catch {
      exibirFeedback("Falha ao atualizar o intervalo de rega.", "error");
      throw new Error("Falha ao atualizar intervalo");
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

  const adicionarPlanta = async (dadosPlanta) => {
    try {
      await addDoc(collection(db, "plantas"), {
        ...dadosPlanta,
        ultima_rega: serverTimestamp(),
        notificar: true,
      });

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
          ? "Verificando..."
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
            sx={{ color: "#E8E0D5" }}
          >
            Sietch Boticário 🌿
          </Typography>
          <Typography
            variant="subtitle1"
            gutterBottom
            align="center"
            sx={layoutSx.subtitle}
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
              Carregando dados meteorológicos...
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
                    {climaAtual.temperatura}°C
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={[climateSx.metricBox, climateSx.metricBoxWater]}>
                  <Typography variant="body2" sx={climateSx.metricLabel}>
                    Umidade Relativa
                  </Typography>
                  <Typography variant="h4" sx={climateSx.metricValue}>
                    {climaAtual.umidade}%
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
              >
                <Badge badgeContent={badgeCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <Button
                variant="contained"
                color="success"
                onClick={validarIntegracaoN8n}
                disabled={validandoN8n}
              >
                {validandoN8n ? "Validando..." : "Validar Integração"}
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
      >
        {notificacoes.length === 0 ? (
          <MenuItem disabled sx={{ minWidth: 320 }}>
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
                }}
              >
                <ListItemText
                  primary={mensagem.planta_nome ?? "Planta"}
                  secondary={formatarDataEnvio(mensagem.data_envio)}
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

      <Grid container spacing={3}>
        {plantas.map((planta) => (
          <Grid size={{ xs: 12, sm: 6 }} key={planta.id}>
            <PlantCard
              planta={planta}
              onRegar={regarPlanta}
              onSalvarIntervalo={atualizarIntervaloRega}
              onAtualizarPlanta={atualizarDadosPlanta}
            />
          </Grid>
        ))}
      </Grid>

      <AddPlantModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={adicionarPlanta}
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
