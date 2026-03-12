import React, { useEffect, useState } from 'react';
import reportesService from '../services/reportesService';
import cajasService from '../services/cajasService';
import { useAuth } from '../context/AuthContext';

const ReportesPage = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [usuarioReporte, setUsuarioReporte] = useState(null);
    const [adminReporte, setAdminReporte] = useState(null);
    const [cajas, setCajas] = useState([]);
    const [cajaFiltro, setCajaFiltro] = useState('');

    const fetchUsuarioReporte = async () => {
        const res = await reportesService.getUsuarioCaja();
        setUsuarioReporte(res.data);
    };

    const fetchAdminReporte = async (filters = {}) => {
        const res = await reportesService.getAdmin(filters);
        setAdminReporte(res.data);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                if (user?.role === 'ADMIN') {
                    const cajasRes = await cajasService.getAll();
                    setCajas(cajasRes.data || []);
                    await fetchAdminReporte();
                } else {
                    await fetchUsuarioReporte();
                }
            } catch (error) {
                console.error('Error cargando reportes', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user?.role]);

    const handleFiltroCaja = async (value) => {
        setCajaFiltro(value);
        await fetchAdminReporte(value ? { caja_id: value } : {});
    };

    if (loading) return <div style={{ padding: '2rem' }}>Cargando...</div>;

    if (user?.role === 'ADMIN') {
        const resumen = adminReporte?.resumen || {};
        return (
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 className="page-title" style={{ margin: 0 }}>Reportes Admin</h1>
                    <div style={{ minWidth: '240px' }}>
                        <select className="input-field" value={cajaFiltro} onChange={(e) => handleFiltroCaja(e.target.value)}>
                            <option value="">Todas las cajas</option>
                            {cajas.map(caja => (
                                <option key={caja.id} value={caja.id}>Caja #{caja.id}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                        <div>
                            <div style={{ color: 'var(--text-muted)' }}>Ventas Totales</div>
                            <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>${(resumen.ventas_total || 0).toFixed(2)}</div>
                        </div>
                        <div>
                            <div style={{ color: 'var(--text-muted)' }}>Ganancia Ventas</div>
                            <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>${(resumen.ventas_ganancia || 0).toFixed(2)}</div>
                        </div>
                        <div>
                            <div style={{ color: 'var(--text-muted)' }}>Gastos Totales</div>
                            <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#f87171' }}>- ${(resumen.gastos_total || 0).toFixed(2)}</div>
                        </div>
                        <div>
                            <div style={{ color: 'var(--text-muted)' }}>Devoluciones (costo)</div>
                            <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#34d399' }}>+ ${(resumen.devoluciones_costo_total || 0).toFixed(2)}</div>
                        </div>
                        <div>
                            <div style={{ color: 'var(--text-muted)' }}>Ganancia Neta</div>
                            <div style={{ fontSize: '1.6rem', fontWeight: 'bold' }}>${(resumen.ganancia_neta || 0).toFixed(2)}</div>
                        </div>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
                    <h3 style={{ marginBottom: '0.5rem' }}>Ventas</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>ID</th>
                                <th style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Caja</th>
                                <th style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Método</th>
                                <th style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(adminReporte?.ventas || []).map(venta => (
                                <tr key={venta.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '0.75rem' }}>#{venta.id}</td>
                                    <td style={{ padding: '0.75rem' }}>#{venta.caja_id}</td>
                                    <td style={{ padding: '0.75rem' }}>{venta.metodo_pago}</td>
                                    <td style={{ padding: '0.75rem' }}>${venta.total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
                    <h3 style={{ marginBottom: '0.5rem' }}>Gastos</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Caja</th>
                                <th style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Monto</th>
                                <th style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Descripción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(adminReporte?.gastos || []).map(gasto => (
                                <tr key={gasto.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '0.75rem' }}>#{gasto.caja_id}</td>
                                    <td style={{ padding: '0.75rem', color: '#f87171' }}>- ${gasto.monto}</td>
                                    <td style={{ padding: '0.75rem' }}>{gasto.descripcion}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
                    <h3 style={{ marginBottom: '0.5rem' }}>Devoluciones</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Caja</th>
                                <th style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Fecha</th>
                                <th style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Total costo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(adminReporte?.devoluciones || []).map(dev => {
                                const total = dev.items?.reduce((acc, item) => acc + Number(item.subtotal || 0), 0) || 0;
                                return (
                                    <tr key={dev.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '0.75rem' }}>#{dev.caja_id}</td>
                                        <td style={{ padding: '0.75rem' }}>{new Date(dev.created_at).toLocaleString()}</td>
                                        <td style={{ padding: '0.75rem', color: '#34d399' }}>+ ${total.toFixed(2)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="glass-panel" style={{ padding: '1rem' }}>
                    <h3 style={{ marginBottom: '0.5rem' }}>Transferencias marcadas como gasto</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>ID</th>
                                <th style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Fecha</th>
                                <th style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Items</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(adminReporte?.transferencias_gasto || []).map(orden => (
                                <tr key={orden.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '0.75rem' }}>#{orden.id}</td>
                                    <td style={{ padding: '0.75rem' }}>{new Date(orden.fecha).toLocaleDateString()}</td>
                                    <td style={{ padding: '0.75rem' }}>{orden.items?.length || 0} productos</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    const caja = usuarioReporte?.caja;
    const totales = usuarioReporte?.totales_por_pago || {};

    return (
        <div>
            <h1 className="page-title">Reporte de Caja</h1>
            {!caja ? (
                <div className="glass-panel" style={{ padding: '2rem' }}>No hay caja abierta.</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Totales por método de pago (Caja #{caja.id})</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            {Object.entries(totales).map(([metodo, total]) => (
                                <div key={metodo} style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
                                    <div style={{ color: 'var(--text-muted)' }}>{metodo}</div>
                                    <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>${Number(total).toFixed(2)}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '1rem' }}>
                        <h3 style={{ marginBottom: '0.5rem' }}>Ventas de la caja</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <th style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>ID</th>
                                    <th style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Método</th>
                                    <th style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Total</th>
                                    <th style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Fecha</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(usuarioReporte?.ventas || []).map(venta => (
                                    <tr key={venta.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '0.75rem' }}>#{venta.id}</td>
                                        <td style={{ padding: '0.75rem' }}>{venta.metodo_pago}</td>
                                        <td style={{ padding: '0.75rem' }}>${venta.total}</td>
                                        <td style={{ padding: '0.75rem' }}>{new Date(venta.created_at).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReportesPage;
