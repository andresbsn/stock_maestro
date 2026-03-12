import React, { useState, useEffect } from 'react';
import productService from '../services/productService';

const NewCompraForm = ({ onSubmit, onCancel, initialData, readOnly = false }) => {
    const [proveedor, setProveedor] = useState('');
    const [observaciones, setObservaciones] = useState('');
    const [items, setItems] = useState([]);
    const [products, setProducts] = useState([]);
    
    // Item adding state
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState('');
    const [cost, setCost] = useState('');

    useEffect(() => {
        if (initialData) {
            setProveedor(initialData.proveedor || '');
            setObservaciones(initialData.observaciones || '');
            if (initialData.items) {
                const mappedItems = initialData.items.map(i => ({
                    producto_id: i.producto_id,
                    productName: i.producto?.nombre || 'Producto',
                    quantity: i.cantidad,
                    cost: i.costo_unitario_snapshot
                }));
                setItems(mappedItems);
            }
        }
    }, [initialData]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await productService.getAll();
                setProducts(res.data || []);
            } catch (err) {
                console.error("Error fetching products", err);
            }
        };
        fetchProducts();
    }, []);

    const handleAddItem = (e) => {
        e.preventDefault();
        if (!selectedProduct || !quantity || !cost) return;

        const product = products.find(p => p.id === parseInt(selectedProduct));
        if (!product) return;

        setItems(prev => [
            ...prev,
            {
                producto_id: product.id,
                productName: product.nombre,
                quantity: parseInt(quantity),
                cost: parseFloat(cost)
            }
        ]);

        // Reset inputs
        setSelectedProduct('');
        setQuantity('');
        setCost('');
    };

    const handleRemoveItem = (index) => {
        setItems(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (readOnly) return;
        if (items.length === 0) {
            alert("Debe agregar al menos un producto.");
            return;
        }

        onSubmit({
            proveedor,
            observaciones,
            items: items.map(item => ({
                producto_id: item.producto_id,
                quantity: item.quantity,
                cost: item.cost
            }))
        });
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Proveedor</label>
                    <input 
                        type="text" 
                        className="input-field" 
                        value={proveedor} 
                        onChange={e => setProveedor(e.target.value)} 
                        disabled={readOnly}
                    />
                </div>
                <div>
                     <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Notas / Observaciones</label>
                    <input 
                        type="text" 
                        className="input-field" 
                        value={observaciones} 
                        onChange={e => setObservaciones(e.target.value)} 
                        disabled={readOnly}
                    />
                </div>
             </div>

             <div style={{ borderTop: '1px solid var(--border-color)', margin: '1rem 0' }}></div>

             {/* Add Item Section - Hide if readOnly */}
             {!readOnly && (
                 <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px' }}>
                    <div style={{ flex: 2 }}>
                        <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.8rem' }}>Producto</label>
                        <select 
                            className="input-field" 
                            value={selectedProduct} 
                            onChange={e => setSelectedProduct(e.target.value)}
                        >
                            <option value="">Seleccione...</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>{p.nombre} (Actual Cost: ${p.costo_unitario})</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ flex: 1 }}>
                         <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.8rem' }}>Cantidad</label>
                         <input 
                            type="number" 
                            className="input-field" 
                            value={quantity}
                            onChange={e => setQuantity(e.target.value)}
                            placeholder="0"
                         />
                    </div>
                    <div style={{ flex: 1 }}>
                         <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.8rem' }}>Costo Unit.</label>
                         <input 
                            type="number" 
                            step="0.01"
                            className="input-field" 
                            value={cost}
                            onChange={e => setCost(e.target.value)}
                            placeholder="$"
                         />
                    </div>
                    <button type="button" onClick={handleAddItem} className="btn-primary" style={{ height: '42px', display: 'flex', alignItems: 'center' }}>
                        +
                    </button>
                 </div>
             )}

             {/* Items List */}
             <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                 <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                        <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Producto</th>
                            <th style={{ textAlign: 'center', padding: '0.5rem' }}>Cant.</th>
                            <th style={{ textAlign: 'center', padding: '0.5rem' }}>Costo</th>
                            <th style={{ textAlign: 'center', padding: '0.5rem' }}>Subtotal</th>
                            {!readOnly && <th></th>}
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '0.5rem' }}>{item.productName}</td>
                                <td style={{ padding: '0.5rem', textAlign: 'center' }}>{item.quantity}</td>
                                <td style={{ padding: '0.5rem', textAlign: 'center' }}>${item.cost}</td>
                                <td style={{ padding: '0.5rem', textAlign: 'center' }}>${(item.quantity * item.cost).toFixed(2)}</td>
                                {!readOnly && (
                                    <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                                        <button 
                                            type="button" 
                                            onClick={() => handleRemoveItem(idx)}
                                            style={{ color: '#ef4444', background: 'transparent' }}
                                        >
                                            &times;
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                 </table>
             </div>

             <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={onCancel} style={{ color: 'var(--text-muted)', background: 'transparent' }}>{readOnly ? 'Cerrar' : 'Cancelar'}</button>
                {!readOnly && <button type="submit" className="btn-primary">Registrar Compra</button>}
             </div>
        </form>
    );
};

export default NewCompraForm;
