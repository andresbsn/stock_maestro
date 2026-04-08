import React, { useEffect, useState } from 'react';
import productService from '../services/productService';
import Modal from '../components/Modal';
import ProductoForm from '../components/ProductoForm';
import { useAuth } from '../context/AuthContext';

const ProductosPage = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll();
      setProducts(data.data || []);
    } catch (err) {
      setError('Error al cargar productos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreate = async (formData) => {
    try {
      await productService.create(formData);
      setModalOpen(false);
      fetchProducts();
    } catch (err) {
      alert('Error al crear producto: ' + (err.response?.data?.error?.message || err.message));
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await productService.update(editingProduct.id, formData);
      setModalOpen(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      alert('Error al actualizar: ' + (err.response?.data?.error?.message || err.message));
    }
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const filteredProducts = products.filter(product => {
    const term = searchTerm.toLowerCase();
    return (
      (product.nombre?.toLowerCase().includes(term)) ||
      (product.sku?.toLowerCase().includes(term))
    );
  });

  if (loading && products.length === 0) return <div style={{ padding: '2rem' }}>Cargando...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Productos</h1>
        {user?.role === 'ADMIN' && (
            <button className="btn-primary" onClick={openCreateModal}>+ Nuevo Producto</button>
        )}
      </div>

      {error && <div style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</div>}

      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', animation: 'fadeIn 0.5s ease-out' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '500px' }}>
            <span style={{ 
                position: 'absolute', 
                left: '1rem', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: 'var(--primary)', 
                pointerEvents: 'none',
                opacity: 0.7,
                fontSize: '1.1rem'
            }}>
              🔍
            </span>
            <input 
              type="text" 
              placeholder="Buscar por descripción o SKU..." 
              className="input-field" 
              style={{ 
                  paddingLeft: '2.75rem', 
                  paddingRight: searchTerm ? '2.5rem' : '1rem',
                  border: '1px solid rgba(255,255,255,0.05)',
                  background: 'rgba(255,255,255,0.03)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px rgba(99, 102, 241, 0.2), 0 10px 15px -3px rgba(0, 0, 0, 0.1)'}
              onBlur={(e) => e.target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'}
            />
            {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  style={{ 
                      position: 'absolute', 
                      right: '0.75rem', 
                      top: '50%', 
                      transform: 'translateY(-50%)', 
                      background: 'rgba(255,255,255,0.1)', 
                      border: 'none',
                      color: 'var(--text-muted)',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                  onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                >
                  ✕
                </button>
            )}
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>
              {filteredProducts.length} {filteredProducts.length === 1 ? 'resultado' : 'resultados'}
          </div>
      </div>

      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>SKU</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Nombre / Descripción</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Stock</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Precio</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Estado</th>
              {user?.role === 'ADMIN' && (
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Acciones</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '1rem' }}>{product.sku}</td>
                <td style={{ padding: '1rem' }}>{product.nombre}</td>
                <td style={{ padding: '1rem', color: (product.stock || 0) <= 0 ? '#ef4444' : 'inherit', fontWeight: (product.stock || 0) <= 0 ? 'bold' : 'normal' }}>
                    {(product.stock || 0) <= 0 ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '1.2rem' }}>⚠️</span> 0 (Sin Stock)
                        </span>
                    ) : (
                        product.stock
                    )}
                </td>
                <td style={{ padding: '1rem' }}>${product.precio_venta_unitario}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    background: product.activo ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: product.activo ? '#34d399' : '#f87171'
                  }}>
                    {product.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                {user?.role === 'ADMIN' && (
                    <td style={{ padding: '1rem' }}>
                      <button 
                        onClick={() => openEditModal(product)}
                        style={{
                           background: 'rgba(99, 102, 241, 0.1)',
                           color: 'var(--primary)',
                           fontWeight: 600,
                           padding: '0.5rem 1rem',
                           borderRadius: '8px'
                        }}
                      >
                        Editar
                      </button>
                    </td>
                )}
              </tr>
            ))}
            {filteredProducts.length === 0 && (
                <tr>
                    <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No se encontraron productos{searchTerm ? ` que coincidan con "${searchTerm}"` : '.'}
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title={editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
      >
        <ProductoForm 
          onSubmit={editingProduct ? handleUpdate : handleCreate}
          initialData={editingProduct}
          onCancel={() => setModalOpen(false)}
          isAdmin={user?.role === 'ADMIN'}
        />
      </Modal>
    </div>
  );
};

export default ProductosPage;
