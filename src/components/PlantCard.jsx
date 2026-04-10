import { Card, CardContent, Typography, Button } from '@mui/material';

function PlantCard({ planta, onRegar }) {
  const dataRega = new Date(planta.ultima_rega);
  const dateOptions = { timeZone: 'America/Sao_Paulo' };
  const timeOptions = { timeZone: 'America/Sao_Paulo' };

  return (
    <Card elevation={3} sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {planta.nome_apelido}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Espécie: {planta.especie} | Local: {planta.localizacao}
        </Typography>

        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>Intervalo de Rega:</strong> a cada {planta.intervalo_rega_dias} dias
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          <strong>Última Rega:</strong> {dataRega.toLocaleDateString('pt-BR', dateOptions)} às{' '}
          {dataRega.toLocaleTimeString('pt-BR', timeOptions)}
        </Typography>

        <Button variant="contained" color="info" fullWidth onClick={() => onRegar(planta.id)}>
          💧 Registrar Rega (Dar Água)
        </Button>
      </CardContent>
    </Card>
  );
}

export default PlantCard;