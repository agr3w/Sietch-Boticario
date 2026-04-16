import React from 'react';
import { Typography } from '@mui/material';

function SectionTitle({
  children,
  variant = 'h3',
  align = 'center',
  color = 'text.primary',
  sx,
  ...props
}) {
  const estiloBase = {
    fontFamily: 'Rajdhani',
    fontWeight: 700,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  };

  return (
    <Typography
      variant={variant}
      align={align}
      color={color}
      sx={{ ...estiloBase, ...sx }}
      {...props}
    >
      {children}
    </Typography>
  );
}

export default SectionTitle;
