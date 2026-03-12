import React, { useEffect, useState } from 'react';
import cajasService from '../services/cajasService';

const GastoForm = ({ onSubmit, onCancel }) => {
    const [cajas, setCajas] = useState([]);
    const [formData, setFormData] = useState({
        caja_id: '',
        monto: '',
        descripcion: '',
        categoria: ''
    });

    useEffect(() => {
        cajasService.getAll()
            .then(res => setCajas(res.data || []))
            .catch(err => console.error('Error cargando cajas', err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.caja_id) {
            alert('Debe seleccionar una caja');
            return;
        }
        onSubmit({
            ...formData,
            caja_id: parseInt(formData.caja_id, 10),
            monto: parseFloat(formData.monto)
        });
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Caja</label>
                <select
                    className="input-field"
                    name="caja_id"
                    value={formData.caja_id}
                    onChange={handleChange}
                    required
                >
                    <option value="">Seleccione...</option>
                    {cajas.map(caja => (
                        <option key={caja.id} value={caja.id}>
                            Caja #{caja.id} - {caja.estado}
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
