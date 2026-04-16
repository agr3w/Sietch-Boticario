import { Box, Typography } from '@mui/material';
import mascot from '../assets/mascote.png';
import { globalSx } from '../theme/styles';

function TopbarSietch() {
  return (
    <Box sx={globalSx.appTopbar}>
      <Box sx={globalSx.appBrand}>
        <Box component="img" src={mascot} alt="Mascote do Sietch Boticario" sx={globalSx.appMascot} />
        <Typography component="h1" sx={globalSx.appBrandTitle}>
          SIETCH BOTICÁRIO
        </Typography>
      </Box>
    </Box>
  );
}

export default TopbarSietch;
