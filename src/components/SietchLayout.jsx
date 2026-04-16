import React from 'react';
import { Box } from '@mui/material';
import TopbarSietch from './TopbarSietch';
import FooterSietch from './FooterSietch';

function SietchLayout({ children, showTopbar = true, showFooter = true }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.default',
      }}
    >
      {showTopbar && <TopbarSietch />}
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
      {showFooter && <FooterSietch />}
    </Box>
  );
}

export default SietchLayout;
