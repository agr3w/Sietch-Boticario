import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  Stack,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { getHistoricoPlanta } from "../firebase";

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

function PlantDetailsModal({ planta, open, onClose, onUpdate }) {
  const [abaAtiva, setAbaAtiva] = useState(0);
  const [historico, setHistorico] = useState([]);
  const [carregandoHistorico, setCarregandoHistorico] = useState(false);
  const [notificarWhatsapp, setNotificarWhatsapp] = useState(Boolean(planta?.notificar));
  const [intervaloRega, setIntervaloRega] = useState(planta?.intervalo_rega_dias ?? 1);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    setNotificarWhatsapp(Boolean(planta?.notificar));
    setIntervaloRega(planta?.intervalo_rega_dias ?? 1);
    setSalvando(false);
  }, [planta?.intervalo_rega_dias, planta?.notificar, open]);

  useEffect(() => {
    if (!open || !planta?.id) {
      setHistorico([]);
      return;
    }

    let ativo = true;

    const carregarHistorico = async () => {
      try {
        setCarregandoHistorico(true);
        const mensagens = await getHistoricoPlanta(planta.id);

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
  }, [open, planta?.id]);

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

  const handleSalvar = async () => {
    if (!planta?.id || typeof onUpdate !== "function") {
      return;
    }

    setSalvando(true);
    try {
      await onUpdate(planta.id, {
        notificar: notificarWhatsapp,
        intervalo_rega_dias: Number(intervaloRega),
      });
      onClose?.();
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{planta?.nome_apelido ?? "Prontuário da Planta"}</DialogTitle>

      <Tabs
        value={abaAtiva}
        onChange={(_event, novaAba) => setAbaAtiva(novaAba)}
        aria-label="Abas do prontuário da planta"
        sx={{ px: 3 }}
      >
        <Tab label="Visão Geral" />
        <Tab label="Diário de Bordo" />
      </Tabs>

      <DialogContent dividers>
        {abaAtiva === 0 && (
          <Stack spacing={2.2}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Dias para regar
              </Typography>
              <Typography variant="h6">{resumoRega.diasParaRegar}</Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Última rega
              </Typography>
              <Typography variant="body1">{resumoRega.ultimaRega}</Typography>
            </Box>

            <TextField
              label="Intervalo de rega (dias)"
              type="number"
              value={intervaloRega}
              onChange={(event) => setIntervaloRega(event.target.value)}
              slotProps={{ htmlInput: { min: 1 } }}
              fullWidth
            />

            <FormControlLabel
              control={
                <Switch
                  checked={notificarWhatsapp}
                  onChange={(event) => setNotificarWhatsapp(event.target.checked)}
                />
              }
              label="Notificar via WhatsApp"
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                onClick={handleSalvar}
                disabled={salvando}
              >
                {salvando ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </Box>
          </Stack>
        )}

        {abaAtiva === 1 && (
          <Box>
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
              <List sx={{ p: 0 }}>
                {historico.map((mensagem) => {
                  const corMarcador = Number(mensagem.nivel_alerta) === 2 ? "#D94841" : "#D39A2C";

                  return (
                    <ListItem
                      key={mensagem.id}
                      sx={{
                        mb: 1,
                        borderRadius: 2,
                        border: "1px solid rgba(100, 70, 40, 0.16)",
                        alignItems: "flex-start",
                        gap: 1.2,
                      }}
                    >
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          backgroundColor: corMarcador,
                          mt: "8px",
                          flexShrink: 0,
                        }}
                      />

                      <ListItemText
                        primary={mensagem.titulo ?? mensagem.mensagem ?? "Alerta de rega"}
                        secondary={`Planta: ${mensagem.planta_nome ?? planta?.nome_apelido ?? "-"} • ${formatarDataBr(mensagem.data_envio)}`}
                      />
                    </ListItem>
                  );
                })}
              </List>
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default PlantDetailsModal;
