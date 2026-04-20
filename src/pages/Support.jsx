import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SensorsIcon from '@mui/icons-material/Sensors';
import { useNavigate } from 'react-router-dom';
import ReleaseBadge from '../components/ui/ReleaseBadge';
import SietchCard from '../components/ui/SietchCard';

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
      'No momento, usamos a matematica de intervalos fixos baseada no seu ultimo registro. Na V1.1, teremos inteligencia climatica e alertas externos. (Recurso em fase de testes nos destiladores - Chegando na atualizacao V1.1).',
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
            <ReleaseBadge sx={{ mb: 1.2 }} />
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

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.2}
            sx={{ justifyContent: 'center' }}
          >
            <Button
              component="a"
              href="#manual"
              variant="outlined"
              sx={{ borderRadius: 0, borderColor: 'secondary.main', color: 'secondary.main' }}
            >
              Manual do Destilador
            </Button>
            <Button
              component="a"
              href="#guia"
              variant="outlined"
              sx={{ borderRadius: 0, borderColor: 'secondary.main', color: 'secondary.main' }}
            >
              Tratado Basico
            </Button>
            <Button
              component="a"
              href="#futuro"
              variant="outlined"
              sx={{ borderRadius: 0, borderColor: 'secondary.main', color: 'secondary.main' }}
            >
              Protocolos 1.1
            </Button>
          </Stack>

          <Box id="manual" sx={{ scrollMarginTop: 90 }}>
            <Typography
              variant="overline"
              sx={{
                color: 'secondary.main',
                letterSpacing: '0.12em',
                fontWeight: 700,
              }}
            >
              SECAO 1 · O MANUAL DO DESTILADOR
            </Typography>
            <Grid container spacing={2} sx={{ mt: 0.2 }}>
              <Grid size={{ xs: 12, md: 4 }}>
                <SietchCard sx={{ height: '100%' }}>
                  <CardContent>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <QrCode2Icon sx={{ color: 'secondary.main' }} />
                      <Typography sx={{ fontFamily: 'Rajdhani', fontWeight: 700 }}>QR Code</Typography>
                    </Stack>
                    <Typography color="text.secondary">
                      Rastreio fisico imediato. Escaneie a plaqueta e acesse o prontuario sem navegar pelo app.
                    </Typography>
                  </CardContent>
                </SietchCard>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <SietchCard sx={{ height: '100%' }}>
                  <CardContent>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <CameraAltIcon sx={{ color: 'secondary.main' }} />
                      <Typography sx={{ fontFamily: 'Rajdhani', fontWeight: 700 }}>Bio-Scanner</Typography>
                    </Stack>
                    <Typography color="text.secondary">
                      Alinhamento visual de fotos para comparar mudancas reais da planta ao longo das semanas.
                    </Typography>
                  </CardContent>
                </SietchCard>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <SietchCard sx={{ height: '100%' }}>
                  <CardContent>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <WaterDropIcon sx={{ color: 'secondary.main' }} />
                      <Typography sx={{ fontFamily: 'Rajdhani', fontWeight: 700 }}>Telemetria</Typography>
                    </Stack>
                    <Typography color="text.secondary">
                      Leitura do medidor de agua com base no intervalo registrado para reduzir excesso e escassez.
                    </Typography>
                  </CardContent>
                </SietchCard>
              </Grid>
            </Grid>
          </Box>

          <Box id="guia" sx={{ scrollMarginTop: 90 }}>
            <Typography
              variant="overline"
              sx={{
                color: 'secondary.main',
                letterSpacing: '0.12em',
                fontWeight: 700,
              }}
            >
              SECAO 2 · TRATADO DE BOTANICA BASICA
            </Typography>
            <Stack spacing={1.2} sx={{ mt: 0.5 }}>
              <SietchCard>
                <CardContent>
                  <Typography sx={{ fontFamily: 'Rajdhani', fontWeight: 700, color: 'primary.main' }}>
                    Jiboia (Epipremnum aureum)
                  </Typography>
                  <Typography color="text.secondary">
                    A sobrevivente. Luz indireta, rega quando a terra secar totalmente.
                  </Typography>
                </CardContent>
              </SietchCard>
              <SietchCard>
                <CardContent>
                  <Typography sx={{ fontFamily: 'Rajdhani', fontWeight: 700, color: 'primary.main' }}>
                    Espada de Sao Jorge (Sansevieria)
                  </Typography>
                  <Typography color="text.secondary">
                    A guardia. Extremamente resistente a seca, ideal para cantos com pouca luz.
                  </Typography>
                </CardContent>
              </SietchCard>
            </Stack>
          </Box>

          <Box id="futuro" sx={{ scrollMarginTop: 90 }}>
            <Typography
              variant="overline"
              sx={{
                color: 'secondary.main',
                letterSpacing: '0.12em',
                fontWeight: 700,
              }}
            >
              SECAO 3 · PROTOCOLOS FUTUROS (VERSAO 1.1)
            </Typography>
            <SietchCard sx={{ mt: 0.5 }}>
              <CardContent>
                <Stack spacing={1.4}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <AutoAwesomeIcon sx={{ color: 'secondary.main' }} />
                    <Typography sx={{ fontFamily: 'Rajdhani', fontWeight: 700, color: 'primary.main' }}>
                      Alerta de Rega via WhatsApp Integrado
                    </Typography>
                  </Stack>
                  <Typography color="text.secondary">
                    Notificacoes automaticas no celular quando a planta entrar em janela critica de hidratação. (Recurso em fase de testes nos destiladores - Chegando na atualizacao V1.1).
                  </Typography>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <AutoAwesomeIcon sx={{ color: 'secondary.main' }} />
                    <Typography sx={{ fontFamily: 'Rajdhani', fontWeight: 700, color: 'primary.main' }}>
                      Catalogo Inteligente
                    </Typography>
                  </Stack>
                  <Typography color="text.secondary">
                    Recomendacoes automaticas por especie, contexto de luz e historico de resposta da planta.
                  </Typography>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <SensorsIcon sx={{ color: 'secondary.main' }} />
                    <Typography sx={{ fontFamily: 'Rajdhani', fontWeight: 700, color: 'primary.main' }}>
                      Sensores IoT
                    </Typography>
                  </Stack>
                  <Typography color="text.secondary">
                    Integracao com sensores de umidade e temperatura para alertas taticos em tempo quase real. (Recurso em fase de testes nos destiladores - Chegando na atualizacao V1.1).
                  </Typography>
                </Stack>
              </CardContent>
            </SietchCard>
          </Box>

          <Grid container spacing={3}>
            {primeirosPassos.map((item) => (
              <Grid size={{ xs: 12, md: 4 }} key={item.title}>
                <SietchCard
                  sx={{
                    height: '100%',
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
                </SietchCard>
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
