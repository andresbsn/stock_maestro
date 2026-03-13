import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Torneos', path: '/torneos' },
        { name: 'Ventas', path: '/ventas' },
        { name: 'Productos', path: '/productos' },
        { name: 'Cajas', path: '/cajas' },
        { name: 'Compras', path: '/compras' },
        { name: 'Transferencias', path: '/transferencias' },
        { name: 'Gastos', path: '/gastos' },
        { name: 'Devoluciones', path: '/devoluciones' },
        { name: 'Reportes', path: '/reportes' },
        { name: 'Complejos', path: '/complejos' },
        { name: 'Usuarios', path: '/users' },
    ].filter(item => {
        if (user?.role === 'ADMIN') return true;
        // Non-admins don't see Compras, Transferencias, Torneos, Complejos, Users
        return !['Compras', 'Transferencias', 'Torneos', 'Gastos', 'Devoluciones', 'Complejos', 'Usuarios'].includes(item.name);
    });

    return (
        <div className="layout-container">
            <aside className="sidebar glass-panel" style={{ margin: '1rem', height: 'calc(100vh - 2rem)', borderRadius: '16px' }}>
                <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    <h2 style={{ color: 'var(--primary)' }}>Inventario</h2>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                    {navItems.map((item) => {
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <Link 
                                key={item.path} 
                                to={item.path}
                                style={{
                                    padding: '0.75rem 1rem',
                                    borderRadius: '8px',
                                    backgroundColor: isActive ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                                    color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                                    fontWeight: isActive ? '600' : '400',
                                    display: 'block'
                                }}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                   <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Usuario: {user?.username || 'Admin'}
                   </div>
                   <button 
                        onClick={handleLogout}
                        style={{ 
                            width: '100%', 
                            padding: '0.5rem', 
                            background: 'transparent', 
                            border: '1px solid var(--border-color)', 
                            color: '#ef4444',
                            borderRadius: '6px',
                            transition: 'background 0.3s'
                        }}
                        onMouseEnter={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}
                        onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    >
                        Cerrar Sesión
                   </button>
                </div>
            </aside>
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
