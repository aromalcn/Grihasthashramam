'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import styles from '../admin.module.css';
import ConfirmationModal from '@/components/ConfirmationModal';
import Modal from '@/components/Modal';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal States
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; productId: string | null }>({
    isOpen: false,
    productId: null
  });

  const [alertModal, setAlertModal] = useState<{ 
    isOpen: boolean; 
    title: string; 
    message: string; 
    type: 'error' | 'success' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  const showAlert = (title: string, message: string, type: 'error' | 'success' | 'info' = 'error') => {
    setAlertModal({ isOpen: true, title, message, type });
  };

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setProducts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const initDeleteProduct = (id: string) => {
    setDeleteModal({ isOpen: true, productId: id });
  };

  const confirmDeleteProduct = async () => {
    if (!deleteModal.productId) return;

    try {
      const { error } = await supabase.from('products').delete().eq('id', deleteModal.productId);
      if (error) throw error;
      setProducts(products.filter(p => p.id !== deleteModal.productId));
      showAlert('Success', 'Product deleted successfully', 'success');
    } catch (err) {
      console.error('Error deleting product:', err);
      showAlert('Error', 'Failed to delete product.', 'error');
    } finally {
        setDeleteModal({ isOpen: false, productId: null });
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Products</h1>
        <Link href="/admin/products/new" className="btn" style={{ 
          backgroundColor: 'var(--color-brown-deep)', 
          color: 'white', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          padding: '0.75rem 1.5rem',
          borderRadius: '4px',
          textDecoration: 'none'
        }}>
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      <div className={styles.card}>
        <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '0.75rem 0.75rem 0.75rem 2.5rem', 
              borderRadius: '6px', 
              border: '1px solid #ddd',
              fontSize: '1rem'
            }}
          />
        </div>

        {loading ? (
          <div>Loading products...</div>
        ) : (
          <div className={styles.tableContainer}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #eee' }}>
                  <th style={{ padding: '1rem', color: '#666' }}>Image</th>
                  <th style={{ padding: '1rem', color: '#666' }}>Name</th>
                  <th style={{ padding: '1rem', color: '#666' }}>Category</th>
                  <th style={{ padding: '1rem', color: '#666' }}>Price</th>
                  <th style={{ padding: '1rem', color: '#666' }}>Stock</th>
                  <th style={{ padding: '1rem', color: '#666', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => (
                  <tr key={product.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '1rem' }}>
                      <img src={product.image} alt={product.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} onError={(e: any) => e.target.src = 'https://via.placeholder.com/40'} />
                    </td>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>{product.name}</td>
                    <td style={{ padding: '1rem', color: '#666' }}>{product.category || 'N/A'}</td>
                    <td style={{ padding: '1rem' }}>₹{product.price.toLocaleString()}</td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '4px', 
                        backgroundColor: (product.stock > 0) ? '#dcfce7' : '#fee2e2',
                        color: (product.stock > 0) ? '#166534' : '#991b1b',
                        fontSize: '0.85rem'
                      }}>
                        {product.stock > 0 ? product.stock : 'Out of Stock'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <Link href={`/admin/products/${product.id}`} style={{ padding: '0.5rem', color: '#2563eb', backgroundColor: '#eff6ff', borderRadius: '4px' }}>
                          <Edit size={18} />
                        </Link>
                        <button 
                          onClick={() => initDeleteProduct(product.id)}
                          style={{ padding: '0.5rem', color: '#dc2626', backgroundColor: '#fef2f2', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>No products found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={confirmDeleteProduct}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete Product"
        isDanger={true}
      />

      {/* Generic Alert Modal */}
      <Modal
        isOpen={alertModal.isOpen}
        onClose={() => setAlertModal({ ...alertModal, isOpen: false })}
        title={alertModal.title}
        message={alertModal.message}
        alertType={alertModal.type}
      />
    </div>
  );
}
