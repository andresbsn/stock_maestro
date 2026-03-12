import React, { useEffect, useState } from 'react';
import Modal from '../components/Modal';
import GastoForm from '../components/GastoForm';
import gastosService from '../services/gastosService';

const GastosPage = () => {
    const [gastos, setGastos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const fetchGastos = async () => {
        try {
            setLoading(true);
            const res = await gastosService.getAll();
            setGastos(res.data || []);
        } catch (error) {
            console.error('Error cargando gastos', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGastos();
    }, []);

    const handleCreate = async (payload) => {
        try {
            await gastosService.create(payload);
            setShowModal(false);
            fetchGastos();
        } catch (error) {
            alert('Error al registrar gasto: ' + (error.response?.data?.error?.message || error.message));
        }
    };

    if (loading && gastos.length === 0) return <div style={{ padding: '2rem' }}>Cargando...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="page-title" style={{ margin: 0 }}>Gastos</h1>
                <button className="btn-primary" onClick={() => setShowModal(true)}>+ Nuevo Gasto</button>
            </div>

            <div className="glass-panel" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Caja</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Fecha</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Monto</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Descripción</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Categoría</th>
                        </tr>
                    </thead>
                    <tbody>
                        {gastos.length === 0 ? (
                            <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No hay gastos registrados.</td></tr>
                        ) : (
                            gastos.map(gasto => (
                                <tr key={gasto.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem' }}>#{gasto.caja_id}</td>
                                    <td style={{ padding: '1rem' }}>{new Date(gasto.created_at).toLocaleString()}</td>
                                    <td style={{ padding: '1rem', color: '#f87171' }}>- ${gasto.monto}</td>
                                    <td style={{ padding: '1rem' }}>{gasto.descripcion}</td>
                                    <td style={{ padding: '1rem' }}>{gasto.categoria || '-'}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Registrar Gasto">
                <GastoForm onSubmit={handleCreate} onCancel={() => setShowModal(false)} />
            </Modal>
        </div>
    );
};

export default GastosPage;
