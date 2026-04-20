import React from 'react';
import { Box } from '@mui/material';
import TopbarSietch from './TopbarSietch';
import FooterSietch from './FooterSietch';
import AuthAwareTopbar from './AuthAwareTopbar';

function SietchLayout({
  children,
  showTopbar = true,
  showFooter = true,
  authAwareTopbar = false,
}) {
  const renderTopbar = () => {
    if (!showTopbar) {
      return null;
    }

    if (!authAwareTopbar) {
      return <TopbarSietch />;
    }

    return <AuthAwareTopbar />;
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.default',
      }}
    >
      {renderTopbar()}
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
      {/* {showFooter && <FooterSietch />} */}
    </Box>
  );
}

export default SietchLayout;
