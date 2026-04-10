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

function PlantCard({ planta, onRegar, onSalvarIntervalo }) {
  const dataRega = new Date(planta.ultima_rega);
  const dateOptions = { timeZone: 'America/Sao_Paulo' };
  const timeOptions = { timeZone: 'America/Sao_Paulo' };
  const [dialogOpen, setDialogOpen] = useState(false);
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
    <Card elevation={3} sx={plantCardSx.card}>
      <CardContent sx={plantCardSx.content}>
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
          <strong>Última Rega:</strong> {dataRega.toLocaleDateString('pt-BR', dateOptions)} às{' '}
          {dataRega.toLocaleTimeString('pt-BR', timeOptions)}
        </Typography>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={plantCardSx.actionRow}>
          <Button
            variant="contained"
            color="success"
            fullWidth
            sx={plantCardSx.waterButton}
            onClick={() => onRegar(planta.id)}
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
            onClick={abrirDialog}
            startIcon={
              <Box component="span" aria-hidden="true" sx={plantCardSx.icon}>
                ⚙️
              </Box>
            }
          >
            Ajustar Tolerância
          </Button>
        </Stack>

        <Dialog open={dialogOpen} onClose={fecharDialog} fullWidth maxWidth="xs">
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
      </CardContent>
    </Card>
  );
}

export default PlantCard;