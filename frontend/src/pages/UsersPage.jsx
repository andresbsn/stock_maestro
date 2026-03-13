import React, { useState, useEffect } from 'react';
import usersService from '../services/usersService';
import complejosService from '../services/complejosService';
import Modal from '../components/Modal';

const UserForm = ({ onSubmit, onCancel, initialData, complejos }) => {
    const [username, setUsername] = useState(initialData?.username || '');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(initialData?.role || 'COMPLEJO');
    const [complejoId, setComplejoId] = useState(initialData?.complejo_id || '');
    const [active, setActive] = useState(initialData ? initialData.active : true);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { 
            username, 
            role, 
            active 
        };
        
        if (password) payload.password = password;
        if (role === 'COMPLEJO') payload.complejo_id = complejoId;

        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Usuario</label>
                <input 
                    type="text" 
                    className="input-field" 
                    value={username} 
                    onChange={e => setUsername(e.target.value)} 
                    required
                    placeholder="Ej: admin_complejo1"
                />
            </div>
            
            <div>
                 <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                     {initialData ? 'Contraseña (dejar en blanco para mantener)' : 'Contraseña'}
                 </label>
                 <input 
                    type="password" 
                    className="input-field" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    required={!initialData}
                    placeholder="******"
                 />
            </div>

            <div>
                 <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Rol</label>
                 <select 
                    className="input-field"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                 >
                     <option value="COMPLEJO">Encargado de Complejo</option>
                     <option value="ADMIN">Administrador</option>
                 </select>
            </div>

            {role === 'COMPLEJO' && (
                <div>
                     <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Asignar a Complejo</label>
                     <select 
                        className="input-field"
                        value={complejoId}
                        onChange={e => setComplejoId(e.target.value)}
                        required={role === 'COMPLEJO'}
                     >
                         <option value="">-- Seleccionar Complejo --</option>
                         {complejos.map(c => (
                             <option key={c.id} value={c.id}>{c.nombre}</option>
                         ))}
                     </select>
                </div>
            )}

            {initialData && (
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input 
                        type="checkbox" 
                        id="activeCheck"
                        checked={active} 
                        onChange={e => setActive(e.target.checked)} 
                    />
                    <label htmlFor="activeCheck" style={{ color: 'var(--text-muted)' }}>Usuario Activo</label>
                 </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={onCancel} style={{ color: 'var(--text-muted)', background: 'transparent' }}>Cancelar</button>
                <button type="submit" className="btn-primary">{initialData ? 'Actualizar' : 'Crear'}</button>
            </div>
        </form>
    );
};

const UsersPage = () => {
    const [users, setUsers] = useState([]);
    const [complejos, setComplejos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [usersRes, complejosRes] = await Promise.all([
                usersService.getAll(),
                complejosService.getAll()
            ]);
            setUsers(usersRes.data || []);
            setComplejos(complejosRes.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateOrUpdate = async (payload) => {
        try {
            if (editingItem) {
                await usersService.update(editingItem.id, payload);
            } else {
                await usersService.create(payload);
            }
            setShowModal(false);
            setEditingItem(null);
            fetchData();
        } catch (error) {
            alert('Error guardando usuario: ' + (error.response?.data?.error?.message || error.message));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Seguro que desea desactivar este usuario?')) {
            try {
                await usersService.remove(id);
                fetchData();
            } catch (error) {
                alert('Error eliminando: ' + (error.response?.data?.error?.message || error.message));
            }
        }
    };
    
    const openModal = (item = null) => {
        setEditingItem(item);
        setShowModal(true);
    };

    if (loading && users.length === 0) return <div style={{ padding: '2rem' }}>Cargando...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 className="page-title" style={{ margin: 0 }}>Gestión de Usuarios</h1>
                <button className="btn-primary" onClick={() => openModal()}>+ Nuevo Usuario</button>
            </div>

            <div className="glass-panel" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                     <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>ID</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Usuario</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Rol</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Complejo</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Estado</th>
                            <th style={{ padding: '1rem', color: 'var(--text-muted)', textAlign: 'right' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '1rem' }}>#{u.id}</td>
                                <td style={{ padding: '1rem', fontWeight: 'bold' }}>{u.username}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.5rem', 
                                        borderRadius: '4px',
                                        fontSize: '0.8rem',
                                        background: u.role === 'ADMIN' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                                        color: u.role === 'ADMIN' ? '#818cf8' : 'var(--text-muted)'
                                    }}>
                                        {u.role}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>{u.complejo ? u.complejo.nombre : '-'}</td>
                                <td style={{ padding: '1rem' }}>
                                    {u.active ? (
                                        <span style={{ color: '#34d399' }}>● Activo</span>
                                    ) : (
                                        <span style={{ color: '#ef4444' }}>● Inactivo</span>
                                    )}
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <button 
                                        onClick={() => openModal(u)}
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
                                    {u.active && (
                                        <button 
                                            onClick={() => handleDelete(u.id)} 
                                            style={{ 
                                                background: 'rgba(239, 68, 68, 0.1)', 
                                                color: '#ef4444', 
                                                border: 'none', 
                                                padding: '0.5rem', 
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                transition: 'background 0.2s'
                                            }}
                                            title="Desactivar"
                                        >
                                            🚫
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No hay usuarios registrados
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingItem ? 'Editar Usuario' : 'Nuevo Usuario'}>
                <UserForm 
                    onSubmit={handleCreateOrUpdate} 
                    onCancel={() => setShowModal(false)} 
                    initialData={editingItem}
                    complejos={complejos}
                />
            </Modal>
        </div>
    );
};

export default UsersPage;
