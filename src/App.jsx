import Dashboard from './pages/Dashboard';
import { Navigate, Route, Routes } from 'react-router-dom';
import PlantView from './pages/PlantView';
import Login from './pages/Login';
import { useAuth } from './contexts/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2,
          backgroundColor: '#000000',
          position: 'relative',
          overflow: 'hidden',
          animation: 'routeAuthFadeIn 320ms ease-out',
          '@keyframes routeAuthFadeIn': {
            from: {
              opacity: 0,
            },
            to: {
              opacity: 1,
            },
          },
          '@keyframes routeAuthSweep': {
            from: {
              transform: 'translateY(-120%)',
            },
            to: {
              transform: 'translateY(120%)',
            },
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '32%',
            background:
              'linear-gradient(180deg, rgba(0, 180, 255, 0.18) 0%, rgba(0, 180, 255, 0) 100%)',
            animation: 'routeAuthSweep 1400ms ease-out 120ms 1 both',
            pointerEvents: 'none',
          },
        }}
      >
        <CircularProgress
          color="info"
          sx={{
            animation: 'routeAuthPulse 1400ms ease-in-out infinite',
            '@keyframes routeAuthPulse': {
              '0%': {
                opacity: 0.7,
                transform: 'scale(0.98)',
              },
              '50%': {
                opacity: 1,
                transform: 'scale(1.04)',
              },
              '100%': {
                opacity: 0.7,
                transform: 'scale(0.98)',
              },
            },
          }}
        />
        <Typography
          sx={{
            color: '#DCE8F0',
            fontFamily: '"Share Tech Mono", monospace',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            animation: 'routeAuthTextBlink 1200ms steps(2, end) infinite',
            '@keyframes routeAuthTextBlink': {
              '0%': {
                opacity: 0.6,
              },
              '100%': {
                opacity: 1,
              },
            },
          }}
        >
          VERIFICANDO CREDENCIAIS...
        </Typography>
      </Box>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  const { currentUser } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={(
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        )}
      />
      <Route
        path="/login"
        element={currentUser ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/planta/:id"
        element={(
          <PrivateRoute>
            <PlantView />
          </PrivateRoute>
        )}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;