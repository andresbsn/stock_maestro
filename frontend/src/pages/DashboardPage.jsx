import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const modules = [
  { name: 'Torneos', path: '/torneos', icon: '🏆', desc: 'Gestionar torneos activos' },
  { name: 'Ventas', path: '/ventas', icon: '🛒', desc: 'Registrar nuevas ventas' },
  { name: 'Productos', path: '/productos', icon: '📦', desc: 'Gestionar inventario de productos' },
  { name: 'Cajas', path: '/cajas', icon: '💵', desc: 'Control de cajas y movimientos' },
  { name: 'Compras', path: '/compras', icon: '🚚', desc: 'Registrar compras a proveedores' },
  { name: 'Transferencias', path: '/transferencias', icon: '⇄', desc: 'Mover stock entre depósitos' },
  { name: 'Gastos', path: '/gastos', icon: '🧾', desc: 'Registrar gastos y egresos' },
  { name: 'Devoluciones', path: '/devoluciones', icon: '↩️', desc: 'Registrar devoluciones a stock' },
  { name: 'Reportes', path: '/reportes', icon: '📊', desc: 'Resumen de movimientos y ganancias' },
];

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Assume user object has 'role'

  const filteredModules = modules.filter(mod => {
      if (user?.role === 'ADMIN') return true;
      // COMPLEJO or others
      return !['Compras', 'Transferencias', 'Torneos', 'Gastos', 'Devoluciones'].includes(mod.name);
  });

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '2rem' 
      }}>
        {filteredModules.map((mod) => (
          <div 
            key={mod.name} 
            className="glass-panel" 
            style={{ 
              padding: '2rem', 
              cursor: 'pointer',
              transition: 'transform 0.2s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}
            onClick={() => navigate(mod.path)}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{mod.icon}</div>
            <h3 style={{ marginBottom: '0.5rem' }}>{mod.name}</h3>
            <p style={{ color: 'var(--text-muted)' }}>{mod.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
