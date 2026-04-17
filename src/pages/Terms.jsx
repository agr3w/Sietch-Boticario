import React from 'react';
import { CardContent, Container, Stack, Typography } from '@mui/material';
import SietchLayout from '../components/SietchLayout';
import SietchCard from '../components/ui/SietchCard';
import SectionTitle from '../components/ui/SectionTitle';

const clausulas = [
  {
    titulo: 'A Disciplina dos Dados',
    texto:
      'Seu Sietch e privado. As fotos, coordenadas de GPS e historicos de saude das suas plantas pertencem apenas a voce. Utilizamos regras estritas de seguranca (Firebase Security Rules) para garantir que nenhuma outra pessoa acesse o seu banco botanico.',
  },
  {
    titulo: 'O Deserto e Implacavel',
    texto:
      'O Sietch Boticario atua como um oraculo e conselheiro ecologico. A sobrevivencia das especies, no entanto, depende das suas acoes no mundo fisico. Nao garantimos que suas plantas nao sofrerao com pragas, clima extremo ou falhas de hardware.',
  },
  {
    titulo: 'O Exilio',
    texto:
      'Voce tem o direito de purgar seus dados a qualquer momento. Ao excluir plantas ou mover para o Arquivo Morto, voce controla sua propria historia. O sistema se reserva o direito de excluir contas inativas que nao prestarem o tributo de acesso por mais de 365 dias.',
  },
];

function Terms() {
  return (
    <SietchLayout>
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
          Termos de Uso e Privacidade Botanica
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
      </Container>
    </SietchLayout>
  );
}

export default Terms;
