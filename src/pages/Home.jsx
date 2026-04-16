import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AppBar,
  Toolbar,
  Avatar,
  useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import mascote from '../assets/mascote.png';
import heroImg from '../assets/hero.jpg';

const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        minHeight: '100vh',
        backgroundImage:
          'radial-gradient(circle at 20% 30%, rgba(30, 58, 47, 0.15) 0%, transparent 70%)',
      }}
    >
      <AppBar
        position="fixed"
        sx={{
          background: 'rgba(10, 10, 10, 0.7)',
          backdropFilter: 'blur(15px)',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              src={mascote}
              sx={{
                width: 40,
                height: 40,
                border: `1px solid ${theme.palette.secondary.main}`,
              }}
            />
            <Typography
              variant="h6"
              sx={{ fontFamily: 'Rajdhani', fontWeight: 700, letterSpacing: '0.1em' }}
            >
              SIETCH BOTICÁRIO
            </Typography>
          </Stack>
          <Button
            variant="outlined"
            onClick={() => navigate('/login')}
            sx={{
              borderRadius: 0,
              borderColor: theme.palette.secondary.main,
              color: theme.palette.secondary.main,
            }}
          >
            IDENTIFICAR-SE
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ pt: 20, pb: 10 }}>
        <Grid container spacing={8} alignItems="center">
          <Grid size={{ xs: 12, md: 7 }}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontFamily: 'Rajdhani',
                  fontWeight: 900,
                  fontSize: { xs: '3.5rem', md: '5rem' },
                  lineHeight: 0.9,
                  mb: 3,
                  textTransform: 'uppercase',
                }}
              >
                A água é a <br />
                <Box component="span" sx={{ color: theme.palette.secondary.main }}>
                  medida da vida.
                </Box>
              </Typography>
              <Typography variant="h5" sx={{ mb: 6, color: 'text.secondary', maxWidth: '500px' }}>
                Domine a ecologia do seu espaço com telemetria avançada, biometria fotográfica e o
                instinto de sobrevivência de Arrakis.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/login')}
                sx={{
                  height: 64,
                  px: 6,
                  fontSize: '1.2rem',
                  borderRadius: 0,
                  clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0% 30%)',
                  boxShadow: `0 0 20px ${theme.palette.primary.main}60`,
                }}
              >
                INGRESSAR NO SIETCH
              </Button>
            </motion.div>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }} sx={{ display: 'flex', justifyContent: 'center' }}>
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{ position: 'relative' }}
            >
              <Box
                sx={{
                  width: 280,
                  height: 580,
                  backgroundColor: '#111',
                  borderRadius: '40px',
                  border: '8px solid #222',
                  overflow: 'hidden',
                  boxShadow: `0 50px 100px rgba(0,0,0,0.8), 0 0 20px ${theme.palette.secondary.main}30`,
                  position: 'relative',
                }}
              >
                <Box
                  component="img"
                  src={heroImg}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
              <Avatar
                src={mascote}
                sx={{
                  position: 'absolute',
                  bottom: -30,
                  right: -30,
                  width: 100,
                  height: 100,
                  border: `4px solid ${theme.palette.background.default}`,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                }}
              />
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      <Box sx={{ py: 15, backgroundColor: 'rgba(0,0,0,0.3)' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            textAlign="center"
            sx={{ fontFamily: 'Rajdhani', mb: 10, fontWeight: 700 }}
          >
            TECNOLOGIA DE SOBREVIVÊNCIA
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                icon: <RocketLaunchIcon color="info" />,
                title: 'Telemetria Hídrica',
                desc: 'Alertas táticos de umidade e rega baseados no consumo real de cada espécie.',
              },
              {
                icon: <CameraAltIcon color="secondary" />,
                title: 'Scanner de Bio-Simetria',
                desc: 'Câmera fantasma para alinhamento perfeito de fotos e timelapses evolutivos.',
              },
              {
                icon: <QrCodeScannerIcon color="success" />,
                title: 'Rastreio de Identidade',
                desc: 'Plaquetas com QR Code para acesso instantâneo ao prontuário no jardim físico.',
              },
            ].map((feature, i) => (
              <Grid size={{ xs: 12, md: 4 }} key={i}>
                <Card
                  sx={{
                    p: 4,
                    height: '100%',
                    backgroundColor: 'rgba(30, 58, 47, 0.4)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: 0,
                    borderLeft: `4px solid ${theme.palette.secondary.main}`,
                  }}
                >
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h5" sx={{ fontFamily: 'Rajdhani', fontWeight: 700, mb: 2 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.desc}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: 15 }}>
        <Typography
          variant="h4"
          textAlign="center"
          sx={{ fontFamily: 'Rajdhani', mb: 6, fontWeight: 700 }}
        >
          MANUSCRITOS DO SIETCH (FAQ)
        </Typography>
        <Accordion
          sx={{
            backgroundColor: 'transparent',
            backgroundImage: 'none',
            borderBottom: '1px solid #333',
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon color="secondary" />}>
            <Typography sx={{ fontFamily: 'Rajdhani', fontWeight: 600 }}>
              COMO FUNCIONA O MONITORAMENTO?
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography color="text.secondary">
              O sistema utiliza algoritmos de tempo e dados biométricos para prever a necessidade de
              água. Em breve, suportará integração com sensores ESP32 para leitura em tempo real.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Container>
    </Box>
  );
};

export default Home;
