import { useEffect, useState } from "react";
import { addDoc, collection, doc, getDocs, updateDoc } from "firebase/firestore";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { db } from "../firebase";
import PlantCard from "../components/PlantCard";
import AddPlantModal from "../components/AddPlantModal";
import { climateSx, layoutSx } from "../theme/styles";

function Dashboard() {
  const [plantas, setPlantas] = useState([]);
  const [climaAtual, setClimaAtual] = useState(null);
  const [climaErro, setClimaErro] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const exibirFeedback = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

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
        ultima_rega: new Date().toISOString(),
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

  const adicionarPlanta = async (dadosPlanta) => {
    try {
      await addDoc(collection(db, "plantas"), {
        ...dadosPlanta,
        ultima_rega: new Date().toISOString(),
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

  return (
    <Container maxWidth="md" sx={layoutSx.pageContainer}>
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        align="center"
        color="primary"
      >
        Sietch Boticário 🌿
      </Typography>
      <Typography
        variant="subtitle1"
        gutterBottom
        align="center"
        sx={layoutSx.subtitle}
      >
        Gestão de Umidade e Controle Botânico
      </Typography>

      <Stack direction="row" justifyContent="center" sx={layoutSx.addButtonRow}>
        <Button variant="contained" size="large" onClick={() => setIsAddModalOpen(true)}>
          Adicionar Planta
        </Button>
      </Stack>

      <Card elevation={4} sx={climateSx.card}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Painel Climático • Curitiba
          </Typography>

          {climaErro && <Alert severity="warning">{climaErro}</Alert>}

          {!climaErro && !climaAtual && (
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Carregando dados meteorológicos...
            </Typography>
          )}

          {!climaErro && climaAtual && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={climateSx.metricBox}>
                  <Typography variant="body2" sx={climateSx.metricLabel}>
                    Temperatura Atual
                  </Typography>
                  <Typography variant="h4" sx={climateSx.metricValue}>
                    {climaAtual.temperatura}°C
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={climateSx.metricBox}>
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

      <Grid container spacing={3}>
        {plantas.map((planta) => (
          <Grid item xs={12} sm={6} key={planta.id}>
            <PlantCard
              planta={planta}
              onRegar={regarPlanta}
              onSalvarIntervalo={atualizarIntervaloRega}
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
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Dashboard;
