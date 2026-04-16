import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import TopbarSietch from './components/TopbarSietch';
import FooterSietch from './components/FooterSietch';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const PlantView = lazy(() => import('./pages/PlantView'));
const Login = lazy(() => import('./pages/Login'));
const Home = lazy(() => import('./pages/Home'));
const Support = lazy(() => import('./pages/Support'));

const routeStateText = {
  authCheck: 'ANALISANDO SOLO...',
  routeSync: 'LENDO MANUSCRITOS DE KYNES...',
  calibrate: 'CALIBRANDO DESTILADORES...',
};

function LoadingSietch({ message = routeStateText.calibrate }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.palette.background.default,
        px: 2,
      }}
    >
      <Box
        sx={{
          width: 'min(92vw, 520px)',
          border: '1px solid rgba(61, 40, 16, 0.12)',
          bgcolor: theme.palette.background.paper,
          py: 5,
          px: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 1.8,
          boxShadow: '0 10px 28px rgba(61, 40, 16, 0.1)',
          animation: 'loadingFadeIn 260ms ease-out',
          '@keyframes loadingFadeIn': {
            from: { opacity: 0, transform: 'translateY(8px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
          },
        }}
      >
        <CircularProgress
          size={26}
          thickness={4.8}
          sx={{
            color: 'success.main',
          }}
        />
        <Typography
          sx={{
            color: 'text.primary',
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
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{ flex: 1 }}>
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
              path="/suporte"
              element={(
                <PrivateRoute>
                  <Support />
                </PrivateRoute>
              )}
            />
            <Route path="/support" element={<Navigate to="/suporte" replace />} />
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
      </Box>
      <FooterSietch />
    </Box>
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