import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Chip,
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
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import mascote from '../assets/mascote.png';
import heroImg from '../assets/hero.jpg';
import SietchCard from '../components/ui/SietchCard';

const Home = () => {
  const MotionDiv = motion.div;
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        minHeight: '100vh',
        backgroundImage:
          'radial-gradient(circle at 20% 30%, rgba(52, 90, 20, 0.08) 0%, transparent 70%)',
      }}
    >
      <AppBar
        position="fixed"
        sx={{
          background: 'rgba(245, 236, 215, 0.7)',
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
              
              sx={{ fontFamily: 'Rajdhani', fontWeight: 700, letterSpacing: '0.1em', color: "text.primary" }}
            >
              SIETCH BOTICÁRIO
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
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
          </Stack>
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
                  color: 'text.primary',
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
              <MotionDiv
                initial={{ opacity: 0, y: -20, scale: 0.94 }}
                animate={{ opacity: 1, y: [-20, 0, -8, 0], scale: 1 }}
                transition={{ delay: 2, duration: 0.9, times: [0, 0.62, 0.82, 1], ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  top: 18,
                  left: -28,
                  zIndex: 3,
                }}
              >
                <Box
                  sx={{
                    width: { xs: 220, sm: 250 },
                    p: 1.2,
                    borderRadius: '14px',
                    backgroundColor: 'rgba(242, 248, 244, 0.96)',
                    border: '1px solid rgba(0,0,0,0.12)',
                    boxShadow: '0 14px 34px rgba(0,0,0,0.38)',
                  }}
                >
                  <Stack direction="row" spacing={1.2} alignItems="flex-start">
                    <WhatsAppIcon sx={{ color: '#25D366', mt: 0.1 }} />
                    <Box>
                      <Typography
                        sx={{
                          color: '#111',
                          fontFamily: 'Rajdhani',
                          fontWeight: 700,
                          lineHeight: 1.1,
                          letterSpacing: '0.03em',
                        }}
                      >
                        Sietch Alerta
                      </Typography>
                      <Typography sx={{ color: '#223', fontSize: '0.82rem', lineHeight: 1.3 }}>
                        A umidade da Jiboia caiu para 15%. Forneca agua imediatamente.
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </MotionDiv>

              <Box
                sx={{
                  width: 280,
                  height: 580,
                  backgroundColor: '#E9E3D3',
                  borderRadius: '40px',
                  border: '8px solid rgba(61, 40, 16, 0.22)',
                  overflow: 'hidden',
                  boxShadow:
                    '0 28px 60px rgba(61, 40, 16, 0.24), 0 0 14px rgba(166, 77, 19, 0.16)',
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

      <Box sx={{ py: 15 }}>
        <Container maxWidth="md">
          <MotionDiv
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            <Stack spacing={3} textAlign="center" alignItems="center">
              <Typography
                sx={{
                  color: 'secondary.main',
                  fontFamily: 'Rajdhani',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                A DISCIPLINA DA ÁGUA
              </Typography>

              <Typography
                variant="h3"
                sx={{
                  fontFamily: 'Rajdhani',
                  fontWeight: 800,
                  lineHeight: 1.05,
                  maxWidth: 920,
                }}
              >
                A maioria das plantas não morre de sede. Elas afogam no excesso de cuidado ou secam no
                esquecimento cego.
              </Typography>

              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 820, lineHeight: 1.6 }}>
                O Sietch Boticário remove a adivinhação da botânica. Através de telemetria precisa e
                memória fotográfica, nós ensinamos você a ler os sinais de sobrevivência do seu jardim.
              </Typography>
            </Stack>
          </MotionDiv>
        </Container>
      </Box>

      <Box sx={{ py: 15, backgroundColor: '#EEF0E8' }}>
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
                <SietchCard
                  highlightColor={theme.palette.secondary.main}
                  sx={{
                    p: 4,
                    height: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.4)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h5" sx={{ fontFamily: 'Rajdhani', fontWeight: 700, mb: 2 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.desc}
                  </Typography>
                </SietchCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: 15, backgroundColor: 'rgba(61, 40, 16, 0.03)' }}>
        <Container maxWidth="md">
          <Typography
            variant="h3"
            textAlign="center"
            sx={{ fontFamily: 'Rajdhani', mb: 10, fontWeight: 700 }}
          >
            PROTOCOLO DE INICIAÇÃO
          </Typography>

          <Stack spacing={6}>
            {[
              {
                title: 'INICIAÇÃO',
                desc: 'O registro do Dia Zero utiliza processamento de imagem para criar a base da sua linha do tempo.',
                tags: ['Firebase Storage', 'Bio-Scanner'],
              },
              {
                title: 'SINCRONIA',
                desc: 'Cérebro automatizado que envia telemetria vital e alertas de rega diretamente para o seu comunicador (WhatsApp).',
                tags: ['n8n Automation', 'WhatsApp Gateway'],
              },
              {
                title: 'EVOLUÇÃO',
                desc: 'Identificação física via QR Code e arquitetura preparada para recepção de dados via sensores de solo externos.',
                tags: ['QR Protocol', 'ESP32/IoT Ready'],
              },
            ].map((step, index) => (
              <MotionDiv
                key={step.title}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                whileHover="hover"
                transition={{ delay: index * 0.3, duration: 0.5 }}
                viewport={{ once: true, amount: 0.35 }}
              >
                <Box
                  sx={{
                    pl: { xs: 0, sm: 4 },
                    borderLeft: { xs: 'none', sm: `2px solid ${theme.palette.secondary.main}66` },
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: 'Rajdhani',
                      fontWeight: 700,
                      letterSpacing: '0.08em',
                      color: 'secondary.main',
                      textTransform: 'uppercase',
                      mb: 1,
                    }}
                  >
                    {step.title}
                  </Typography>
                  <Typography variant="h5" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                    {step.desc}
                  </Typography>

                  <Stack direction="row" spacing={1.5} mt={3} flexWrap="wrap" useFlexGap>
                    {step.tags.map((tag) => (
                      <MotionDiv
                        key={tag}
                        variants={{
                          hover: {
                            y: -2,
                            boxShadow: `0 0 16px ${theme.palette.primary.main}80`,
                          },
                        }}
                        transition={{ duration: 0.25 }}
                        style={{ borderRadius: 999 }}
                      >
                        <Chip
                          label={tag}
                          sx={{
                            borderRadius: 999,
                            border: `1px solid ${theme.palette.primary.main}99`,
                            backgroundColor: 'rgba(11,95,123,0.12)',
                            color: theme.palette.text.primary,
                            fontWeight: 600,
                            letterSpacing: '0.02em',
                          }}
                        />
                      </MotionDiv>
                    ))}
                  </Stack>
                </Box>
              </MotionDiv>
            ))}
          </Stack>
        </Container>
      </Box>

      <Box sx={{ py: 15 }}>
        <Container maxWidth="md">
          <Typography
            variant="h3"
            textAlign="center"
            sx={{ fontFamily: 'Rajdhani', mb: 2, fontWeight: 700 }}
          >
            CICLO DE CRESCIMENTO
          </Typography>
          <Typography textAlign="center" color="text.secondary" sx={{ mb: 8 }}>
            Roadmap vivo do sistema, da fundacao operacional ate a maturidade autonoma.
          </Typography>

          <Box sx={{ position: 'relative', pl: { xs: 0, sm: 10 } }}>
            <Box
              aria-hidden
              sx={{
                position: 'absolute',
                left: { xs: 10, sm: 34 },
                top: 0,
                bottom: 0,
                width: '4px',
                borderRadius: 999,
                background:
                  'linear-gradient(to top, rgba(61,40,16,0.18) 0%, rgba(52,90,20,0.38) 58%, rgba(98,193,154,0.92) 100%)',
              }}
            />

            <Stack spacing={5}>
              {[
                {
                  phase: 'RAÍZES (CONCLUÍDO)',
                  desc: 'Gestão Hídrica, Galeria de Fotos e Autenticação.',
                },
                {
                  phase: 'CAULE (EM DESENVOLVIMENTO)',
                  desc: 'Sincronização com sensores físicos de umidade e temperatura.',
                },
                {
                  phase: 'FOLHAGEM (FUTURO)',
                  desc: 'IA para diagnóstico de pragas via foto e automação de sistemas de irrigação via hardware.',
                },
              ].map((item, index) => (
                <MotionDiv
                  key={item.phase}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.18, duration: 0.45 }}
                  viewport={{ once: true, amount: 0.4 }}
                >
                  <Stack direction="row" spacing={3} alignItems="flex-start">
                    <Box
                      sx={{
                        mt: 1,
                        ml: { xs: 0.7, sm: 0 },
                        minWidth: 18,
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        backgroundColor: index === 0 ? '#8B6F4E' : index === 1 ? '#4F7A49' : '#62C19A',
                        boxShadow:
                          index === 2
                            ? '0 0 14px rgba(98,193,154,0.75)'
                            : '0 0 8px rgba(61,40,16,0.24)',
                      }}
                    />

                    <SietchCard
                      highlightColor={index === 2 ? '#62C19A' : theme.palette.secondary.main}
                      sx={{
                        flex: 1,
                        p: 3.5,
                        backgroundColor: 'rgba(255, 255, 255, 0.45)',
                        borderLeftWidth: '3px',
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: 'Rajdhani',
                          fontWeight: 700,
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                          mb: 1,
                        }}
                      >
                        {item.phase}
                      </Typography>
                      <Typography variant="h6" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                        {item.desc}
                      </Typography>
                    </SietchCard>
                  </Stack>
                </MotionDiv>
              ))}
            </Stack>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: 15 }}>
        <MotionDiv
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <SietchCard
            sx={{
              p: { xs: 5, md: 8 },
              borderRadius: 0,
              textAlign: 'center',
              background: 'radial-gradient(circle at center, #DCEBDD 0%, #EEF0E8 55%, #E6DCC4 100%)',
              borderTop: `2px solid ${theme.palette.secondary.main}`,
              borderBottom: `2px solid ${theme.palette.secondary.main}`,
              boxShadow: '0 20px 44px rgba(61, 40, 16, 0.16)',
            }}
          >
            <Stack spacing={4} alignItems="center">
              <Typography
                variant="h2"
                sx={{
                  fontFamily: 'Rajdhani',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                }}
              >
                O DESERTO AGUARDA.
              </Typography>

              <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700 }}>
                Proteja a vida do seu espaço. Comece seu arquivo botânico hoje.
              </Typography>

              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/login')}
                sx={{
                  minHeight: 72,
                  px: { xs: 4, sm: 8 },
                  borderRadius: 0,
                  fontSize: { xs: '1rem', sm: '1.15rem' },
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                }}
              >
                ESTABELECER MEU SIETCH
              </Button>
            </Stack>
          </SietchCard>
        </MotionDiv>
      </Container>

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
            borderBottom: '1px solid rgba(61, 40, 16, 0.2)',
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
