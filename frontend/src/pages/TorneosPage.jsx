import React, { useState, useEffect } from 'react';
import torneosService from '../services/torneosService';
import Modal from '../components/Modal';

const NewTorneoForm = ({ onSubmit, onCancel }) => {
    const [nombre, setNombre] = useState('');
    const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().split('T')[0]);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ nombre, fecha_inicio: fechaInicio });
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Nombre del Torneo</label>
                <input 
                    type="text" 
                    className="input-field" 
                    value={nombre} 
                    onChange={e => setNombre(e.target.value)} 
                    required
                    placeholder="Ej: Torneo Verano 2026"
                />
            </div>
            <div>
                 <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Fecha Inicio</label>
                 <input 
                    type="date" 
                    className="input-field" 
                    value={fechaInicio} 
                    onChange={e => setFechaInicio(e.target.value)} 
                    required
                 />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={onCancel} style={{ color: 'var(--text-muted)', background: 'transparent' }}>Cancelar</button>
                <button type="submit" className="btn-primary">Crear Torneo</button>
            </div>
        </form>
    );
};

const TorneosPage = () => {
    const [torneos, setTorneos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const fetchTorneos = async () => {
        try {
            setLoading(true);
            const res = await torneosService.getAll();
            setTorneos(res.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTorneos();
    }, []);

    const handleCreate = async (payload) => {
        try {
            await torneosService.create(payload);
            setShowModal(false);
            fetchTorneos();
        } catch (error) {
            alert('Error creando torneo: ' + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Seguro que desea eliminar este torneo?')) {
            try {
                await torneosService.delete(id);
                fetchTorneos();
            } catch (error) {
                alert('Error eliminando: ' + (error.response?.data?.error?.message || error.message));
            }
        }
    };
    
    // Simple toggle functionality for Admin dashboard if needed
    // For now purely list + create

    if (loading && torneos.length === 0) return <div style={{ padding: '2rem' }}>Cargando...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="page-title" style={{ margin: 0 }}>Gestión de Torneos</h1>
                <button className="btn-primary" onClick={() => setShowModal(true)}>+ Nuevo Torneo</button>
            </div>

            <div className="glass-panel" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                     <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>ID</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Nombre</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Inicio</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Estado</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)', textAlign: 'right' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {torneos.map(t => (
                            <tr key={t.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '1rem' }}>#{t.id}</td>
                                <td style={{ padding: '1rem', fontWeight: 'bold' }}>{t.nombre}</td>
                                <td style={{ padding: '1rem' }}>{t.fecha_inicio}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem',
                                        background: t.estado === 'ACTIVO' ? 'rgba(52, 211, 153, 0.2)' : 'rgba(255,255,255,0.05)',
                                        color: t.estado === 'ACTIVO' ? '#34d399' : 'var(--text-muted)'
                                    }}>
                                        {t.estado}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <button 
                                        onClick={() => handleDelete(t.id)} 
                                        style={{ 
                                            background: 'rgba(239, 68, 68, 0.1)', 
                                            color: '#ef4444', 
                                            border: 'none', 
                                            padding: '0.5rem', 
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.2)'}
                                        onMouseLeave={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Nuevo Torneo">
                <NewTorneoForm onSubmit={handleCreate} onCancel={() => setShowModal(false)} />
            </Modal>
        </div>
    );
};

export default TorneosPage;
