import { Box, Button, ButtonBase, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import mascot from '../assets/mascote.png';
import { globalSx } from '../theme/styles';

function TopbarSietch() {
  const navigate = useNavigate();
  const location = useLocation();
  const emSuporte = location.pathname.startsWith('/suporte') || location.pathname.startsWith('/support');

  return (
    <Box sx={globalSx.appTopbar}>
      <ButtonBase
        onClick={() => navigate('/dashboard')}
        aria-label="Voltar para o dashboard"
        sx={{ borderRadius: 0 }}
      >
        <Box sx={globalSx.appBrand}>
          <Box component="img" src={mascot} alt="Mascote do Sietch Boticario" sx={globalSx.appMascot} />
          <Typography component="h1" sx={globalSx.appBrandTitle}>
            SIETCH BOTICÁRIO
          </Typography>
        </Box>
      </ButtonBase>
      <Button
        variant="text"
        onClick={() => navigate(emSuporte ? '/dashboard' : '/suporte')}
        sx={{
          borderRadius: 0,
          color: 'primary.main',
          fontWeight: 700,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}
      >
        {emSuporte ? 'VOLTAR AO DASHBOARD' : 'MANUSCRITOS / AJUDA'}
      </Button>
    </Box>
  );
}

export default TopbarSietch;
