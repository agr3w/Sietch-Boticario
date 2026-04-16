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
} from '@mui/material';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Link as RouterLink } from 'react-router-dom';
import mascot from '../assets/mascote.png';
import { globalSx } from '../theme/styles';

const featureCards = [
  {
    title: 'Monitoramento Hidrico',
    description:
      'Registre rega, acompanhe intervalos criticos e mantenha cada especie na faixa ideal de sobrevivencia.',
    icon: WaterDropIcon,
  },
  {
    title: 'Camera Morfologica (Timelapse)',
    description:
      'Capture ciclos de crescimento, recupere a memoria visual da planta e compare fases com inteligencia tatica.',
    icon: CameraAltIcon,
  },
  {
    title: 'Identificacao por QR Code',
    description:
      'Acesse prontuarios com leitura instantanea e leve o historico completo para qualquer frente de cultivo.',
    icon: QrCode2Icon,
  },
];

function Home() {
  return (
    <Box
      sx={[
        globalSx.pageTexture,
        {
          minHeight: '100vh',
          pb: 8,
          background:
            'radial-gradient(circle at 10% 5%, rgba(211, 154, 44, 0.18) 0%, transparent 35%), radial-gradient(circle at 90% 20%, rgba(27, 128, 196, 0.14) 0%, transparent 44%), linear-gradient(180deg, #080F13 0%, #0D161B 100%)',
          '&::before': {
            content: '""',
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            opacity: 0.08,
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'160\' height=\'160\' viewBox=\'0 0 160 160\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'160\' height=\'160\' filter=\'url(%23n)\' opacity=\'0.55\'/%3E%3C/svg%3E")',
            backgroundRepeat: 'repeat',
            zIndex: 0,
          },
        },
      ]}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pt: { xs: 8, md: 11 } }}>
        <Box sx={{ minHeight: { xs: '78vh', md: '86vh' }, display: 'flex', alignItems: 'center' }}>
          <Grid container spacing={5} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Stack spacing={3}>
                <Typography
                  component="h1"
                  sx={{
                    fontFamily: 'Rajdhani, sans-serif',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    lineHeight: 0.95,
                    color: 'text.primary',
                    fontSize: { xs: '2.2rem', sm: '3.4rem', md: '4.4rem' },
                  }}
                >
                  Domine a ecologia do seu espaco
                </Typography>
                <Typography
                  sx={{
                    color: 'rgba(245, 242, 235, 0.88)',
                    fontSize: { xs: '1rem', md: '1.15rem' },
                    maxWidth: 760,
                    letterSpacing: '0.01em',
                    lineHeight: 1.55,
                  }}
                >
                  O Sietch Boticario e um sistema Fremen de telemetria e memoria botanica.
                  Transforme suas plantas em sobreviventes.
                </Typography>
                <Box>
                  <Button
                    component={RouterLink}
                    to="/login"
                    variant="contained"
                    size="large"
                    sx={{
                      minWidth: { xs: '100%', sm: 320 },
                      py: 1.5,
                      fontSize: '1rem',
                      background: 'linear-gradient(135deg, #0D6FA8 0%, #1B80C4 60%, #62B8F0 100%)',
                      boxShadow: '0 0 26px rgba(27, 128, 196, 0.45)',
                    }}
                  >
                    [ Ingressar no Sietch ]
                  </Button>
                </Box>
              </Stack>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: { xs: 'center', md: 'flex-end' },
                }}
              >
                <Box
                  component="img"
                  src={mascot}
                  alt="Muad'Dib, mascote do Sietch Boticario"
                  sx={{
                    width: { xs: 220, sm: 280, md: 340 },
                    maxWidth: '100%',
                    filter: 'drop-shadow(0 0 28px rgba(98, 184, 240, 0.65))',
                    animation: 'mascotPulse 2800ms ease-in-out infinite',
                    '@keyframes mascotPulse': {
                      '0%': { transform: 'translateY(0px) scale(1)' },
                      '50%': { transform: 'translateY(-6px) scale(1.02)' },
                      '100%': { transform: 'translateY(0px) scale(1)' },
                    },
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ py: { xs: 6, md: 9 } }}>
          <Typography
            sx={{
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
              color: 'text.primary',
              mb: 3,
              fontSize: { xs: '1.8rem', md: '2.4rem' },
            }}
          >
            Arsenal de Sobrevivencia
          </Typography>

          <Grid container spacing={2.2}>
            {featureCards.map(({ title, description, icon: Icon }) => (
              <Grid size={{ xs: 12, md: 4 }} key={title}>
                <Card
                  sx={{
                    minHeight: '100%',
                    border: '1px solid rgba(211, 154, 44, 0.48)',
                    background:
                      'linear-gradient(180deg, rgba(23, 30, 33, 0.9) 0%, rgba(17, 24, 27, 0.84) 100%)',
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={2}>
                      <Icon sx={{ fontSize: 46, color: 'info.main' }} />
                      <Typography sx={{ fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                        {title}
                      </Typography>
                      <Typography sx={{ color: 'rgba(245, 242, 235, 0.84)' }}>{description}</Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ py: { xs: 6, md: 9 } }}>
          <Typography
            sx={{
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
              color: 'text.primary',
              mb: 3,
              fontSize: { xs: '1.8rem', md: '2.4rem' },
            }}
          >
            Tributo de Agua
          </Typography>

          <Grid container spacing={2.2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ border: '1px solid rgba(126, 195, 241, 0.5)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={1.8}>
                    <Typography sx={{ color: 'secondary.main', textTransform: 'uppercase', fontWeight: 700 }}>
                      Plano Forasteiro
                    </Typography>
                    <Typography sx={{ fontSize: '2rem', fontWeight: 700 }}>Gratis</Typography>
                    <Typography sx={{ color: 'rgba(245, 242, 235, 0.84)' }}>Ate 5 plantas por nucleo</Typography>
                    <Typography sx={{ color: 'rgba(245, 242, 235, 0.84)' }}>Diario basico de rega e historico</Typography>
                    <Typography sx={{ color: 'rgba(245, 242, 235, 0.84)' }}>Acesso ao scanner e QR tatico</Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Card
                sx={{
                  border: '1px solid rgba(211, 154, 44, 0.62)',
                  background:
                    'linear-gradient(165deg, rgba(31, 46, 50, 0.94) 0%, rgba(22, 31, 35, 0.9) 100%)',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={1.8}>
                    <Typography sx={{ color: 'secondary.main', textTransform: 'uppercase', fontWeight: 700 }}>
                      Plano Fremen (Pro)
                    </Typography>
                    <Typography sx={{ fontSize: '2rem', fontWeight: 700 }}>Em breve</Typography>
                    <Typography sx={{ color: 'rgba(245, 242, 235, 0.84)' }}>Plantas ilimitadas e celulas de cultivo</Typography>
                    <Typography sx={{ color: 'rgba(245, 242, 235, 0.84)' }}>Alertas automaticos de sobrevivencia</Typography>
                    <Typography sx={{ color: 'rgba(245, 242, 235, 0.84)' }}>Integracao com sensores IoT e telemetria</Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ py: { xs: 6, md: 9 } }}>
          <Typography
            sx={{
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
              color: 'text.primary',
              mb: 2.4,
              fontSize: { xs: '1.8rem', md: '2.4rem' },
            }}
          >
            FAQ
          </Typography>

          <Stack spacing={1.2}>
            <Accordion disableGutters>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'text.primary' }} />}>
                <Typography sx={{ fontWeight: 700 }}>Preciso instalar algo nas plantas?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ color: 'rgba(245, 242, 235, 0.82)' }}>
                  Nao. O plano gratuito funciona com registro manual e camera. Sensores IoT entram no plano
                  Fremen Pro.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion disableGutters>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'text.primary' }} />}>
                <Typography sx={{ fontWeight: 700 }}>Posso usar no celular durante o cultivo?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ color: 'rgba(245, 242, 235, 0.82)' }}>
                  Sim. O fluxo foi pensado para operacao movel com scanner, timelapse e prontuario por QR.
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion disableGutters>
              <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'text.primary' }} />}>
                <Typography sx={{ fontWeight: 700 }}>Meus dados ficam isolados?</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ color: 'rgba(245, 242, 235, 0.82)' }}>
                  Sim. Cada Sietch e isolado por UID no Firebase, com regras de acesso por usuario.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

export default Home;
