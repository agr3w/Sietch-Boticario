import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { plantCardSx } from '../theme/styles';
import PlantDetailsModal from './PlantDetailsModal';

function parseUltimaRegaDate(ultimaRega) {
  if (!ultimaRega) {
    return null;
  }

  if (typeof ultimaRega?.toDate === 'function') {
    const date = ultimaRega.toDate();
    return Number.isFinite(date.getTime()) ? date : null;
  }

  if (typeof ultimaRega === 'string' || typeof ultimaRega === 'number') {
    const date = new Date(ultimaRega);
    return Number.isFinite(date.getTime()) ? date : null;
  }

  if (typeof ultimaRega?.seconds === 'number') {
    const milliseconds =
      ultimaRega.seconds * 1000 + Math.floor((ultimaRega.nanoseconds ?? 0) / 1000000);
    const date = new Date(milliseconds);
    return Number.isFinite(date.getTime()) ? date : null;
  }

  return null;
}

function PlantCard({ planta, onRegar, onSalvarIntervalo }) {
  const dataRega = parseUltimaRegaDate(planta.ultima_rega);
  const dateOptions = { timeZone: 'America/Sao_Paulo' };
  const timeOptions = { timeZone: 'America/Sao_Paulo' };
  const intervaloRega = Number(planta.intervalo_rega_dias ?? 0);
  const dataRegaValida = Boolean(dataRega);
  const diasDesdeRega = dataRegaValida
    ? Math.floor((Date.now() - dataRega.getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const precisaRegar = dataRegaValida && intervaloRega > 0 && diasDesdeRega >= intervaloRega;
  const faltaUmDiaParaRega =
    dataRegaValida && intervaloRega > 0 && !precisaRegar && intervaloRega - diasDesdeRega === 1;
  const diasAtraso = precisaRegar ? diasDesdeRega - intervaloRega : 0;
  const textoSelo = precisaRegar
    ? diasAtraso > 0
      ? `Atrasada ${diasAtraso}d`
      : 'Regar hoje'
    : faltaUmDiaParaRega
      ? 'Regar amanha'
      : null;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [novoIntervalo, setNovoIntervalo] = useState(planta.intervalo_rega_dias ?? 1);
  const [salvando, setSalvando] = useState(false);

  const abrirDialog = () => {
    setNovoIntervalo(planta.intervalo_rega_dias ?? 1);
    setDialogOpen(true);
  };

  const fecharDialog = () => {
    if (!salvando) {
      setDialogOpen(false);
    }
  };

  const salvarIntervalo = async () => {
    const intervaloNormalizado = Number(novoIntervalo);

    if (!Number.isFinite(intervaloNormalizado) || intervaloNormalizado <= 0) {
      return;
    }

    setSalvando(true);
    try {
      await onSalvarIntervalo(planta.id, intervaloNormalizado);
      setDialogOpen(false);
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Card
      elevation={3}
      onClick={() => setDetailsOpen(true)}
      sx={[
        plantCardSx.card,
        faltaUmDiaParaRega && plantCardSx.cardNearWater,
        precisaRegar && plantCardSx.cardNeedWater,
        { cursor: 'pointer' },
      ]}
    >
      <CardContent sx={plantCardSx.content}>
        {textoSelo && (
          <Box
            component="span"
            sx={[
              plantCardSx.statusBadge,
              precisaRegar ? plantCardSx.statusBadgeNeedWater : plantCardSx.statusBadgeNearWater,
            ]}
          >
            {textoSelo}
          </Box>
        )}

        <Typography variant="h5" component="div" sx={plantCardSx.title}>
          {planta.nome_apelido}
        </Typography>
        <Typography sx={plantCardSx.secondaryText} color="text.secondary">
          Espécie: {planta.especie} | Local: {planta.localizacao}
        </Typography>

        <Typography variant="body2" sx={plantCardSx.intervalText}>
          <strong>Intervalo de Rega:</strong> a cada {planta.intervalo_rega_dias} dias
        </Typography>
        <Typography variant="body2" sx={plantCardSx.lastWatering}>
          <strong>Última Rega:</strong>{' '}
          {dataRegaValida
            ? `${dataRega.toLocaleDateString('pt-BR', dateOptions)} às ${dataRega.toLocaleTimeString('pt-BR', timeOptions)}`
            : 'Sem registro'}
        </Typography>

        {precisaRegar && (
          <Typography variant="body2" sx={plantCardSx.alertText}>
            Atenção: precisa de água (atrasada {diasAtraso} {diasAtraso === 1 ? 'dia' : 'dias'}).
          </Typography>
        )}

        {faltaUmDiaParaRega && (
          <Typography variant="body2" sx={plantCardSx.nearAlertText}>
            Aviso: quase na hora de regar (falta 1 dia).
          </Typography>
        )}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={plantCardSx.actionRow}>
          <Button
            variant="contained"
            color="success"
            fullWidth
            sx={plantCardSx.waterButton}
            onClick={(event) => {
              event.stopPropagation();
              void onRegar(planta.id);
            }}
          >
            <Box component="span" aria-hidden="true" sx={plantCardSx.icon}>
              💧
            </Box>
            &nbsp;Registrar Rega (Dar Água)
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            sx={plantCardSx.adjustButton}
            onClick={(event) => {
              event.stopPropagation();
              abrirDialog();
            }}
            startIcon={
              <Box component="span" aria-hidden="true" sx={plantCardSx.icon}>
                ⚙️
              </Box>
            }
          >
            Ajustar Tolerância
          </Button>
        </Stack>

        <Dialog
          open={dialogOpen}
          onClose={(event, reason) => {
            event?.stopPropagation?.();
            fecharDialog(reason);
          }}
          onClick={(event) => event.stopPropagation()}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle>Ajustar Tolerância de Rega</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Intervalo de rega (dias)"
              type="number"
              fullWidth
              value={novoIntervalo}
              onChange={(event) => setNovoIntervalo(event.target.value)}
              slotProps={{ htmlInput: { min: 1 } }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={fecharDialog} disabled={salvando}>
              Cancelar
            </Button>
            <Button onClick={salvarIntervalo} variant="contained" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogActions>
        </Dialog>

        <PlantDetailsModal
          planta={planta}
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
        />
      </CardContent>
    </Card>
  );
}

export default PlantCard;