import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import TopbarSietch from './components/TopbarSietch';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const PlantView = lazy(() => import('./pages/PlantView'));
const Login = lazy(() => import('./pages/Login'));
const Home = lazy(() => import('./pages/Home'));

const routeStateText = {
  authCheck: 'VERIFICANDO CREDENCIAIS BIOMETRICAS...',
  routeSync: 'SINCRONIZANDO NUCLEO DO SIETCH...',
};

function LoadingSietch({ message = routeStateText.authCheck }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#05090A',
        backgroundImage:
          'radial-gradient(circle at 20% 15%, rgba(31, 58, 44, 0.28), transparent 42%), radial-gradient(circle at 82% 85%, rgba(0, 150, 214, 0.18), transparent 46%), repeating-linear-gradient(135deg, rgba(220, 232, 240, 0.03) 0px, rgba(220, 232, 240, 0.03) 1px, transparent 1px, transparent 12px)',
        px: 2,
      }}
    >
      <Box
        sx={{
          width: 'min(92vw, 560px)',
          border: '1px solid rgba(140, 180, 160, 0.45)',
          bgcolor: 'rgba(6, 18, 16, 0.78)',
          backdropFilter: 'blur(8px)',
          py: 5,
          px: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2,
          boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.35) inset, 0 16px 38px rgba(0, 0, 0, 0.42)',
          animation: 'loadingFadeIn 260ms ease-out',
          '@keyframes loadingFadeIn': {
            from: { opacity: 0, transform: 'translateY(8px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
          },
        }}
      >
        <WaterDropOutlinedIcon
          sx={{
            color: 'info.main',
            fontSize: 44,
            animation: 'loadingPulse 1300ms ease-in-out infinite',
            '@keyframes loadingPulse': {
              '0%': { opacity: 0.65, transform: 'scale(0.9)' },
              '50%': { opacity: 1, transform: 'scale(1.08)' },
              '100%': { opacity: 0.65, transform: 'scale(0.9)' },
            },
          }}
        />
        <CircularProgress size={22} color="info" thickness={5} />
        <Typography
          sx={{
            color: '#DCE8F0',
            fontFamily: 'Rajdhani, sans-serif',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            textAlign: 'center',
            fontSize: { xs: '0.9rem', sm: '1.02rem' },
          }}
        >
          {message}
        </Typography>
      </Box>
    </Box>
  );
}

function PrivateRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <LoadingSietch message={routeStateText.authCheck} />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Box>
      <TopbarSietch />
      {children}
    </Box>
  );
}

function AppRoutes() {
  const { currentUser } = useAuth();

  return (
    <Suspense fallback={<LoadingSietch message={routeStateText.routeSync} />}>
      <Routes>
        <Route
          path="/"
          element={currentUser ? <Navigate to="/dashboard" replace /> : <Home />}
        />
        <Route
          path="/dashboard"
          element={(
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          )}
        />
        <Route
          path="/login"
          element={currentUser ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/planta/:id"
          element={(
            <PrivateRoute>
              <PlantView />
            </PrivateRoute>
          )}
        />
        <Route path="*" element={<Navigate to={currentUser ? '/dashboard' : '/'} replace />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;