import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';

const primeirosPassos = [
  {
    title: 'A Regra do Dedo',
    description:
      'Na duvida se deve regar? Afunde o dedo 2cm na terra. Se sair sujo e umido, nao regue. Se sair limpo e seco, forneca agua.',
  },
  {
    title: 'Sinais Vitais',
    description:
      'Folhas amarelas e moles indicam excesso de agua (afogamento). Folhas secas e crocantes indicam falta cronica de agua.',
  },
  {
    title: 'Adaptacao',
    description:
      'Ao cadastrar uma planta nova, de a ela 7 dias de observacao na meia-sombra antes de expo-la ao sol direto.',
  },
];

const faqs = [
  {
    question: 'Como o Sietch calcula o tempo de rega?',
    answer:
      'No momento, usamos a matematica de intervalos fixos baseada no seu ultimo registro. Na V1.1, teremos inteligencia climatica.',
  },
  {
    question: 'Posso compartilhar meu Prontuario QR?',
    answer:
      'Sim! Qualquer pessoa que escanear a plaqueta vera a versao publica da sua planta.',
  },
  {
    question: 'O que faco se perder uma rotina de cuidado?',
    answer:
      'Abra o prontuario, registre a observacao manual e retome o ciclo no mesmo dia. Consistencia moderada vale mais que perfeicao ocasional.',
  },
];

function Support() {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      
      <Container maxWidth="md" sx={{ py: 10 }}>
        <Stack spacing={4.5}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
            }}
          >
            <Button
              variant="text"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/dashboard')}
              sx={{
                borderRadius: 0,
                color: 'primary.main',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Voltar para o Dashboard
            </Button>
          </Box>

          <Box textAlign="center">
            <Typography
              variant="h3"
              sx={{
                fontFamily: 'Rajdhani',
                color: 'primary.main',
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                mb: 1,
              }}
            >
              MANUSCRITOS DE KYNES
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Guia de sobrevivencia e suporte tatico para o seu ecossistema.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {primeirosPassos.map((item) => (
              <Grid size={{ xs: 12, md: 4 }} key={item.title}>
                <Card
                  sx={{
                    height: '100%',
                    backgroundColor: 'background.paper',
                    border: '1px solid rgba(61, 40, 16, 0.1)',
                    boxShadow: '0 8px 18px rgba(61, 40, 16, 0.08)',
                  }}
                >
                  <CardContent>
                    <Typography
                      sx={{
                        fontFamily: 'Rajdhani',
                        color: 'secondary.main',
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        mb: 1,
                        textTransform: 'uppercase',
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography color="text.primary" sx={{ lineHeight: 1.55 }}>
                      {item.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box>
            <Typography
              variant="h4"
              sx={{
                fontFamily: 'Rajdhani',
                fontWeight: 700,
                color: 'primary.main',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                mb: 2,
              }}
            >
              DUVIDAS FREQUENTES
            </Typography>

            <Stack spacing={1.25}>
              {faqs.map((faq) => (
                <Accordion
                  key={faq.question}
                  disableGutters
                  elevation={0}
                  sx={{
                    backgroundColor: 'background.paper',
                    border: '1px solid rgba(61, 40, 16, 0.1)',
                    '&::before': { display: 'none' },
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: 'secondary.main' }} />}
                    sx={{
                      '& .MuiAccordionSummary-content': {
                        my: 1.2,
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        color: 'text.primary',
                        fontWeight: 700,
                        fontFamily: 'Rajdhani',
                        letterSpacing: '0.03em',
                      }}
                    >
                      {faq.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {faq.answer}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Stack>
          </Box>

          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.secondary, textAlign: 'center' }}
          >
            Suporte orientado por observacao. Menos adivinhacao, mais leitura do ecossistema.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}

export default Support;
