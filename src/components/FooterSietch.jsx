import React from 'react';
import { Box, Container, Link, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function FooterSietch() {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        mt: 'auto',
        borderTop: '1px solid rgba(61, 40, 16, 0.1)',
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 2, md: 1 }}
          sx={{
            alignItems: { xs: 'flex-start', md: 'center' },
            justifyContent: 'space-between',
          }}
        >
          <Stack spacing={0.2}>
            <Typography
              sx={{
                color: 'text.secondary',
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: '0.82rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              SIETCH BOTICARIO
            </Typography>
            <Typography
              sx={{
                color: 'text.secondary',
                fontFamily: '"Share Tech Mono", monospace',
                fontSize: '0.72rem',
                letterSpacing: '0.04em',
              }}
            >
              v1.0-BETA
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2.2} useFlexGap sx={{ flexWrap: 'wrap' }}>
            <Link
              component={RouterLink}
              to="/suporte"
              underline="hover"
              sx={{
                color: 'text.secondary',
                fontSize: '0.86rem',
                letterSpacing: '0.02em',
              }}
            >
              Suporte/Manuscritos
            </Link>
            <Link
              component={RouterLink}
              to="/termos"
              underline="hover"
              sx={{
                color: 'text.secondary',
                fontSize: '0.86rem',
                letterSpacing: '0.02em',
              }}
            >
              Termos de Uso
            </Link>
          </Stack>

          <Typography
            sx={{
              color: 'text.secondary',
              fontFamily: '"Share Tech Mono", monospace',
              fontSize: '0.75rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            PROJETO KYNES
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}

export default FooterSietch;
