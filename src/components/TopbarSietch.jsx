import { useState } from 'react';
import {
  Box,
  Button,
  ButtonBase,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import mascot from '../assets/mascote.png';
import { globalSx } from '../theme/styles';

function TopbarSietch() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const emSuporte = location.pathname.startsWith('/suporte') || location.pathname.startsWith('/support');
  const menuAberto = Boolean(menuAnchorEl);

  const handleAbrirMenuUsuario = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleFecharMenuUsuario = () => {
    setMenuAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Falha ao encerrar sessao:', error);
    } finally {
      handleFecharMenuUsuario();
    }
  };

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
      <Stack direction="row" spacing={1} alignItems="center">
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

        <IconButton
          onClick={handleAbrirMenuUsuario}
          aria-label="Abrir menu de usuario"
          aria-controls={menuAberto ? 'menu-usuario-sietch' : undefined}
          aria-haspopup="true"
          aria-expanded={menuAberto ? 'true' : undefined}
          sx={{
            color: 'primary.main',
            border: '1px solid rgba(61, 40, 16, 0.2)',
            borderRadius: 0,
            width: 36,
            height: 36,
            '&:hover': {
              backgroundColor: 'rgba(61, 40, 16, 0.08)',
            },
          }}
        >
          <AccountCircleIcon fontSize="small" />
        </IconButton>

        <Menu
          id="menu-usuario-sietch"
          anchorEl={menuAnchorEl}
          open={menuAberto}
          onClose={handleFecharMenuUsuario}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem disabled sx={{ opacity: 0.9 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {currentUser?.email ?? 'Usuario autenticado'}
            </Typography>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <LogoutIcon sx={{ mr: 1, fontSize: 18 }} />
            <Typography variant="body2">Sair</Typography>
          </MenuItem>
        </Menu>
      </Stack>
    </Box>
  );
}

export default TopbarSietch;
