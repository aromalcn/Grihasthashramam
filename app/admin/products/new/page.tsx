'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import styles from '../../admin.module.css';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    stock: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('products').insert({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        image: formData.image || 'https://via.placeholder.com/600', // Default image
        category: formData.category,
        stock: parseInt(formData.stock) || 0
      });

      if (error) throw error;

      router.push('/admin/products');
      router.refresh(); // Refresh to show new product in list
    } catch (err: any) {
      console.error('Error creating product:', err);
      alert('Failed to create product: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className={styles.header} style={{ justifyContent: 'flex-start', gap: '1rem' }}>
        <Link href="/admin/products" style={{ display: 'flex', alignItems: 'center', color: '#666' }}>
          <ArrowLeft size={20} />
        </Link>
        <h1 className={styles.pageTitle}>Add New Product</h1>
      </div>

      <div className={styles.card} style={{ maxWidth: '800px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className={`${styles.formGrid} ${styles.formGridTwo}`}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Product Name</label>
              <input 
                name="name"
                type="text" 
                required
                value={formData.name}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Category</label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd', backgroundColor: 'white' }}
              >
                 <option value="">Select Category</option>
                 <option value="Beads">Beads</option>
                 <option value="Malas">Malas</option>
                 <option value="Experience">Experience</option>
              </select>
            </div>
          </div>

          <div>
             <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description</label>
             <textarea 
               name="description"
               rows={4}
               value={formData.description}
               onChange={handleChange}
               style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd', fontFamily: 'inherit' }}
             />
          </div>

          <div className={`${styles.formGrid} ${styles.formGridThree}`}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Price (₹)</label>
              <input 
                name="price"
                type="number" 
                required
                min="0"
                value={formData.price}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Stock Quantity</label>
              <input 
                name="stock"
                type="number" 
                min="0"
                value={formData.stock}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Image URL</label>
              <input 
                name="image"
                type="text" 
                placeholder="https://..."
                value={formData.image}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>
          </div>

          <div style={{ paddingTop: '1rem', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <Link href="/admin/products" className="btn" style={{ border: '1px solid #ddd', color: '#666', textDecoration: 'none' }}>
              Cancel
            </Link>
            <button 
              type="submit" 
              disabled={loading}
              className="btn"
              style={{ backgroundColor: 'var(--color-brown-deep)', color: 'white', border: 'none' }}
            >
              {loading ? 'Creating...' : 'Create Product'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
