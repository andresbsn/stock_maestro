import React, { useState, useEffect } from 'react';
import complejosService from '../services/complejosService';
import Modal from '../components/Modal';

const ComplejoForm = ({ onSubmit, onCancel, initialData }) => {
    const [nombre, setNombre] = useState(initialData?.nombre || '');
    const [direccion, setDireccion] = useState(initialData?.direccion || '');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ nombre, direccion });
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Nombre del Complejo</label>
                <input 
                    type="text" 
                    className="input-field" 
                    value={nombre} 
                    onChange={e => setNombre(e.target.value)} 
                    required
                    placeholder="Ej: Complejo Norte"
                />
            </div>
            <div>
                 <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Dirección</label>
                 <input 
                    type="text" 
                    className="input-field" 
                    value={direccion} 
                    onChange={e => setDireccion(e.target.value)} 
                    placeholder="Ej: Av. Libertador 1234"
                 />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={onCancel} style={{ color: 'var(--text-muted)', background: 'transparent' }}>Cancelar</button>
                <button type="submit" className="btn-primary">{initialData ? 'Actualizar' : 'Crear'}</button>
            </div>
        </form>
    );
};

const ComplejosPage = () => {
    const [complejos, setComplejos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const fetchComplejos = async () => {
        try {
            setLoading(true);
            const res = await complejosService.getAll();
            setComplejos(res.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplejos();
    }, []);

    const handleCreateOrUpdate = async (payload) => {
        try {
            if (editingItem) {
                await complejosService.update(editingItem.id, payload);
            } else {
                await complejosService.create(payload);
            }
            setShowModal(false);
            setEditingItem(null);
            fetchComplejos();
        } catch (error) {
            alert('Error guardando complejo: ' + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Seguro que desea eliminar este complejo?')) {
            try {
                await complejosService.remove(id);
                fetchComplejos();
            } catch (error) {
                alert('Error eliminando: ' + (error.response?.data?.error?.message || error.message));
            }
        }
    };
    
    const openModal = (item = null) => {
        setEditingItem(item);
        setShowModal(true);
    };

    if (loading && complejos.length === 0) return <div style={{ padding: '2rem' }}>Cargando...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="page-title" style={{ margin: 0 }}>Gestión de Complejos</h1>
                <button className="btn-primary" onClick={() => openModal()}>+ Nuevo Complejo</button>
            </div>

            <div className="glass-panel" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                     <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>ID</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Nombre</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Dirección</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)', textAlign: 'right' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {complejos.map(c => (
                            <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '1rem' }}>#{c.id}</td>
                                <td style={{ padding: '1rem', fontWeight: 'bold' }}>{c.nombre}</td>
                                <td style={{ padding: '1rem' }}>{c.direccion || '-'}</td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <button 
                                        onClick={() => openModal(c)}
                                        style={{ 
                                            background: 'rgba(99, 102, 241, 0.1)', 
                                            color: '#6366f1', 
                                            border: 'none', 
                                            padding: '0.5rem', 
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            marginRight: '0.5rem',
                                            transition: 'background 0.2s'
                                        }}
                                    >
                                        ✏️
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(c.id)} 
                                        style={{ 
                                            background: 'rgba(239, 68, 68, 0.1)', 
                                            color: '#ef4444', 
                                            border: 'none', 
                                            padding: '0.5rem', 
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            transition: 'background 0.2s'
                                        }}
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {complejos.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No hay complejos registrados
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingItem ? 'Editar Complejo' : 'Nuevo Complejo'}>
                <ComplejoForm 
                    onSubmit={handleCreateOrUpdate} 
                    onCancel={() => setShowModal(false)} 
                    initialData={editingItem}
                />
            </Modal>
        </div>
    );
};

export default ComplejosPage;
