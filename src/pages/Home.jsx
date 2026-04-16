import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import RadarOutlinedIcon from '@mui/icons-material/RadarOutlined';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import QrCode2OutlinedIcon from '@mui/icons-material/QrCode2Outlined';
import { Link as RouterLink } from 'react-router-dom';
import mascot from '../assets/mascote.png';
import heroPreview from '../assets/hero.png';

const featureCards = [
  {
    title: 'TELEMETRIA HIDRICA',
    description:
      'Monitoramento de secas com alertas de precisão antes que a planta atinja nível crítico.',
    icon: RadarOutlinedIcon,
    iconColor: '#62B8F0',
  },
  {
    title: 'SCANNER MORFOLOGICO',
    description:
      'Câmera fantasma que cria uma linha do tempo perfeita da evolução da sua planta.',
    icon: CameraAltOutlinedIcon,
    iconColor: '#58D68D',
  },
  {
    title: 'RASTREIO BIOMETRICO',
    description:
      'Gere plaquetas táticas para escanear e acessar o prontuário da planta instantaneamente no jardim.',
    icon: QrCode2OutlinedIcon,
    iconColor: '#E2A72E',
  },
];

function Home() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at 12% 10%, rgba(211, 154, 44, 0.2) 0%, transparent 34%), radial-gradient(circle at 88% 20%, rgba(27, 128, 196, 0.16) 0%, transparent 42%), linear-gradient(180deg, #090F13 0%, #0E171C 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.08,
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'160\' height=\'160\' viewBox=\'0 0 160 160\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.92\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'160\' height=\'160\' filter=\'url(%23n)\' opacity=\'0.55\'/%3E%3C/svg%3E")',
          backgroundRepeat: 'repeat',
          zIndex: 0,
        },
      }}
    >
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: 'rgba(20, 20, 20, 0.6)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(211, 154, 44, 0.32)',
        }}
      >
        <Toolbar sx={{ minHeight: 72 }}>
          <Container
            maxWidth="lg"
            sx={{
              px: '0 !important',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Stack direction="row" spacing={1.2} alignItems="center">
              <Avatar src={mascot} alt="Mascote do Sietch" sx={{ width: 42, height: 42 }} />
              <Typography
                sx={{
                  fontFamily: 'Rajdhani, sans-serif',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'text.primary',
                }}
              >
                SIETCH BOTICÁRIO
              </Typography>
            </Stack>

            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              sx={{
                color: 'text.primary',
                borderColor: 'rgba(245, 242, 235, 0.55)',
                px: 2.2,
                '&:hover': {
                  borderColor: '#7EC3F1',
                  backgroundColor: 'rgba(126, 195, 241, 0.14)',
                },
              }}
            >
              Entrar
            </Button>
          </Container>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="lg"
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          pt: { xs: 12, md: 14 },
          pb: { xs: 6, md: 8 },
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Grid container spacing={{ xs: 5, md: 6 }} alignItems="center">
          <Grid size={{ xs: 12, md: 7 }}>
            <Stack spacing={3}>
              <Typography
                component="h1"
                sx={{
                  fontFamily: 'Rajdhani, sans-serif',
                  fontWeight: 800,
                  lineHeight: 0.9,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: 'text.primary',
                  fontSize: { xs: '2.5rem', sm: '3.8rem', md: '5.3rem' },
                }}
              >
                A Água é a Medida da Vida
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  color: 'rgba(224, 231, 237, 0.9)',
                  fontWeight: 500,
                  lineHeight: 1.4,
                  maxWidth: 760,
                  fontSize: { xs: '1.08rem', sm: '1.35rem' },
                }}
              >
                Domine a ecologia do seu espaço com telemetria, biometria e histórico de saúde botânica.
              </Typography>

              <Box sx={{ pt: 0.8 }}>
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="contained"
                  size="large"
                  sx={{
                    minWidth: { xs: '100%', sm: 380 },
                    py: 1.7,
                    fontSize: '1rem',
                    fontWeight: 800,
                    letterSpacing: '0.06em',
                    background: 'linear-gradient(135deg, #0D6FA8 0%, #1B80C4 58%, #71C2F5 100%)',
                    boxShadow: '0 0 0 1px rgba(245, 242, 235, 0.18) inset, 0 0 30px rgba(27, 128, 196, 0.56)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0F79B6 0%, #2A90D3 58%, #87D1FA 100%)',
                      boxShadow: '0 0 0 1px rgba(245, 242, 235, 0.3) inset, 0 0 36px rgba(27, 128, 196, 0.7)',
                    },
                  }}
                >
                  Iniciar Meu Sietch Grátis
                </Button>
              </Box>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                maxWidth: 480,
                mx: { xs: 'auto', md: 0 },
                animation: 'heroLevitate 3600ms ease-in-out infinite',
                '@keyframes heroLevitate': {
                  '0%': { transform: 'translateY(0px)' },
                  '50%': { transform: 'translateY(-10px)' },
                  '100%': { transform: 'translateY(0px)' },
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: '-8% -4% auto -4%',
                  height: '65%',
                  background:
                    'radial-gradient(circle at 50% 40%, rgba(27, 128, 196, 0.42) 0%, rgba(27, 128, 196, 0) 70%)',
                  filter: 'blur(16px)',
                  pointerEvents: 'none',
                  zIndex: -1,
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: '-8%',
                  left: '-18%',
                  width: '34%',
                  height: '120%',
                  background:
                    'linear-gradient(90deg, rgba(126, 195, 241, 0) 0%, rgba(126, 195, 241, 0.22) 48%, rgba(126, 195, 241, 0) 100%)',
                  filter: 'blur(1px)',
                  pointerEvents: 'none',
                  animation: 'hudSweep 4200ms ease-in-out infinite',
                },
                '@keyframes hudSweep': {
                  '0%': { transform: 'translateX(-35%) skewX(-8deg)', opacity: 0 },
                  '20%': { opacity: 0.65 },
                  '50%': { opacity: 0.42 },
                  '100%': { transform: 'translateX(305%) skewX(-8deg)', opacity: 0 },
                },
              }}
            >
              <Box
                sx={{
                  p: 1,
                  border: '1px solid rgba(126, 195, 241, 0.52)',
                  background:
                    'linear-gradient(180deg, rgba(16, 27, 34, 0.94) 0%, rgba(11, 20, 26, 0.94) 100%)',
                  clipPath:
                    'polygon(18px 0, 100% 0, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0 100%, 0 18px)',
                  boxShadow: '0 20px 42px rgba(0, 0, 0, 0.44), 0 0 22px rgba(27, 128, 196, 0.36)',
                }}
              >
                <Box
                  component="img"
                  src={heroPreview}
                  alt="Prévia do painel Sietch Boticário"
                  sx={{
                    width: '100%',
                    height: { xs: 250, sm: 300, md: 330 },
                    objectFit: 'cover',
                    clipPath:
                      'polygon(14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%, 0 14px)',
                    border: '1px solid rgba(245, 242, 235, 0.25)',
                    filter: 'contrast(1.08) saturate(1.04)',
                  }}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Box sx={{ py: 10, position: 'relative', zIndex: 1 }}>
        <Container maxWidth="lg">
          <Typography
            align="center"
            sx={{
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'text.primary',
              mb: 5,
              fontSize: { xs: '1.8rem', md: '2.6rem' },
            }}
          >
            Tecnologia de Sobrevivência
          </Typography>

          <Grid container spacing={4}>
            {featureCards.map(({ title, description, icon: Icon, iconColor }) => (
              <Grid key={title} size={{ xs: 12, md: 4 }}>
                <Card
                  sx={{
                    minHeight: '100%',
                    background: 'rgba(30, 58, 47, 0.4)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(211, 154, 44, 0.54)',
                    clipPath:
                      'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)',
                    boxShadow: '0 14px 28px rgba(0, 0, 0, 0.34)',
                  }}
                >
                  <CardContent sx={{ p: 3.2 }}>
                    <Stack spacing={2}>
                      <Icon sx={{ fontSize: '2.2rem', color: iconColor }} />
                      <Typography
                        sx={{
                          fontFamily: 'Rajdhani, sans-serif',
                          fontWeight: 800,
                          letterSpacing: '0.05em',
                          textTransform: 'uppercase',
                          color: 'text.primary',
                        }}
                      >
                        {title}
                      </Typography>
                      <Typography
                        sx={{
                          color: 'rgba(245, 242, 235, 0.86)',
                          lineHeight: 1.6,
                        }}
                      >
                        {description}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}

export default Home;
