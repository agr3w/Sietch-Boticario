import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Box,
  Chip,
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
import EditNoteIcon from "@mui/icons-material/EditNote";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import { QRCode } from "react-qr-code";
import { adicionarNotaManual, getHistoricoPlanta } from "../firebase";

const GALERIA_PLACEHOLDER_URL =
  "https://cdn.wallpapersafari.com/65/81/5YrxE9.jpg";

const vitalidadeConfig = {
  prosperando: { cor: "#2F6F4E", label: "Prosperando" },
  estavel: { cor: "#1B80C4", label: "Estavel" },
  recuperacao: { cor: "#D39A2C", label: "Em Recuperacao" },
  critico: { cor: "#D94841", label: "Critico" },
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

function PlantDetailsModal({ planta, open, onClose, onUpdate, onDelete }) {
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
  const vitalidadeAtualConfig =
    vitalidadeConfig[vitalidade] ?? vitalidadeConfig.estavel;

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
    planta?.eh_toxica,
    planta?.ehToxica,
  ]);

  const qrCodeValue = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/planta/${planta?.id ?? ""}`;
  }, [planta?.id]);

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

  const handleExcluirPlanta = async () => {
    if (!planta?.id || typeof onDelete !== "function") {
      return;
    }

    const confirmou = window.confirm(
      "Tem certeza? Este registro será perdido na areia.",
    );

    if (!confirmou) {
      return;
    }

    setExcluindo(true);
    try {
      await onDelete(planta.id);
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

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          position: "relative",
          overflow: "hidden",
          pr: 8,
          pb: 1.2,
          borderBottom: "4px solid",
          borderColor: vitalidadeAtualConfig.cor,
          boxShadow: `inset 0 -15px 30px -15px ${vitalidadeAtualConfig.cor}60`,
          textTransform: "uppercase",
          fontFamily: '"Rajdhani", sans-serif',
          letterSpacing: "0.1em",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
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

      <Tabs
        value={abaAtiva}
        onChange={(_event, novaAba) => setAbaAtiva(novaAba)}
        aria-label="Abas do prontuário da planta"
        sx={{ px: 3 }}
      >
        <Tab label="Visão Geral" />
        <Tab label="Diário de Bordo" />
        <Tab label="Identificação" />
        <Tab label="Galeria" />
      </Tabs>

      <DialogContent
        dividers
        sx={{
          position: "relative",
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
        {abaAtiva === 0 && (
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

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 1.2,
                flexWrap: "wrap",
              }}
            >
              <Button
                variant="outlined"
                color="error"
                onClick={handleExcluirPlanta}
                disabled={excluindo || salvando || typeof onDelete !== "function"}
              >
                {excluindo
                  ? "EXCLUINDO..."
                  : "DEVOLVER ÁGUA AO SIETCH (EXCLUIR PLANTA)"}
              </Button>
              <Button
                variant="contained"
                onClick={handleSalvar}
                disabled={salvando || excluindo}
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
        )}

        {abaAtiva === 2 && (
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
