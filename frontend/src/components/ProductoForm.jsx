import React, { useState, useEffect } from 'react';

const ProductoForm = ({ onSubmit, initialData, onCancel }) => {
  const [formData, setFormData] = useState({
    sku: '',
    nombre: '',
    unidad: 'un',
    costo_unitario: '',
    precio_venta_unitario: '',
    activo: true
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        sku: initialData.sku || '',
        nombre: initialData.nombre || '',
        unidad: initialData.unidad || 'un',
        costo_unitario: initialData.costo_unitario || '',
        precio_venta_unitario: initialData.precio_venta_unitario || '',
        activo: initialData.activo !== undefined ? initialData.activo : true
      });
    } else {
        setFormData({
            sku: '',
            nombre: '',
            unidad: 'un',
            costo_unitario: '',
            precio_venta_unitario: '',
            activo: true
        });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>SKU</label>
        <input
          type="text"
          name="sku"
          value={formData.sku}
          onChange={handleChange}
          className="input-field"
          required
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Nombre</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className="input-field"
          required
        />
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Unidad</label>
            <input
            type="text"
            name="unidad"
            value={formData.unidad}
            onChange={handleChange}
            className="input-field"
            />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', paddingTop: '1.5rem' }}>
             <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                    type="checkbox"
                    name="activo"
                    checked={formData.activo}
                    onChange={handleChange}
                    style={{ width: '1.2rem', height: '1.2rem' }}
                />
                Activo
            </label>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem' }}>
        <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Costo</label>
            <input
            type="number"
            step="0.01"
            name="costo_unitario"
            value={formData.costo_unitario}
            onChange={handleChange}
            className="input-field"
            />
        </div>

        <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Precio Venta</label>
            <input
            type="number"
            step="0.01"
            name="precio_venta_unitario"
            value={formData.precio_venta_unitario}
            onChange={handleChange}
            className="input-field"
            />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
        <button 
          type="button" 
          onClick={onCancel}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'transparent',
            border: '1px solid var(--border-color)',
            color: 'var(--text-main)',
            borderRadius: 'var(--radius)',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
          onMouseLeave={(e) => e.target.style.background = 'transparent'}
        >
          Cancelar
        </button>
        <button type="submit" className="btn-primary">
          {initialData ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
};

export default ProductoForm;
