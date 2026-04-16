import React from 'react';
import { Card } from '@mui/material';

function SietchCard({ children, highlightColor, sx, ...props }) {
  return (
    <Card
      sx={(theme) => ({
        backgroundColor: theme.palette.background.paper,
        borderRadius: 0,
        border: '1px solid rgba(61, 40, 16, 0.1)',
        boxShadow: '0 10px 30px rgba(61, 40, 16, 0.08)',
        ...(highlightColor ? { borderLeft: `4px solid ${highlightColor}` } : {}),
        ...(typeof sx === 'function' ? sx(theme) : sx),
      })}
      {...props}
    >
      {children}
    </Card>
  );
}

export default SietchCard;
