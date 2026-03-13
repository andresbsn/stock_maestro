import React, { useState, useEffect } from 'react';
import productService from '../services/productService';
import complejosService from '../services/complejosService';

const NewTransferenciaForm = ({ onSubmit, onCancel, initialData }) => {
    const [complejoId, setComplejoId] = useState(''); 
    const [items, setItems] = useState([]);
    const [products, setProducts] = useState([]);
    const [complejos, setComplejos] = useState([]);
    
    // Item adding state
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState('');
    const [itemEsGasto, setItemEsGasto] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (initialData) {
            setComplejoId(initialData.complejo_id || '');
            if (initialData.items) {
                // Map existing items. Note: we need productName which is nested in item.producto.nombre usually
                const mappedItems = initialData.items.map(i => ({
                    producto_id: i.producto_id,
                    productName: i.producto?.nombre || 'Producto',
                    quantity: i.cantidad,
                    es_gasto: i.es_gasto
                }));
                setItems(mappedItems);
            }
        }
    }, [initialData]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, complejosRes] = await Promise.all([
                    productService.getAll(),
                    complejosService.getAll()
                ]);
                
                setProducts(productsRes.data || []);
                const complejosList = complejosRes.data || []; 
                setComplejos(complejosList);
                
                // If not editing and we have complexes, default to first one if not set
                if (!initialData && !complejoId && complejosList.length > 0) {
                    setComplejoId(complejosList[0].id);
                }
            } catch (err) {
                console.error("Error fetching data", err);
            }
        };
        fetchData();
    }, []);

    const filteredProducts = products.filter(p => 
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddItem = (e) => {
        e.preventDefault();
        if (!selectedProduct || !quantity) return;

        const product = products.find(p => p.id === parseInt(selectedProduct));
        if (!product) return;

        setItems(prev => [
            ...prev,
            {
                producto_id: product.id,
                productName: product.nombre,
                quantity: parseInt(quantity),
                es_gasto: itemEsGasto
            }
        ]);

        // Reset inputs
        setSelectedProduct('');
        setQuantity('');
        setItemEsGasto(false);
        setSearchTerm('');
    };

    const handleRemoveItem = (index) => {
        setItems(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (items.length === 0) {
            alert("Debe agregar al menos un producto para transferir.");
            return;
        }

        onSubmit({
            complejo_id: parseInt(complejoId),
            items: items.map(item => ({
                producto_id: item.producto_id,
                quantity: item.quantity,
                es_gasto: item.es_gasto
            }))
        });
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
             <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Complejo Destino</label>
                <select 
                    className="input-field" 
                    value={complejoId} 
                    onChange={e => setComplejoId(e.target.value)}
                >
                    <option value="">Seleccione complejo...</option>
                    {complejos.map(c => (
                        <option key={c.id} value={c.id}>
                            {c.nombre} (ID: {c.id})
                        </option>
                    ))}
                </select>
             </div>

             <div style={{ borderTop: '1px solid var(--border-color)', margin: '1rem 0' }}></div>

             {/* Add Item Section */}
             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
                    <div style={{ flex: 2 }}>
                        <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.8rem' }}>Producto</label>
                        <input
                            type="text"
                            placeholder="Buscar producto..."
                            className="input-field"
                            style={{ marginBottom: '0.5rem', fontSize: '0.9rem', padding: '0.5rem' }}
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        <select 
                            className="input-field" 
                            value={selectedProduct} 
                            onChange={e => setSelectedProduct(e.target.value)}
                        >
                            <option value="">Seleccione...</option>
                            {filteredProducts.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.nombre} (Stock Gral: {p.stockGeneral?.stock || 0})
                                </option>
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
                    <button type="button" onClick={handleAddItem} className="btn-primary" style={{ height: '42px', display: 'flex', alignItems: 'center' }}>
                        +
                    </button>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer', marginTop: '0.5rem' }}>
                    <input
                        type="checkbox"
                        checked={itemEsGasto}
                        onChange={(e) => setItemEsGasto(e.target.checked)}
                        style={{ width: '1rem', height: '1rem' }}
                    />
                    Marcar este item como gasto
                </label>
             </div>

             {/* Items List */}
             <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                 <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                        <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Producto</th>
                            <th style={{ textAlign: 'center', padding: '0.5rem' }}>Cant.</th>
                            <th style={{ textAlign: 'center', padding: '0.5rem' }}>Tipo</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '0.5rem' }}>{item.productName}</td>
                                <td style={{ padding: '0.5rem', textAlign: 'center' }}>{item.quantity}</td>
                                <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                                    {item.es_gasto ? (
                                        <span style={{ color: '#fbbf24', fontSize: '0.8rem', border: '1px solid #fbbf24', padding: '2px 6px', borderRadius: '4px' }}>GASTO</span>
                                    ) : (
                                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Normal</span>
                                    )}
                                </td>
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

             <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={onCancel} style={{ color: 'var(--text-muted)', background: 'transparent' }}>Cancelar</button>
                <button type="submit" className="btn-primary">{initialData ? 'Guardar Cambios' : 'Crear Borrador'}</button>
             </div>
        </form>
    );
};

export default NewTransferenciaForm;
