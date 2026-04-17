import React from 'react';
import { Button, CardContent, Container, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import SietchLayout from '../components/SietchLayout';
import SietchCard from '../components/ui/SietchCard';
import SectionTitle from '../components/ui/SectionTitle';

const clausulas = [
  {
    titulo: 'A Disciplina dos Dados',
    texto:
      'Seu Sietch é privado. As fotos, coordenadas de GPS e históricos de saúde das suas plantas pertencem apenas a você. Utilizamos regras estritas de segurança (Firebase Security Rules) para garantir que nenhuma outra pessoa acesse o seu banco botânico.',
  },
  {
    titulo: 'O Deserto é Implacável',
    texto:
      'O Sietch Boticário atua como um oráculo e conselheiro ecológico. A sobrevivência das espécies, no entanto, depende das suas ações no mundo físico. Não garantimos que suas plantas não sofrerão com pragas, clima extremo ou falhas de hardware.',
  },
  {
    titulo: 'O Exílio',
    texto:
      'Você tem o direito de purgar seus dados a qualquer momento. Ao excluir plantas ou mover para o Arquivo Morto, você controla sua própria história. O sistema se reserva o direito de excluir contas inativas que não prestarem o tributo de acesso por mais de 365 dias.',
  },
];

function Terms() {
  return (
    <SietchLayout authAwareTopbar>
      <Container maxWidth="md" sx={{ py: 8 }}>
        <SectionTitle>O TRATADO DO SIETCH</SectionTitle>
        <Typography
          align="center"
          sx={{
            mt: 1,
            mb: 5,
            color: 'text.secondary',
            letterSpacing: '0.02em',
          }}
        >
          Termos de Uso e Privacidade Botânica
        </Typography>

        <Stack spacing={4}>
          {clausulas.map((clausula, index) => (
            <SietchCard
              key={clausula.titulo}
              highlightColor={index % 2 === 0 ? '#1B80C4' : '#D39A2C'}
            >
              <CardContent sx={{ p: { xs: 2.4, sm: 3.2 } }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: 'Rajdhani, sans-serif',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    mb: 1.2,
                    color: 'text.primary',
                  }}
                >
                  {clausula.titulo}
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.primary',
                    lineHeight: 1.7,
                  }}
                >
                  {clausula.texto}
                </Typography>
              </CardContent>
            </SietchCard>
          ))}
        </Stack>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          sx={{ mt: 5, justifyContent: 'center' }}
        >
          <Button component={RouterLink} to="/" variant="outlined" color="secondary">
            Voltar para Home
          </Button>
          <Button component={RouterLink} to="/login" variant="contained" color="primary">
            Acessar Login
          </Button>
        </Stack>
      </Container>
    </SietchLayout>
  );
}

export default Terms;
