'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation'; // Using useParams
import { supabase } from '@/lib/supabase';
import styles from '../../admin.module.css';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: '',
    stock: ''
  });

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      console.log('Fetching product with ID:', id);

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching product:', JSON.stringify(error, null, 2));
        alert('Product not found! ' + error.message);
        router.push('/admin/products');
        return;
      }

      setFormData({
        name: data.name,
        description: data.description || '',
        price: data.price,
        image: data.image,
        category: data.category || '',
        stock: data.stock || 0
      });
      setLoading(false);
    };

    fetchProduct();
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('products')
        .update({
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price as string),
            image: formData.image,
            category: formData.category,
            stock: parseInt(formData.stock as string)
        })
        .eq('id', id);

      if (error) throw error;

      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      console.error('Error updating product:', err);
      alert('Failed to update product: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading product...</div>;

  return (
    <div>
      <div className={styles.header} style={{ justifyContent: 'flex-start', gap: '1rem' }}>
        <Link href="/admin/products" style={{ display: 'flex', alignItems: 'center', color: '#666' }}>
          <ArrowLeft size={20} />
        </Link>
        <h1 className={styles.pageTitle}>Edit Product</h1>
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
              {formData.image && (
                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                  <img 
                    src={formData.image} 
                    alt="Product Preview" 
                    style={{ maxWidth: '100%', height: 'auto', maxHeight: '200px', objectFit: 'contain', borderRadius: '4px', border: '1px solid #eee', padding: '0.25rem' }} 
                    onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.25rem' }}>Preview</p>
                </div>
              )}
            </div>
          </div>

          <div style={{ paddingTop: '1rem', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <Link href="/admin/products" className="btn" style={{ border: '1px solid #ddd', color: '#666', textDecoration: 'none' }}>
              Cancel
            </Link>
            <button 
              type="submit" 
              disabled={submitting}
              className="btn"
              style={{ backgroundColor: 'var(--color-brown-deep)', color: 'white', border: 'none' }}
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
