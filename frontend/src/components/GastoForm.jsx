import React, { useEffect, useState } from 'react';
import torneosService from '../services/torneosService';

const GastoForm = ({ onSubmit, onCancel }) => {
    const [torneos, setTorneos] = useState([]);
    const [formData, setFormData] = useState({
        torneo_id: '',
        monto: '',
        descripcion: '',
        categoria: ''
    });

    useEffect(() => {
        torneosService.getActive()
            .then(res => setTorneos(res.data || []))
            .catch(err => console.error('Error cargando torneos', err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.torneo_id) {
            alert('Debe seleccionar un torneo');
            return;
        }
        onSubmit({
            ...formData,
            torneo_id: parseInt(formData.torneo_id, 10),
            monto: parseFloat(formData.monto)
        });
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Torneo</label>
                <select
                    className="input-field"
                    name="torneo_id"
                    value={formData.torneo_id}
                    onChange={handleChange}
                    required
                >
                    <option value="">Seleccione un torneo...</option>
                    {torneos.map(torneo => (
                        <option key={torneo.id} value={torneo.id}>
                            #{torneo.id} - {torneo.nombre}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Monto</label>
                <input
                    type="number"
                    name="monto"
                    step="0.01"
                    className="input-field"
                    value={formData.monto}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Descripción</label>
                <input
                    type="text"
                    name="descripcion"
                    className="input-field"
                    value={formData.descripcion}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Categoría</label>
                <input
                    type="text"
                    name="categoria"
                    className="input-field"
                    value={formData.categoria}
                    onChange={handleChange}
                />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" onClick={onCancel} style={{ color: 'var(--text-muted)', background: 'transparent' }}>Cancelar</button>
                <button type="submit" className="btn-primary">Registrar Gasto</button>
            </div>
        </form>
    );
};

export default GastoForm;
