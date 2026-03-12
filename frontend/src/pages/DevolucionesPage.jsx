import React, { useEffect, useState } from 'react';
import Modal from '../components/Modal';
import devolucionesService from '../services/devolucionesService';
import DevolucionForm from '../components/DevolucionForm';

const DevolucionesPage = () => {
    const [devoluciones, setDevoluciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const fetchDevoluciones = async () => {
        try {
            setLoading(true);
            const res = await devolucionesService.getAll();
            setDevoluciones(res.data || []);
        } catch (error) {
            console.error('Error cargando devoluciones', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDevoluciones();
    }, []);

    const handleCreate = async (payload) => {
        try {
            await devolucionesService.create(payload);
            setShowModal(false);
            fetchDevoluciones();
        } catch (error) {
            alert('Error al registrar devolución: ' + (error.response?.data?.error?.message || error.message));
        }
    };

    if (loading && devoluciones.length === 0) return <div style={{ padding: '2rem' }}>Cargando...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="page-title" style={{ margin: 0 }}>Devoluciones</h1>
                <button className="btn-primary" onClick={() => setShowModal(true)}>+ Nueva Devolución</button>
            </div>

            <div className="glass-panel" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Caja</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Fecha</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Items</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Costo total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {devoluciones.length === 0 ? (
                            <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No hay devoluciones registradas.</td></tr>
                        ) : (
                            devoluciones.map(dev => {
                                const total = dev.items?.reduce((acc, item) => acc + Number(item.subtotal || 0), 0) || 0;
                                return (
                                    <tr key={dev.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '1rem' }}>#{dev.caja_id}</td>
                                        <td style={{ padding: '1rem' }}>{new Date(dev.created_at).toLocaleString()}</td>
                                        <td style={{ padding: '1rem' }}>{dev.items?.length || 0} productos</td>
                                        <td style={{ padding: '1rem', color: '#34d399' }}>+ ${total.toFixed(2)}</td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Registrar Devolución">
                <DevolucionForm onSubmit={handleCreate} onCancel={() => setShowModal(false)} />
            </Modal>
        </div>
    );
};

export default DevolucionesPage;
