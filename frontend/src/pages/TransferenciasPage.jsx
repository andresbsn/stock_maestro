import React, { useEffect, useState } from 'react';
import transferenciasService from '../services/transferenciasService';
import Modal from '../components/Modal';
import NewTransferenciaForm from '../components/NewTransferenciaForm';

const TransferenciasPage = () => {
    const [ordenes, setOrdenes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [detalleOrden, setDetalleOrden] = useState(null);

    const fetchOrdenes = async () => {
        try {
            setLoading(true);
            const res = await transferenciasService.getAll();
            setOrdenes(res.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrdenes();
    }, []);

    const handleCreate = async (payload) => {
        try {
            await transferenciasService.create(payload);
            setShowModal(false);
            fetchOrdenes();
        } catch (error) {
            alert('Error al crear orden: ' + (error.response?.data?.error?.message || error.message));
        }
    };

    const [editingOrden, setEditingOrden] = useState(null);

    const handleUpdate = async (id, payload) => {
        try {
            await transferenciasService.update(id, payload);
            setShowModal(false);
            setEditingOrden(null);
            fetchOrdenes();
        } catch (error) {
             alert('Error al actualizar: ' + (error.response?.data?.error?.message || error.message));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que desea eliminar esta orden en borrador?")) return;
        try {
            await transferenciasService.delete(id);
            fetchOrdenes();
        } catch (error) {
             alert('Error al eliminar: ' + (error.response?.data?.error?.message || error.message));
        }
    };

    const handleConfirm = async (id) => {
        if (!window.confirm("¿Confirmar transferencia? Esto moverá el stock permanentemente.")) return;
        try {
            await transferenciasService.confirmar(id);
            fetchOrdenes();
        } catch (error) {
             alert('Error al confirmar: ' + (error.response?.data?.error?.message || error.message));
        }
    };

    if (loading && ordenes.length === 0) return <div style={{ padding: '2rem' }}>Cargando...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="page-title" style={{ margin: 0 }}>Transferencias de Stock</h1>
                <button className="btn-primary" onClick={() => setShowModal(true)}>+ Nueva Transferencia</button>
            </div>

            <div className="glass-panel" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>ID</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Fecha</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Destino</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Items</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Estado</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ordenes.length === 0 ? (
                            <tr><td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No hay transferencias registradas.</td></tr>
                        ) : (
                            ordenes.map(orden => (
                                <tr key={orden.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem' }}>#{orden.id}</td>
                                    <td style={{ padding: '1rem' }}>{new Date(orden.fecha).toLocaleDateString()}</td>
                                    <td style={{ padding: '1rem' }}>{orden.complejoDestino?.nombre || `Complejo ${orden.complejo_id}`}</td>
                                    <td style={{ padding: '1rem' }}>{orden.items?.length || 0}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem',
                                            background: orden.estado === 'CONFIRMADA' ? 'rgba(52, 211, 153, 0.2)' : 'rgba(251, 191, 36, 0.2)',
                                            color: orden.estado === 'CONFIRMADA' ? '#34d399' : '#fbbf24'
                                        }}>
                                            {orden.estado}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => setDetalleOrden(orden)}
                                                style={{ color: '#e2e8f0', background: 'transparent', fontSize: '1.2rem' }}
                                                title="Ver detalle"
                                            >
                                                👁️
                                            </button>
                                            {orden.estado === 'BORRADOR' && (
                                                <>
                                                    <button 
                                                        onClick={() => handleConfirm(orden.id)}
                                                        style={{ color: '#34d399', background: 'transparent', fontWeight: 600 }}
                                                        title="Confirmar"
                                                    >
                                                        ✅
                                                    </button>
                                                    <button 
                                                        onClick={() => { setEditingOrden(orden); setShowModal(true); }}
                                                        style={{ color: '#60a5fa', background: 'transparent', fontSize: '1.2rem' }}
                                                        title="Editar"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(orden.id)}
                                                        style={{ color: '#ef4444', background: 'transparent', fontSize: '1.2rem' }}
                                                        title="Eliminar"
                                                    >
                                                        🗑️
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={showModal} onClose={() => { setShowModal(false); setEditingOrden(null); }} title={editingOrden ? "Editar Transferencia" : "Nueva Orden de Transferencia"}>
                <NewTransferenciaForm 
                    initialData={editingOrden}
                    onSubmit={editingOrden ? (data) => handleUpdate(editingOrden.id, data) : handleCreate} 
                    onCancel={() => { setShowModal(false); setEditingOrden(null); }} 
                />
            </Modal>

            <Modal
                isOpen={Boolean(detalleOrden)}
                onClose={() => setDetalleOrden(null)}
                title={`Detalle de Transferencia #${detalleOrden?.id || ''}`}
            >
                {detalleOrden?.items?.length ? (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {detalleOrden.items.map(item => (
                            <li key={item.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between' }}>
                                <span>{item.producto?.nombre} x {item.cantidad}</span>
                                {item.es_gasto && (
                                    <span style={{ color: '#fbbf24', fontSize: '0.85rem', border: '1px solid #fbbf24', padding: '0px 6px', borderRadius: '4px' }}>
                                        GASTO
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div style={{ color: 'var(--text-muted)' }}>Sin items para mostrar.</div>
                )}
            </Modal>
        </div>
    );
};

export default TransferenciasPage;
