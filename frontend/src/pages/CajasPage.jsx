import React, { useEffect, useState } from 'react';
import cajasService from '../services/cajasService';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';

// Reusable component for displaying Caja details
const CajaDetailsView = ({ details }) => {
    const [activeTab, setActiveTab] = useState('ventas');

    const ventas = details?.ventas || [];
    const gastos = details?.gastos || [];
    const devoluciones = details?.devoluciones || [];

    // Totales Ventas
    const totalVentas = ventas.reduce((acc, v) => acc + parseFloat(v.total), 0);
    
    const totalVentasEfectivo = ventas.reduce((acc, v) => {
        // Check structured payments first
        if (v.pagos && Array.isArray(v.pagos) && v.pagos.length > 0) {
            const cashPart = v.pagos
                .filter(p => p.metodo === 'EFECTIVO')
                .reduce((sum, p) => sum + parseFloat(p.monto || 0), 0);
            return acc + cashPart;
        }
        // Fallback to main method if no detailed payments
        if (v.metodo_pago === 'EFECTIVO') {
            return acc + parseFloat(v.total);
        }
        return acc;
    }, 0);
    
    // Totales Gastos
    const totalGastos = gastos.reduce((acc, g) => acc + parseFloat(g.monto), 0);

    // Totales Devoluciones
    const totalDevoluciones = devoluciones.reduce((acc, dev) => {
        const sub = dev.items?.reduce((s, i) => s + parseFloat(i.subtotal), 0) || 0;
        return acc + sub;
    }, 0);

    const saldoInicial = parseFloat(details?.monto_inicial || 0);
    const balanceTeorico = saldoInicial + totalVentasEfectivo - totalGastos - totalDevoluciones;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Header Info */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Estado</div>
                    <div style={{ fontWeight: 'bold', color: details.estado === 'ABIERTA' ? '#34d399' : '#ef4444' }}>{details.estado}</div>
                </div>
                <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Monto Inicial</div>
                    <div style={{ fontWeight: 'bold' }}>${saldoInicial.toFixed(2)}</div>
                </div>
                <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Apertura</div>
                    <div>{new Date(details.opened_at).toLocaleString()}</div>
                </div>
                <div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Cierre</div>
                    <div>{details.closed_at ? new Date(details.closed_at).toLocaleString() : '-'}</div>
                </div>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)' }}>Resumen Global</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Ventas Totales</span>
                        <span style={{ color: '#34d399' }}>+ ${totalVentas.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Gastos</span>
                        <span style={{ color: '#ef4444' }}>- ${totalGastos.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Devoluciones</span>
                        <span style={{ color: '#ef4444' }}>- ${totalDevoluciones.toFixed(2)}</span>
                    </div>
                </div>

                <div style={{ background: 'rgba(52, 211, 153, 0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(52, 211, 153, 0.2)' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#34d399' }}>Flujo de Efectivo (Caja)</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Inicial</span>
                        <span>${saldoInicial.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Ventas (Efectivo)</span>
                        <span>+ ${totalVentasEfectivo.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Salidas (Gastos/Dev)</span>
                        <span>- ${(totalGastos + totalDevoluciones).toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.5rem', fontWeight: 'bold', fontSize: '1.1rem', marginTop: '0.5rem' }}>
                        <span>Balance Teórico</span>
                        <span>${balanceTeorico.toFixed(2)}</span>
                    </div>
                    {details.estado === 'CERRADA' && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            <span>Declarado al Cierre</span>
                            <span>${details.monto_final}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '1rem' }}>
                {['ventas', 'gastos', 'devoluciones'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
                            color: activeTab === tab ? 'var(--primary)' : 'var(--text-muted)',
                            padding: '0.5rem 1rem',
                            cursor: 'pointer',
                            textTransform: 'capitalize'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div style={{ minHeight: '200px' }}>
                {activeTab === 'ventas' && (
                    <table style={{ width: '100%', fontSize: '0.85rem' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', color: 'var(--text-muted)' }}>
                                <th style={{ padding: '0.5rem' }}>ID</th>
                                <th style={{ padding: '0.5rem' }}>Hora</th>
                                <th style={{ padding: '0.5rem' }}>Vendedor</th>
                                <th style={{ padding: '0.5rem' }}>Método</th>
                                <th style={{ padding: '0.5rem' }}>Items</th>
                                <th style={{ padding: '0.5rem' }}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ventas.map(v => (
                                <tr key={v.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '0.5rem' }}>#{v.id}</td>
                                    <td style={{ padding: '0.5rem' }}>{new Date(v.created_at).toLocaleTimeString()}</td>
                                    <td style={{ padding: '0.5rem' }}>{v.vendedor?.username || '-'}</td>
                                    <td style={{ padding: '0.5rem' }}>{v.metodo_pago}</td>
                                    <td style={{ padding: '0.5rem' }}>
                                         {v.items?.map(i => `${i.cantidad}x ${i.producto?.nombre || i.producto_id}`).join(', ')}
                                    </td>
                                    <td style={{ padding: '0.5rem' }}>${v.total}</td>
                                </tr>
                            ))}
                            {ventas.length === 0 && <tr><td colSpan="6" style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>No hay ventas</td></tr>}
                        </tbody>
                    </table>
                )}

                {activeTab === 'gastos' && (
                    <table style={{ width: '100%', fontSize: '0.85rem' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', color: 'var(--text-muted)' }}>
                                <th style={{ padding: '0.5rem' }}>ID</th>
                                <th style={{ padding: '0.5rem' }}>Hora</th>
                                <th style={{ padding: '0.5rem' }}>Descripción</th>
                                <th style={{ padding: '0.5rem' }}>Categoría</th>
                                <th style={{ padding: '0.5rem' }}>Autor</th>
                                <th style={{ padding: '0.5rem' }}>Monto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {gastos.map(g => (
                                <tr key={g.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '0.5rem' }}>#{g.id}</td>
                                    <td style={{ padding: '0.5rem' }}>{new Date(g.created_at).toLocaleTimeString()}</td>
                                    <td style={{ padding: '0.5rem' }}>{g.descripcion}</td>
                                    <td style={{ padding: '0.5rem' }}>{g.categoria}</td>
                                    <td style={{ padding: '0.5rem' }}>{g.creator?.username || g.created_by}</td>
                                    <td style={{ padding: '0.5rem', color: '#ef4444' }}>-${g.monto}</td>
                                </tr>
                            ))}
                            {gastos.length === 0 && <tr><td colSpan="6" style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>No hay gastos</td></tr>}
                        </tbody>
                    </table>
                )}

                {activeTab === 'devoluciones' && (
                    <table style={{ width: '100%', fontSize: '0.85rem' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', color: 'var(--text-muted)' }}>
                                <th style={{ padding: '0.5rem' }}>ID</th>
                                <th style={{ padding: '0.5rem' }}>Hora</th>
                                <th style={{ padding: '0.5rem' }}>Autor</th>
                                <th style={{ padding: '0.5rem' }}>Items</th>
                                <th style={{ padding: '0.5rem' }}>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {devoluciones.map(d => {
                                const totalDev = d.items?.reduce((acc, i) => acc + parseFloat(i.subtotal), 0) || 0;
                                return (
                                    <tr key={d.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '0.5rem' }}>#{d.id}</td>
                                        <td style={{ padding: '0.5rem' }}>{new Date(d.created_at).toLocaleTimeString()}</td>
                                        <td style={{ padding: '0.5rem' }}>{d.creator?.username || '-'}</td>
                                        <td style={{ padding: '0.5rem' }}>
                                            {d.items?.map(i => `${i.cantidad}x ${i.producto?.nombre || i.producto_id}`).join(', ')}
                                        </td>
                                        <td style={{ padding: '0.5rem', color: '#ef4444' }}>-${totalDev.toFixed(2)}</td>
                                    </tr>
                                );
                            })}
                            {devoluciones.length === 0 && <tr><td colSpan="5" style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>No hay devoluciones</td></tr>}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

// Modal for closing a box
const CloseBoxModal = ({ isOpen, onClose, caja, onClosed }) => {
    const [montoUser, setMontoUser] = useState('');
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && caja) {
            setLoading(true);
            setMontoUser(''); // Reset input
            // If we already have details passed in caja object (from Active Box), use them
            // Otherwise fetch
            if (caja.ventas) {
                setDetails(caja);
                setLoading(false);
            } else {
                cajasService.getById(caja.id)
                    .then(res => setDetails(res.data))
                    .catch(err => console.error(err))
                    .finally(() => setLoading(false));
            }
        } else {
            setDetails(null);
        }
    }, [isOpen, caja]);

    if (!isOpen || !caja) return null;

    // Calculate theoretical balance
    let balanceTeorico = 0;
    if (details) {
        const ventas = details.ventas || [];
        const gastos = details.gastos || [];
        const devoluciones = details.devoluciones || [];

        const totalVentasEfectivo = ventas.reduce((acc, v) => {
            // Check structured payments first
            if (v.pagos && Array.isArray(v.pagos) && v.pagos.length > 0) {
                const cashPart = v.pagos
                    .filter(p => p.metodo === 'EFECTIVO')
                    .reduce((sum, p) => sum + parseFloat(p.monto || 0), 0);
                return acc + cashPart;
            }
            // Fallback to main method if no detailed payments
            if (v.metodo_pago === 'EFECTIVO') {
                return acc + parseFloat(v.total);
            }
            return acc;
        }, 0);

        const totalGastos = gastos.reduce((acc, g) => acc + parseFloat(g.monto), 0);

        const totalDevoluciones = devoluciones.reduce((acc, dev) => {
            const sub = dev.items?.reduce((s, i) => s + parseFloat(i.subtotal), 0) || 0;
            return acc + sub;
        }, 0);

        const saldoInicial = parseFloat(details.monto_inicial || 0);
        balanceTeorico = saldoInicial + totalVentasEfectivo - totalGastos - totalDevoluciones;
    }

    const montoReal = parseFloat(montoUser) || 0;
    const diferencia = montoReal - balanceTeorico;

    const handleClose = async (e) => {
        e.preventDefault();
        try {
            await cajasService.cerrar(caja.id, montoReal);
            onClosed();
        } catch (error) {
            alert('Error cerrando caja: ' + error.message);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>
                Está a punto de cerrar la <strong>Caja #{caja.id}</strong>.<br/>
                Por favor, verifique el balance teórico y cuente el dinero físico.
            </p>

            {loading ? <p>Calculando balance...</p> : (
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Balance Teórico (Efectivo):</span>
                        <span style={{ fontWeight: 'bold' }}>${balanceTeorico.toFixed(2)}</span>
                    </div>
                </div>
            )}
            
            <form onSubmit={handleClose}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Monto Real en Caja</label>
                <input 
                    type="number" 
                    step="0.01" 
                    className="input-field"
                    value={montoUser}
                    onChange={e => setMontoUser(e.target.value)}
                    required
                />

                {!loading && montoUser !== '' && (
                    <div style={{ marginTop: '1rem', padding: '0.5rem', borderRadius: '4px', background: diferencia >= 0 ? 'rgba(52, 211, 153, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: `1px solid ${diferencia >= 0 ? '#34d399' : '#ef4444'}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                            <span style={{ color: diferencia >= 0 ? '#34d399' : '#ef4444' }}>
                                {diferencia >= 0 ? 'Sobrante' : 'Faltante'}
                            </span>
                            <span style={{ color: diferencia >= 0 ? '#34d399' : '#ef4444' }}>
                                ${Math.abs(diferencia).toFixed(2)}
                            </span>
                        </div>
                    </div>
                )}
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', gap: '1rem' }}>
                    <button type="button" onClick={onClose} style={{ background: 'transparent', color: 'var(--text-muted)' }}>Cancelar</button>
                    <button type="submit" className="btn-primary" style={{ background: '#ef4444' }}>Cerrar Caja</button>
                </div>
            </form>
        </div>
    );
};

const CajaDetailsModal = ({ isOpen, onClose, cajaId }) => {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen && cajaId) {
            setLoading(true);
            cajasService.getById(cajaId)
                .then(res => setDetails(res.data))
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        } else {
            setDetails(null);
        }
    }, [isOpen, cajaId]);

    return (
        <div style={{ maxHeight: '80vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
           {loading || !details ? <p>Cargando detalles...</p> : (
               <CajaDetailsView details={details} />
           )}
        </div>
    );
};

const CajasPage = () => {
    const { user } = useAuth();
    const [cajas, setCajas] = useState([]);
    const [activeCaja, setActiveCaja] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Modals
    const [selectedCaja, setSelectedCaja] = useState(null);
    const [modalMode, setModalMode] = useState(null); // 'CLOSE', 'DETAILS'

    const fetchCajas = async () => {
        try {
            setLoading(true);
            const res = await cajasService.getAll();
            setCajas(res.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchActiveCaja = async () => {
        if (user?.complejo_id) {
            try {
                const res = await cajasService.getActive({ complejoId: user.complejo_id });
                setActiveCaja(res.data);
            } catch (error) {
                console.error(error);
            }
        }
    };

    useEffect(() => {
        fetchCajas();
        fetchActiveCaja();
    }, [user]);

    const handleOpenCloseModal = (caja) => {
        setSelectedCaja(caja);
        setModalMode('CLOSE');
    };

    const handleOpenDetailsModal = (caja) => {
        setSelectedCaja(caja);
        setModalMode('DETAILS');
    };

    const handleCloseModal = () => {
        setSelectedCaja(null);
        setModalMode(null);
        fetchCajas();
        fetchActiveCaja(); // Refresh active box
    };

    if (loading && cajas.length === 0) return <div style={{ padding: '2rem' }}>Cargando...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="page-title" style={{ margin: 0 }}>Gestión de Cajas</h1>
            </div>

            {/* Active Box Section */}
            {activeCaja && (
                <div className="glass-panel" style={{ marginBottom: '2rem', padding: '1.5rem', border: '1px solid var(--primary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <h2 style={{ margin: 0, color: 'var(--primary)' }}>Caja Activa (Tu Complejo)</h2>
                            <span style={{ 
                                background: '#34d399', color: '#000', padding: '0.25rem 0.75rem', 
                                borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' 
                            }}>
                                ABIERTA
                            </span>
                        </div>
                        <button 
                            onClick={() => handleOpenCloseModal(activeCaja)}
                            className="btn-primary"
                            style={{ background: '#ef4444' }}
                        >
                            Cerrar Caja Actual
                        </button>
                    </div>
                    
                    <CajaDetailsView details={activeCaja} />
                </div>
            )}

            <h3 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Historial de Cajas</h3>
            <div className="glass-panel" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>ID</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Estado</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Apertura</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Monto Inicial</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Monto Final</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cajas.map(caja => (
                            <tr key={caja.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '1rem' }}>#{caja.id}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem',
                                        background: caja.estado === 'ABIERTA' ? 'rgba(52, 211, 153, 0.2)' : 'rgba(255,255,255,0.05)',
                                        color: caja.estado === 'ABIERTA' ? '#34d399' : 'var(--text-muted)'
                                    }}>
                                        {caja.estado}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>{new Date(caja.opened_at).toLocaleString()}</td>
                                <td style={{ padding: '1rem' }}>${caja.monto_inicial}</td>
                                <td style={{ padding: '1rem' }}>{caja.monto_final ? `$${caja.monto_final}` : '-'}</td>
                                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                                    <button 
                                        onClick={() => handleOpenDetailsModal(caja)}
                                        style={{ color: 'var(--primary)', background: 'transparent' }}
                                    >
                                        Ver Detalles
                                    </button>
                                    {caja.estado === 'ABIERTA' && (
                                        <button 
                                            onClick={() => handleOpenCloseModal(caja)}
                                            style={{ color: '#ef4444', background: 'transparent' }}
                                        >
                                            Cerrar
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Close Box Modal */}
            <Modal title="Cierre de Caja" isOpen={modalMode === 'CLOSE'} onClose={() => setModalMode(null)}>
                <CloseBoxModal isOpen={modalMode === 'CLOSE'} caja={selectedCaja} onClose={() => setModalMode(null)} onClosed={handleCloseModal} />
            </Modal>

            {/* Details Modal */}
            <Modal title={`Detalle de Caja #${selectedCaja?.id}`} isOpen={modalMode === 'DETAILS'} onClose={() => setModalMode(null)}>
                <CajaDetailsModal isOpen={modalMode === 'DETAILS'} cajaId={selectedCaja?.id} onClose={() => setModalMode(null)} />
            </Modal>
        </div>
    );
};

export default CajasPage;
