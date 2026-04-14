import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Box,
  Dialog,
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
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import { adicionarNotaManual, getHistoricoPlanta } from "../firebase";

const GALERIA_PLACEHOLDER_URL =
  "https://cdn.wallpapersafari.com/65/81/5YrxE9.jpg";

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
  const [necessidadeLuz, setNecessidadeLuz] = useState(
    planta?.necessidade_luz ?? planta?.necessidadeLuz ?? "Meia Sombra",
  );
  const [tipoSubstrato, setTipoSubstrato] = useState(
    planta?.tipo_substrato ?? planta?.tipoSubstrato ?? "",
  );
  const [ehToxica, setEhToxica] = useState(
    Boolean(planta?.eh_toxica ?? planta?.ehToxica ?? false),
  );
  const [salvando, setSalvando] = useState(false);
  const [notaManual, setNotaManual] = useState("");
  const [salvandoNota, setSalvandoNota] = useState(false);

  useEffect(() => {
    setNotificarWhatsapp(Boolean(planta?.notificar));
    setIntervaloRega(planta?.intervalo_rega_dias ?? 1);
    setNecessidadeLuz(planta?.necessidade_luz ?? planta?.necessidadeLuz ?? "Meia Sombra");
    setTipoSubstrato(planta?.tipo_substrato ?? planta?.tipoSubstrato ?? "");
    setEhToxica(Boolean(planta?.eh_toxica ?? planta?.ehToxica ?? false));
    setSalvando(false);
    setNotaManual("");
    setSalvandoNota(false);
  }, [
    open,
    planta?.id,
    planta?.intervalo_rega_dias,
    planta?.notificar,
    planta?.necessidade_luz,
    planta?.necessidadeLuz,
    planta?.tipo_substrato,
    planta?.tipoSubstrato,
    planta?.eh_toxica,
    planta?.ehToxica,
  ]);

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
        necessidade_luz: necessidadeLuz,
        tipo_substrato: tipoSubstrato,
        eh_toxica: ehToxica,
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
      );
      const historicoAtualizado = await getHistoricoPlanta(planta.id);
      setHistorico(historicoAtualizado);
    } catch (error) {
      console.error("Erro ao adicionar nota manual:", error);
      setHistorico((prev) => prev.filter((item) => item.id !== notaTemporaria.id));
      setNotaManual(textoLimpo);
    } finally {
      setSalvandoNota(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ position: "relative", overflow: "hidden", pr: 8 }}>
        {planta?.nome_apelido ?? "Prontuário da Planta"}
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

      <Tabs
        value={abaAtiva}
        onChange={(_event, novaAba) => setAbaAtiva(novaAba)}
        aria-label="Abas do prontuário da planta"
        sx={{ px: 3 }}
      >
        <Tab label="Visão Geral" />
        <Tab label="Diário de Bordo" />
        <Tab label="Ficha Botânica" />
        <Tab label="Galeria" />
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
          <Stack spacing={2}>
            <TextField
              label="Adicionar nota manual"
              multiline
              minRows={3}
              value={notaManual}
              onChange={(event) => setNotaManual(event.target.value)}
              placeholder="Ex.: Adubação realizada hoje, sem sinais de estresse hídrico."
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
              <List sx={{ p: 0 }}>
                {historico.map((mensagem) => {
                  const ehManual = mensagem.tipo === "manual";
                  const corMarcador = ehManual
                    ? "#607D8B"
                    : Number(mensagem.nivel_alerta) === 2
                      ? "#D94841"
                      : "#D39A2C";

                  return (
                    <ListItem
                      key={mensagem.id}
                      sx={{
                        mb: 1,
                        borderRadius: 2,
                        border: "1px solid rgba(100, 70, 40, 0.16)",
                        backgroundColor: ehManual ? "rgba(96, 125, 139, 0.08)" : "transparent",
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
                        primary={
                          ehManual
                            ? `Nota manual: ${mensagem.mensagem ?? "Sem descrição"}`
                            : mensagem.titulo ?? mensagem.mensagem ?? "Alerta de rega"
                        }
                        secondary={`Planta: ${mensagem.planta_nome ?? planta?.nome_apelido ?? "-"} • ${formatarDataBr(mensagem.data_envio)}`}
                      />
                    </ListItem>
                  );
                })}
              </List>
            )}
          </Stack>
        )}

        {abaAtiva === 2 && (
          <Stack spacing={2.2}>
            <FormControl fullWidth>
              <InputLabel id="necessidade-luz-label">Necessidade de luz</InputLabel>
              <Select
                labelId="necessidade-luz-label"
                label="Necessidade de luz"
                value={necessidadeLuz}
                onChange={(event) => setNecessidadeLuz(event.target.value)}
              >
                <MenuItem value="Sol Pleno">Sol Pleno</MenuItem>
                <MenuItem value="Meia Sombra">Meia Sombra</MenuItem>
                <MenuItem value="Sombra">Sombra</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Tipo de substrato"
              value={tipoSubstrato}
              onChange={(event) => setTipoSubstrato(event.target.value)}
              fullWidth
            />

            <FormControlLabel
              control={
                <Switch
                  checked={ehToxica}
                  onChange={(event) => setEhToxica(event.target.checked)}
                />
              }
              label="Tóxica para pets"
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

        {abaAtiva === 3 && (
          <Box>
            <Alert severity="info" sx={{ mb: 2 }}>
              Integração com Firebase Storage em breve. Prepare-se para acompanhar o crescimento do seu Sietch!
            </Alert>
            <Grid
              container
              spacing={2}
              sx={{
                minHeight: 140,
                border: "1px dashed rgba(100, 70, 40, 0.28)",
                borderRadius: 2,
                p: 1,
              }}
            >
              {[1, 2, 3].map((item) => (
                <Grid key={item} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Box
                    component="img"
                    src={GALERIA_PLACEHOLDER_URL}
                    alt={`Imagem de teste da galeria ${item}`}
                    sx={{
                      width: "100%",
                      height: 160,
                      objectFit: "cover",
                      border: "1px solid rgba(100, 70, 40, 0.2)",
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default PlantDetailsModal;
