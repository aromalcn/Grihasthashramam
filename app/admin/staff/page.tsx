'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import styles from '../admin.module.css';
import ConfirmationModal from '@/components/ConfirmationModal';
import Modal from '@/components/Modal';

interface StaffMember {
  id: string;
  name: string;
  role: string;
  image_url: string;
  display_order: number;
}

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal States
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; staffId: string | null }>({
    isOpen: false,
    staffId: null
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

  const fetchStaff = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .order('display_order', { ascending: true });
    
    if (data) setStaff(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const initDeleteStaff = (id: string) => {
    setDeleteModal({ isOpen: true, staffId: id });
  };

  const confirmDeleteStaff = async () => {
    if (!deleteModal.staffId) return;

    try {
      const { error } = await supabase.from('staff').delete().eq('id', deleteModal.staffId);
      if (error) throw error;
      setStaff(staff.filter(s => s.id !== deleteModal.staffId));
      showAlert('Success', 'Staff member removed successfully', 'success');
    } catch (err) {
      console.error('Error deleting staff:', err);
      showAlert('Error', 'Failed to remove staff member.', 'error');
    } finally {
        setDeleteModal({ isOpen: false, staffId: null });
    }
  };

  const filteredStaff = staff.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Staff Management</h1>
        <Link href="/admin/staff/new" className="btn" style={{ 
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
          Add Staff
        </Link>
      </div>

      <div className={styles.card}>
        <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
          <input 
            type="text" 
            placeholder="Search staff by name or role..." 
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
          <div>Loading staff...</div>
        ) : (
          <div className={styles.tableContainer}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #eee' }}>
                  <th style={{ padding: '1rem', color: '#666' }}>Image</th>
                  <th style={{ padding: '1rem', color: '#666' }}>Name</th>
                  <th style={{ padding: '1rem', color: '#666' }}>Role</th>
                  <th style={{ padding: '1rem', color: '#666' }}>Order</th>
                  <th style={{ padding: '1rem', color: '#666', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map(member => (
                  <tr key={member.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ 
                        width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#f3f4f6', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                          {member.image_url ? (
                              <img src={member.image_url} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                              <Users size={20} color="#9ca3af" />
                          )}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', fontWeight: '500' }}>{member.name}</td>
                    <td style={{ padding: '1rem', color: '#666' }}>{member.role}</td>
                    <td style={{ padding: '1rem', color: '#666' }}>{member.display_order}</td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <Link href={`/admin/staff/${member.id}`} style={{ padding: '0.5rem', color: '#2563eb', backgroundColor: '#eff6ff', borderRadius: '4px' }}>
                          <Edit size={18} />
                        </Link>
                        <button 
                          onClick={() => initDeleteStaff(member.id)}
                          style={{ padding: '0.5rem', color: '#dc2626', backgroundColor: '#fef2f2', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredStaff.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>No staff members found.</td>
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
        onConfirm={confirmDeleteStaff}
        title="Remove Staff Member"
        message="Are you sure you want to remove this staff member? This action cannot be undone."
        confirmText="Remove"
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
