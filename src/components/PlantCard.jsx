import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
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

function PlantCard({ planta, onRegar, onAtualizarPlanta, onDelete }) {
  const coresVitalidade = {
    prosperando: '#2F6F4E',
    estavel: '#1B80C4',
    recuperacao: '#D39A2C',
    critico: '#D94841',
  };
  const vitalidadeAtual = planta.vitalidade || 'estavel';
  const corVitalidade = coresVitalidade[vitalidadeAtual] || coresVitalidade.estavel;
  const mentatNumberSx = {
    fontFamily: '"Share Tech Mono", monospace',
    letterSpacing: '0.03em',
  };
  const dataRega = parseUltimaRegaDate(planta.ultima_rega);
  const dateOptions = { timeZone: 'America/Sao_Paulo' };
  const timeOptions = { timeZone: 'America/Sao_Paulo' };
  const intervaloRega = Number(planta.intervalo_rega_dias ?? 0);
  const dataRegaValida = Boolean(dataRega);
  const diasDesdeRega = dataRegaValida
    ? Math.floor((Date.now() - dataRega.getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const diasExatosDesdeRega = dataRegaValida
    ? (Date.now() - dataRega.getTime()) / (1000 * 60 * 60 * 24)
    : 0;
  const precisaRegar = dataRegaValida && intervaloRega > 0 && diasDesdeRega >= intervaloRega;
  const faltaUmDiaParaRega =
    dataRegaValida && intervaloRega > 0 && !precisaRegar && intervaloRega - diasDesdeRega === 1;
  const diasAtraso = precisaRegar ? diasDesdeRega - intervaloRega : 0;
  const regaHoje = dataRegaValida && intervaloRega > 0 && diasDesdeRega === intervaloRega;
  const estaAtrasada = dataRegaValida && intervaloRega > 0 && diasDesdeRega > intervaloRega;
  const textoSelo = estaAtrasada
    ? `Atrasada ${diasAtraso}d`
    : regaHoje
      ? 'Regar hoje'
      : faltaUmDiaParaRega
        ? 'Regar amanha'
        : null;
  const porcentagemAgua =
    dataRegaValida && Number.isFinite(intervaloRega) && intervaloRega > 0
      ? Math.min(100, Math.max(0, 100 - (diasExatosDesdeRega / intervaloRega) * 100))
      : 0;
  const corMedidor =
    porcentagemAgua > 25 ? 'info' : porcentagemAgua > 0 && porcentagemAgua <= 25 ? 'secondary' : 'error';
  const medidorEstado =
    porcentagemAgua === 0 ? 'atrasada' : porcentagemAgua <= 25 ? 'hoje' : 'hidratada';
  const medidorTexto =
    medidorEstado === 'atrasada'
      ? `Critico: reposicao atrasada em ${diasAtraso} dia${diasAtraso === 1 ? '' : 's'}`
      : medidorEstado === 'hoje'
        ? 'Limite operacional: fornecer agua hoje'
        : `Reserva hidrica estavel (${Math.ceil(porcentagemAgua)}%)`;
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <Card
      elevation={3}
      sx={[
        {
          position: 'relative',
          overflow: 'hidden',
          bgcolor: 'background.paper',
          boxShadow: `0 8px 24px ${corVitalidade}30`,
          borderTop: '2px solid',
          borderTopColor: corVitalidade,
          borderRadius: 0,
          '@keyframes cardAlertPulse': {
            '0%': { boxShadow: '0 0 8px rgba(217, 72, 65, 0.4)' },
            '50%': { boxShadow: '0 0 20px rgba(217, 72, 65, 0.72)' },
            '100%': { boxShadow: '0 0 8px rgba(217, 72, 65, 0.4)' },
          },
          '@keyframes cardCalmGlow': {
            '0%': { boxShadow: '0 0 7px rgba(27, 128, 196, 0.22)' },
            '50%': { boxShadow: '0 0 15px rgba(27, 128, 196, 0.45)' },
            '100%': { boxShadow: '0 0 7px rgba(27, 128, 196, 0.22)' },
          },
          '@keyframes cardVitalityCriticalPulse': {
            '0%': { boxShadow: `0 8px 24px ${corVitalidade}30` },
            '50%': { boxShadow: `0 12px 34px ${corVitalidade}99` },
            '100%': { boxShadow: `0 8px 24px ${corVitalidade}30` },
          },
        },
        faltaUmDiaParaRega && { borderLeft: '4px solid', borderLeftColor: 'secondary.main' },
        regaHoje && { borderLeft: '4px solid', borderLeftColor: 'secondary.main' },
        estaAtrasada && {
          borderLeft: '4px solid',
          borderLeftColor: 'error.main',
          boxShadow: '0 0 15px rgba(217, 72, 65, 0.6)',
          animation: 'cardAlertPulse 1.1s ease-in-out infinite',
        },
        medidorEstado === 'hidratada' && {
          boxShadow: '0 0 12px rgba(27, 128, 196, 0.34)',
          animation: 'cardCalmGlow 3.2s ease-in-out infinite',
        },
        vitalidadeAtual === 'critico' && {
          borderTopColor: corVitalidade,
          boxShadow: `0 10px 28px ${corVitalidade}55`,
          animation: 'cardVitalityCriticalPulse 1s ease-in-out infinite',
        },
      ]}
    >
      <CardContent sx={[plantCardSx.content, { position: 'relative', overflow: 'hidden' }]}>
        <WaterDropIcon
          sx={{
            position: 'absolute',
            right: -20,
            bottom: -24,
            fontSize: 120,
            opacity: 0.05,
            color: 'info.main',
            pointerEvents: 'none',
            transform: 'rotate(-16deg)',
          }}
        />
        {textoSelo && (
          <Box
            component="span"
            sx={[
              plantCardSx.statusBadge,
              precisaRegar ? plantCardSx.statusBadgeNeedWater : plantCardSx.statusBadgeNearWater,
              mentatNumberSx,
            ]}
          >
            {textoSelo}
          </Box>
        )}

        <Stack direction="row" spacing={1} sx={{ mb: 0.3, alignItems: 'center' }}>
          <Typography
            variant="h5"
            component="div"
            sx={[
              plantCardSx.title,
              {
                textTransform: 'uppercase',
                fontFamily: 'Rajdhani, sans-serif',
                fontWeight: 700,
                letterSpacing: '0.07em',
                mb: 0,
              },
            ]}
          >
            {planta.nome_apelido}
          </Typography>
          <Box
            aria-label={`Vitalidade: ${vitalidadeAtual}`}
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: corVitalidade,
              boxShadow: `0 0 8px ${corVitalidade}AA`,
              animation:
                vitalidadeAtual === 'critico'
                  ? 'cardVitalityCriticalPulse 1s ease-in-out infinite'
                  : 'none',
            }}
          />
        </Stack>
        <Typography sx={plantCardSx.secondaryText} color="text.secondary">
          Espécie: {planta.especie} | Local: {planta.localizacao}
        </Typography>

        <Box sx={{ mb: 1.2 }}>
          <Typography variant="body2" sx={[plantCardSx.intervalText, { mb: 0.8 }]}>
            Medidor de Umidade Fremen
          </Typography>
          <LinearProgress
            variant="determinate"
            value={porcentagemAgua}
            color={corMedidor}
            sx={{
              height: 8,
              borderRadius: 0,
              backgroundColor: 'rgba(0,0,0,0.4)',
              border: '1px solid rgba(23, 30, 33, 0.24)',
              ...(medidorEstado === 'atrasada' && {
                boxShadow: '0 0 15px rgba(217, 72, 65, 0.6)',
                animation: 'meterAlertPulse 0.95s ease-in-out infinite',
              }),
              ...(medidorEstado === 'hidratada' && {
                boxShadow: '0 0 11px rgba(27, 128, 196, 0.42)',
                animation: 'meterCalmPulse 3.2s ease-in-out infinite',
              }),
              '& .MuiLinearProgress-bar': {
                transition: 'transform 280ms linear',
                ...(medidorEstado === 'atrasada' && {
                  backgroundImage:
                    'repeating-linear-gradient(135deg, rgba(255,255,255,0.16), rgba(255,255,255,0.16) 8px, transparent 8px, transparent 16px)',
                  animation: 'dangerPulse 1s ease-in-out infinite',
                }),
              },
              '@keyframes dangerPulse': {
                '0%': { filter: 'brightness(0.85)' },
                '50%': { filter: 'brightness(1.2)' },
                '100%': { filter: 'brightness(0.85)' },
              },
              '@keyframes meterAlertPulse': {
                '0%': { boxShadow: '0 0 8px rgba(217, 72, 65, 0.36)' },
                '50%': { boxShadow: '0 0 18px rgba(217, 72, 65, 0.7)' },
                '100%': { boxShadow: '0 0 8px rgba(217, 72, 65, 0.36)' },
              },
              '@keyframes meterCalmPulse': {
                '0%': { boxShadow: '0 0 5px rgba(27, 128, 196, 0.2)' },
                '50%': { boxShadow: '0 0 13px rgba(27, 128, 196, 0.48)' },
                '100%': { boxShadow: '0 0 5px rgba(27, 128, 196, 0.2)' },
              },
            }}
          />
          <Typography variant="caption" sx={{ display: 'block', mt: 0.7, color: 'text.secondary' }}>
            {medidorTexto}
          </Typography>
        </Box>

        <Typography variant="body2" sx={[plantCardSx.intervalText, mentatNumberSx]}>
          <strong>Intervalo de Rega:</strong> a cada {planta.intervalo_rega_dias} dias
        </Typography>
        <Typography variant="body2" sx={[plantCardSx.lastWatering, mentatNumberSx]}>
          <strong>Última Rega:</strong>{' '}
          {dataRegaValida
            ? `${dataRega.toLocaleDateString('pt-BR', dateOptions)} às ${dataRega.toLocaleTimeString('pt-BR', timeOptions)}`
            : 'Sem registro'}
        </Typography>

        {precisaRegar && (
          <Typography variant="body2" sx={[plantCardSx.alertText, mentatNumberSx]}>
            Atenção: precisa de água (atrasada {diasAtraso} {diasAtraso === 1 ? 'dia' : 'dias'}).
          </Typography>
        )}

        {faltaUmDiaParaRega && (
          <Typography variant="body2" sx={[plantCardSx.nearAlertText, mentatNumberSx]}>
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
            <WaterDropIcon fontSize="small" />
            &nbsp;FORNECER ÁGUA (WATER DISPENSED)
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            sx={plantCardSx.adjustButton}
            onClick={(event) => {
              event.stopPropagation();
              setDetailsOpen(true);
            }}
            startIcon={
              <Box component="span" aria-hidden="true" sx={plantCardSx.icon}>
                ⚙️
              </Box>
            }
          >
            ACESSAR PRONTUÁRIO
          </Button>
        </Stack>

        <PlantDetailsModal
          planta={planta}
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          onUpdate={onAtualizarPlanta}
          onDelete={onDelete}
        />
      </CardContent>
    </Card>
  );
}

export default PlantCard;