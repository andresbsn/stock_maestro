import React, { useEffect, useState } from 'react';
import comprasService from '../services/comprasService';
import Modal from '../components/Modal';
import NewCompraForm from '../components/NewCompraForm';

const ComprasPage = () => {
    const [compras, setCompras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const fetchCompras = async () => {
        try {
            setLoading(true);
            const res = await comprasService.getAll();
            setCompras(res.data || []);
        } catch (error) {
            console.error("Error fetching compras", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompras();
    }, []);

    const [selectedCompra, setSelectedCompra] = useState(null);

    const handleCreate = async (payload) => {
        try {
            await comprasService.create(payload);
            setShowModal(false);
            fetchCompras();
        } catch (error) {
            alert('Error al crear compra: ' + (error.response?.data?.error?.message || error.message));
        }
    };

    if (loading && compras.length === 0) return <div style={{ padding: '2rem' }}>Cargando...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="page-title" style={{ margin: 0 }}>Compras y Abastecimiento</h1>
                <button className="btn-primary" onClick={() => { setSelectedCompra(null); setShowModal(true); }}>+ Nueva Compra</button>
            </div>

            <div className="glass-panel" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>ID</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Fecha</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Proveedor</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Items</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Total Est.</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Registrado Por</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {compras.length === 0 ? (
                            <tr><td colSpan="7" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No hay compras registradas.</td></tr>
                        ) : (
                            compras.map(compra => {
                                const total = compra.items?.reduce((acc, item) => acc + (item.cantidad * item.costo_unitario_snapshot), 0) || 0;
                                return (
                                    <tr key={compra.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '1rem' }}>#{compra.id}</td>
                                        <td style={{ padding: '1rem' }}>{new Date(compra.fecha).toLocaleDateString()}</td>
                                        <td style={{ padding: '1rem' }}>{compra.proveedor || '-'}</td>
                                        <td style={{ padding: '1rem' }}>{compra.items?.length || 0} productos</td>
                                        <td style={{ padding: '1rem' }}>${total.toFixed(2)}</td>
                                        <td style={{ padding: '1rem' }}>{compra.creator?.username || 'Admin'}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <button 
                                                onClick={() => { setSelectedCompra(compra); setShowModal(true); }}
                                                style={{ color: '#60a5fa', background: 'transparent', fontSize: '1.2rem', cursor: 'pointer' }}
                                                title="Ver Detalle"
                                            >
                                                👁️
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={selectedCompra ? "Detalle de Compra" : "Registrar Ingreso de Mercadería"}>
                 <NewCompraForm 
                    initialData={selectedCompra}
                    readOnly={!!selectedCompra}
                    onSubmit={handleCreate} 
                    onCancel={() => setShowModal(false)} 
                />
            </Modal>
        </div>
    );
};

export default ComprasPage;
