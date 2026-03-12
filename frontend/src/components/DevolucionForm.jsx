import React, { useEffect, useState } from 'react';
import cajasService from '../services/cajasService';
import productService from '../services/productService';

const DevolucionForm = ({ onSubmit, onCancel }) => {
    const [cajas, setCajas] = useState([]);
    const [products, setProducts] = useState([]);
    const [cajaId, setCajaId] = useState('');
    const [items, setItems] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState('');

    useEffect(() => {
        cajasService.getAll()
            .then(res => setCajas(res.data || []))
            .catch(err => console.error('Error cargando cajas', err));

        productService.getAll()
            .then(res => setProducts(res.data || []))
            .catch(err => console.error('Error cargando productos', err));
    }, []);

    const handleAddItem = (e) => {
        e.preventDefault();
        if (!selectedProduct || !quantity) return;

        const product = products.find(p => p.id === parseInt(selectedProduct, 10));
        if (!product) return;

        setItems(prev => [...prev, {
            producto_id: product.id,
            productName: product.nombre,
            quantity: parseInt(quantity, 10)
        }]);

        setSelectedProduct('');
        setQuantity('');
    };

    const handleRemoveItem = (index) => {
        setItems(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!cajaId) {
            alert('Debe seleccionar una caja');
            return;
        }
        if (items.length === 0) {
            alert('Debe agregar al menos un producto');
            return;
        }

        onSubmit({
            caja_id: parseInt(cajaId, 10),
            items: items.map(item => ({
                producto_id: item.producto_id,
                quantity: item.quantity
            }))
        });
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Caja</label>
                <select
                    className="input-field"
                    value={cajaId}
                    onChange={(e) => setCajaId(e.target.value)}
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

            <div style={{ borderTop: '1px solid var(--border-color)', margin: '0.5rem 0' }} />

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ flex: 2 }}>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.8rem' }}>Producto</label>
                    <select
                        className="input-field"
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                    >
                        <option value="">Seleccione...</option>
                        {products.map(p => (
                            <option key={p.id} value={p.id}>{p.nombre}</option>
                        ))}
                    </select>
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.8rem' }}>Cantidad</label>
                    <input
                        type="number"
                        className="input-field"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="0"
                    />
                </div>
                <button type="button" onClick={handleAddItem} className="btn-primary" style={{ height: '42px' }}>+</button>
            </div>

            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                        <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Producto</th>
                            <th style={{ textAlign: 'center', padding: '0.5rem' }}>Cant.</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '0.5rem' }}>{item.productName}</td>
                                <td style={{ padding: '0.5rem', textAlign: 'center' }}>{item.quantity}</td>
                                <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveItem(idx)}
                                        style={{ color: '#ef4444', background: 'transparent' }}
                                    >
                                        &times;
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button type="button" onClick={onCancel} style={{ color: 'var(--text-muted)', background: 'transparent' }}>Cancelar</button>
                <button type="submit" className="btn-primary">Registrar Devolución</button>
            </div>
        </form>
    );
};

export default DevolucionForm;
