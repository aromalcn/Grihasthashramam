'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import styles from '../../admin.module.css';
import Modal from '@/components/Modal';

export default function AddStaffPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    phone: '',
    email: '',
    display_order: 0
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = null;

      // Upload image if selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('staff-images')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('staff-images')
          .getPublicUrl(fileName);
        
        imageUrl = publicUrl;
      }

      const { error } = await supabase.from('staff').insert([{
        ...formData,
        image_url: imageUrl
      }]);

      if (error) throw error;

      showAlert('Success', 'Staff member added successfully!', 'success');
      // Redirect handled by Modal close logic or timeout
      setTimeout(() => router.push('/admin/staff'), 1500);
    } catch (err: any) {
      console.error('Error adding staff:', err);
      showAlert('Error', err.message || 'Failed to add staff member.', 'error');
      setLoading(false);
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/admin/staff" style={{ color: '#666', display: 'flex', alignItems: 'center', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}>
            <ArrowLeft size={18} />
          </Link>
          <h1 className={styles.pageTitle}>Add Staff Member</h1>
        </div>
      </div>

      <div className={styles.card} style={{ maxWidth: '800px' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: '500', color: '#374151' }}>Name *</label>
              <input 
                type="text" 
                required 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '1rem' }}
                placeholder="Ex. Swami Haridas"
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: '500', color: '#374151' }}>Role/Title *</label>
              <input 
                type="text" 
                required 
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value})}
                style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '1rem' }}
                placeholder="Ex. Chief Priest"
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '500', color: '#374151' }}>Bio / Description</label>
            <textarea 
              rows={4}
              value={formData.bio}
              onChange={e => setFormData({...formData, bio: e.target.value})}
              style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '1rem', fontFamily: 'inherit' }}
              placeholder="Short biography..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: '500', color: '#374151' }}>Email</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '1rem' }}
                placeholder="Optional"
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontWeight: '500', color: '#374151' }}>Phone</label>
              <input 
                type="text" 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '1rem' }}
                placeholder="Optional"
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
             <label style={{ fontWeight: '500', color: '#374151' }}>Display Order</label>
             <input 
               type="number" 
               value={formData.display_order}
               onChange={e => setFormData({...formData, display_order: parseInt(e.target.value) || 0})}
               style={{ padding: '0.75rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '1rem', width: '100px' }}
             />
             <span style={{ fontSize: '0.85rem', color: '#666' }}>Lower numbers appear first.</span>
          </div>

          {/* Image Upload */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontWeight: '500', color: '#374151' }}>Profile Image</label>
            <div style={{ border: '2px dashed #ddd', padding: '2rem', borderRadius: '6px', textAlign: 'center', cursor: 'pointer', position: 'relative' }}>
               <input 
                 type="file" 
                 accept="image/*"
                 onChange={handleImageChange}
                 style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
               />
               {previewUrl ? (
                   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                       <img src={previewUrl} alt="Preview" style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '50%', marginBottom: '1rem' }} />
                       <span style={{ color: '#2563eb' }}>Click to change</span>
                   </div>
               ) : (
                   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#666' }}>
                       <Upload size={32} style={{ marginBottom: '0.5rem', color: '#9ca3af' }} />
                       <span>Click or drag image to upload</span>
                   </div>
               )}
            </div>
          </div>

          <div style={{ borderTop: '1px solid #eee', paddingTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <Link href="/admin/staff" className="btn btn-secondary">Cancel</Link>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Save size={18} />
              {loading ? 'Saving...' : 'Save Staff Member'}
            </button>
          </div>

        </form>
      </div>

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
