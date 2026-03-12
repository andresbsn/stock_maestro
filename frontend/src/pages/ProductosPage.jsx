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

      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>SKU</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Nombre</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Stock</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Precio</th>
              <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Estado</th>
              {user?.role === 'ADMIN' && (
                <th style={{ padding: '1rem', color: 'var(--text-muted)', fontWeight: 600 }}>Acciones</th>
              )}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
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
                           background: 'transparent',
                           color: 'var(--primary)',
                           fontWeight: 600
                        }}
                      >
                        Editar
                      </button>
                    </td>
                )}
              </tr>
            ))}
            {products.length === 0 && (
                <tr>
                    <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No hay productos registrados.
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
        />
      </Modal>
    </div>
  );
};

export default ProductosPage;
