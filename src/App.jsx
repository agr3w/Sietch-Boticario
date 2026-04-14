import Dashboard from './pages/Dashboard';
import { Navigate, Route, Routes } from 'react-router-dom';
import PlantView from './pages/PlantView';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/planta/:id" element={<PlantView />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;