import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import cajasService from '../services/cajasService';
import ventasService from '../services/ventasService';
import productService from '../services/productService';
import { useNavigate } from 'react-router-dom';

// Simplified modal for opening a box if none exists
const OpenBoxModal = ({ isOpen, onClose, onBoxOpened, userComplejoId }) => {
    const [monto, setMonto] = useState('');
    const [error, setError] = useState('');
    
    // In a real app, these IDs might come from user context or selectors
    // Hardcoding for MVP or deriving
    const [complejoId, setComplejoId] = useState(userComplejoId);  
    const [torneoId, setTorneoId] = useState('');
    const [torneos, setTorneos] = useState([]);

    useEffect(() => {
        if (isOpen) {
            import('../services/torneosService').then(module => {
                module.default.getActive().then(res => {
                    setTorneos(res.data || []);
                    if (res.data && res.data.length > 0) {
                         // Default to first active tournament
                        setTorneoId(res.data[0].id);
                    }
                }).catch(err => console.error("Failed to load torneos", err));
            });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!torneoId) {
                setError('Debe seleccionar un torneo activo');
                return;
            }

            await cajasService.abrir({
                complejoId, 
                torneoId, 
                montoInicial: parseFloat(monto) || 0
            });
            onBoxOpened();
        } catch (err) {
            setError(err.response?.data?.error?.message || err.message);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
            background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
            <div className="glass-panel" style={{ padding: '2rem', width: '400px' }}>
                <h2 style={{ marginBottom: '1rem' }}>Abrir Caja</h2>
                {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Torneo Activo</label>
                    <select 
                        className="input-field" 
                        value={torneoId}
                        onChange={e => setTorneoId(e.target.value)}
                        style={{ marginBottom: '1rem' }}
                        required
                    >
                        {torneos.map(t => (
                            <option key={t.id} value={t.id}>{t.nombre}</option>
                        ))}
                    </select>

                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Monto Inicial</label>
                    <input 
                        type="number" 
                        value={monto} 
                        onChange={e => setMonto(e.target.value)} 
                        className="input-field" 
                        style={{ marginBottom: '1rem' }} 
                        required 
                    />
                    
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                         <button type="button" onClick={onClose} style={{ color: 'white', background: 'transparent' }}>Cancelar</button>
                         <button type="submit" className="btn-primary">Abrir Caja</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Main Component
const VentasPage = () => {
    const { user } = useAuth();
    const [activeCaja, setActiveCaja] = useState(null);
    const [loadingCaja, setLoadingCaja] = useState(true);
    const [showOpenBoxModal, setShowOpenBoxModal] = useState(false);
    
    // Sales History State
    const [sales, setSales] = useState([]);
    
    // New Sale State
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]); // [{ product, quantity, tipo }]
    const [searchTerm, setSearchTerm] = useState('');
    const [payments, setPayments] = useState([{ metodo: 'EFECTIVO', monto: '' }]);
    const [detalleCortesia, setDetalleCortesia] = useState('');

    useEffect(() => {
        checkActiveCaja();
        fetchProducts();
        fetchSales();
    }, []);

    const checkActiveCaja = async () => {
        try {
            // Check for complex from user
            const cId = user?.complejo_id;
            const res = await cajasService.getActive({ complejoId: cId });
            setActiveCaja(res.data);
        } catch (error) {
            console.error("Error checking caja", error);
        } finally {
            setLoadingCaja(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await productService.getAll();
            setProducts(res.data || []);
        } catch (error) {
            console.error("Error fetching products", error);
        }
    };
    
    const fetchSales = async () => {
        try {
             // Fetch all sales for recent history
             const res = await ventasService.getAll();
             setSales(res.data || []);
        } catch (error) {
            console.error("Error fetching sales", error);
        }
    };

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { product, quantity: 1, tipo: 'GANANCIA' }];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.product.id !== productId));
    };
    
    const updateQuantity = (productId, delta) => {
        setCart(prev => prev.map(item => {
             if (item.product.id === productId) {
                 const newQty = Math.max(1, item.quantity + delta);
                 return { ...item, quantity: newQty };
             }
             return item;
        }));
    };

    const updateTipo = (productId, tipo) => {
        setCart(prev => prev.map(item => (
            item.product.id === productId ? { ...item, tipo } : item
        )));
    };

    const getTotal = () => {
        return cart.reduce((acc, item) => acc + (item.product.precio_venta_unitario * item.quantity), 0);
    };

    const totalPagado = payments.reduce((acc, pago) => acc + Number(pago.monto || 0), 0);
    const totalVenta = getTotal();
    const saldoPendiente = Math.max(0, totalVenta - totalPagado);

    useEffect(() => {
        if (payments.length === 1 && payments[0].metodo === 'CORTESIA') {
            setPayments([{ metodo: 'CORTESIA', monto: totalVenta }]);
        } else if (payments.length === 1 && payments[0].monto === '') {
            setPayments([{ ...payments[0], monto: totalVenta }]);
        }
    }, [totalVenta]);

    const updatePayment = (index, field, value) => {
        setPayments(prev => prev.map((pago, idx) => {
            if (idx !== index) return pago;
            if (field === 'metodo') {
                if (value === 'CORTESIA') {
                    setDetalleCortesia('');
                    return { metodo: 'CORTESIA', monto: totalVenta };
                }
                return { ...pago, metodo: value };
            }
            return { ...pago, monto: value };
        }));
    };

    const addPayment = () => {
        if (payments.some(pago => pago.metodo === 'CORTESIA')) return;
        setPayments(prev => [...prev, { metodo: 'EFECTIVO', monto: '' }]);
    };

    const removePayment = (index) => {
        setPayments(prev => prev.filter((_, idx) => idx !== index));
    };

    const handleCheckout = async () => {
        if (!activeCaja) { 
             alert("No hay caja abierta.");
             return;
        }
        if (cart.length === 0) return;

        try {
            if (payments.some(pago => pago.metodo === 'CORTESIA') && !detalleCortesia) {
                alert('Debe ingresar el detalle de la cortesía');
                return;
            }
            if (totalPagado > totalVenta) {
                alert('El total pagado no puede superar el total de la venta');
                return;
            }
            const payload = {
                caja_id: activeCaja.id,
                metodo_pago: payments[0]?.metodo || 'EFECTIVO',
                detalle_cortesia: payments.some(pago => pago.metodo === 'CORTESIA') ? detalleCortesia : null,
                pagos: payments.map(pago => ({
                    metodo: pago.metodo,
                    monto: Number(pago.monto || 0)
                })),
                total_pagado: totalPagado,
                items: cart.map(item => ({
                    producto_id: item.product.id,
                    quantity: item.quantity,
                    tipo: item.tipo
                }))
            };
            
            await ventasService.create(payload);
            setCart([]);
            fetchSales(); // Refresh history
            alert("Venta registrada con éxito!");
        } catch (error) {
            alert("Error al registrar venta: " + (error.response?.data?.error?.message || error.message));
        }
    };
    
    const filteredProducts = products.filter(p => 
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loadingCaja) return <div style={{ padding: '2rem' }}>Cargando caja...</div>;

    return (
        <div style={{ display: 'flex', gap: '2rem', height: 'calc(100vh - 4rem)' }}>
            {/* LEFT: New Sale */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 className="page-title" style={{ margin: 0 }}>Nueva Venta</h1>
                    {!activeCaja ? (
                        <button className="btn-primary" style={{ background: '#ef4444' }} onClick={() => setShowOpenBoxModal(true)}>
                            ⚠️ ABRIR CAJA
                        </button>
                    ) : (
                        <div style={{ color: '#34d399', fontWeight: 'bold' }}>
                            Caja #{activeCaja.id} Abierta
                        </div>
                    )}
                </div>

                {/* Product Search & List */}
                <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                        <input 
                            type="text" 
                            className="input-field" 
                            placeholder="Buscar producto (nombre o SKU)..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
                            {filteredProducts.map(product => {
                                const hasStock = (product.stock || 0) > 0;
                                const isDisabled = !product.activo || !hasStock;
                                return (
                                    <div 
                                        key={product.id} 
                                        className="glass-panel"
                                        style={{ 
                                            padding: '1rem', 
                                            cursor: isDisabled ? 'not-allowed' : 'pointer',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            textAlign: 'center',
                                            backgroundColor: isDisabled ? 'rgba(0,0,0,0.4)' : 'transparent',
                                            opacity: isDisabled ? 0.6 : 1,
                                            position: 'relative'
                                        }}
                                        onClick={() => !isDisabled && addToCart(product)}
                                    >
                                        {!hasStock && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                background: '#ef4444',
                                                color: 'white',
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: '5px',
                                                fontWeight: 'bold',
                                                fontSize: '0.9rem',
                                                zIndex: 10,
                                                whiteSpace: 'nowrap',
                                                boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                                            }}>
                                                SIN STOCK
                                            </div>
                                        )}
                                        <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{product.nombre}</div>
                                        <div style={{ color: 'var(--primary)' }}>${product.precio_venta_unitario}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>SKU: {product.sku}</div>
                                        <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: hasStock ? '#34d399' : '#f87171' }}>
                                            Disponible: {product.stock || 0}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT: Cart & History (Tabs maybe? For now split) */}
            <div style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                {/* Cart */}
                <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1rem' }}>
                    <h2 style={{ marginBottom: '1rem' }}>Carrito</h2>
                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {cart.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>Carrito vacío</p>
                        ) : (
                            cart.map(item => (
                                <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '8px', gap: '0.5rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <div>{item.product.nombre}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>${item.product.precio_venta_unitario} x {item.quantity}</div>
                                    </div>
                                    <select
                                        className="input-field"
                                        value={item.tipo}
                                        onChange={(e) => updateTipo(item.product.id, e.target.value)}
                                        style={{ width: '120px', fontSize: '0.8rem' }}
                                    >
                                        <option value="GANANCIA">Ganancia</option>
                                        <option value="GASTO">Gasto</option>
                                    </select>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <button onClick={() => updateQuantity(item.product.id, -1)} style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', color: 'white' }}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.product.id, 1)} style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', color: 'white' }}>+</button>
                                        <button onClick={() => removeFromCart(item.product.id)} style={{ marginLeft: '0.5rem', color: '#ef4444', background: 'transparent' }}>🗑️</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    
                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                            <span>Total</span>
                            <span>${getTotal().toFixed(2)}</span>
                        </div>
                        
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Pagos</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {payments.map((pago, idx) => (
                                    <div key={`${pago.metodo}-${idx}`} style={{ display: 'grid', gridTemplateColumns: '1fr 110px auto', gap: '0.5rem', alignItems: 'center' }}>
                                        <select
                                            className="input-field"
                                            value={pago.metodo}
                                            onChange={(e) => updatePayment(idx, 'metodo', e.target.value)}
                                            disabled={payments.some(p => p.metodo === 'CORTESIA') && pago.metodo === 'CORTESIA'}
                                        >
                                            <option value="EFECTIVO">Efectivo</option>
                                            <option value="TRANSFERENCIA">Transferencia</option>
                                            <option value="QR">QR / Mercado Pago</option>
                                            <option value="OTRO">Otro</option>
                                            <option value="CORTESIA">Cortesía</option>
                                        </select>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            className="input-field"
                                            value={pago.monto}
                                            onChange={(e) => updatePayment(idx, 'monto', e.target.value)}
                                            disabled={pago.metodo === 'CORTESIA'}
                                        />
                                        {payments.length > 1 && pago.metodo !== 'CORTESIA' ? (
                                            <button type="button" onClick={() => removePayment(idx)} style={{ color: '#ef4444', background: 'transparent' }}>✕</button>
                                        ) : (
                                            <span />
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={addPayment}
                                disabled={payments.some(pago => pago.metodo === 'CORTESIA')}
                                style={{ marginTop: '0.75rem', width: '100%' }}
                                className="btn-secondary"
                            >
                                Agregar otra forma de pago
                            </button>
                            <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                Pagado: ${totalPagado.toFixed(2)} | Pendiente: ${saldoPendiente.toFixed(2)}
                            </div>
                        </div>

                        {payments.some(pago => pago.metodo === 'CORTESIA') && (
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Detalle de Cortesía</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={detalleCortesia}
                                    onChange={(e) => setDetalleCortesia(e.target.value)}
                                    placeholder="Detalle obligatorio"
                                    required
                                />
                            </div>
                        )}

                        <button 
                            className="btn-primary" 
                            style={{ width: '100%', opacity: (!activeCaja || cart.length === 0 || totalPagado <= 0 || (payments.some(pago => pago.metodo === 'CORTESIA') && !detalleCortesia)) ? 0.5 : 1 }}
                            disabled={!activeCaja || cart.length === 0 || totalPagado <= 0 || (payments.some(pago => pago.metodo === 'CORTESIA') && !detalleCortesia)}
                            onClick={handleCheckout}
                        >
                            Confirmar Venta
                        </button>
                    </div>
                </div>

                {/* Info / Last Sale */}
                <div className="glass-panel" style={{ height: '30%', padding: '1rem', overflowY: 'auto' }}>
                     <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem', color: 'var(--text-muted)' }}>Últimas Ventas</h3>
                     {sales.slice(0, 5).map(sale => (
                         <div key={sale.id} style={{ fontSize: '0.85rem', marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.25rem' }}>
                             <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                 <span>#{sale.id} - {new Date(sale.created_at).toLocaleTimeString()}</span>
                                 <span style={{ color: 'var(--primary)' }}>${sale.total}</span>
                             </div>
                             <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{sale.metodo_pago}</div>
                         </div>
                     ))}
                </div>
            </div>

            <OpenBoxModal 
                isOpen={showOpenBoxModal} 
                onClose={() => setShowOpenBoxModal(false)}
                onBoxOpened={() => { setShowOpenBoxModal(false); checkActiveCaja(); }}
                userComplejoId={user?.complejo_id}
            />
        </div>
    );
};

export default VentasPage;
