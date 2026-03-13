import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TorneosPage from './pages/TorneosPage';
import ProductosPage from './pages/ProductosPage';
import VentasPage from './pages/VentasPage';
import ComprasPage from './pages/ComprasPage';
import CajasPage from './pages/CajasPage';
import TransferenciasPage from './pages/TransferenciasPage';
import GastosPage from './pages/GastosPage';
import DevolucionesPage from './pages/DevolucionesPage';
import ReportesPage from './pages/ReportesPage';
import ComplejosPage from './pages/ComplejosPage';
import UsersPage from './pages/UsersPage';

// Placeholder components for other routes (to be implemented later)
const Placeholder = ({ title }) => (
  <div>
    <h1 className="page-title">{title}</h1>
    <div className="glass-panel" style={{ padding: '2rem' }}>
      <p style={{ color: 'var(--text-muted)' }}>Módulo en construcción...</p>
    </div>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5rem' }}>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="torneos" element={<TorneosPage />} />
          <Route path="ventas" element={<VentasPage />} />
          <Route path="productos" element={<ProductosPage />} />
          <Route path="cajas" element={<CajasPage />} />
          <Route path="compras" element={<ComprasPage />} />
          <Route path="transferencias" element={<TransferenciasPage />} />
          <Route path="gastos" element={<GastosPage />} />
          <Route path="devoluciones" element={<DevolucionesPage />} />
          <Route path="reportes" element={<ReportesPage />} />
          <Route path="complejos" element={<ComplejosPage />} />
          <Route path="users" element={<UsersPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
