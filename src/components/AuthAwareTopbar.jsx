import React from 'react';
import {
  AppBar,
  Avatar,
  Button,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import mascot from '../assets/mascote.png';
import TopbarSietch from './TopbarSietch';

function PublicTopbarHomeStyle() {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'rgba(245, 236, 215, 0.7)',
        backdropFilter: 'blur(15px)',
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar
            src={mascot}
            sx={{
              width: 40,
              height: 40,
              border: `1px solid ${theme.palette.secondary.main}`,
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontFamily: 'Rajdhani',
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: 'text.primary',
            }}
          >
            SIETCH BOTICARIO
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
  );
}

function AuthAwareTopbar() {
  const { currentUser } = useAuth();

  return currentUser ? <TopbarSietch /> : <PublicTopbarHomeStyle />;
}

export default AuthAwareTopbar;
