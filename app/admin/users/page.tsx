'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import styles from '../admin.module.css';
import { Search, User, Shield, ShieldOff, Trash2 } from 'lucide-react';
import ConfirmationModal from '@/components/ConfirmationModal';
import Modal from '@/components/Modal';

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  usertype: string;
  created_at: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal States
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; userId: string | null }>({
    isOpen: false,
    userId: null
  });
  
  const [promoteModal, setPromoteModal] = useState<{ 
    isOpen: boolean; 
    userId: string | null; 
    currentType: string | null;
    action: 'promote' | 'demote' | 'approve' | null; 
  }>({
    isOpen: false,
    userId: null,
    currentType: null,
    action: null
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

  useEffect(() => {
    const checkAccess = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('usertype')
                .eq('id', session.user.id)
                .single();
            
            if (profile?.usertype !== 'admin') {
                alert("Access Denied: Only Admins can manage users.");
                window.location.href = '/admin'; // Hard redirect to avoid rendering
                return;
            }
        }
        fetchUsers();
    };
    
    checkAccess();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const initToggleAdmin = (userId: string, currentType: string, isApproved: boolean) => {
    // If not approved, action is always 'approve'
    if (!isApproved) {
        setPromoteModal({
            isOpen: true,
            userId,
            currentType,
            action: 'approve'
        });
        return;
    }

    const newType = currentType === 'admin' ? 'user' : 'admin';
    const action = newType === 'admin' ? 'promote' : 'demote';
    
    setPromoteModal({
        isOpen: true,
        userId,
        currentType,
        action
    });
  };

  const confirmToggleAdmin = async () => {
    if (!promoteModal.userId) return;
    
    try {
      let updates: any = {};
      
      if (promoteModal.action === 'approve') {
          updates = { is_approved: true };
      } else {
        const newType = promoteModal.currentType === 'admin' ? 'user' : 'admin';
        updates = { usertype: newType };
      }
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', promoteModal.userId);

      if (error) throw error;
      
      // Update local state
      setUsers(users.map(u => {
          if (u.id !== promoteModal.userId) return u;
          if (promoteModal.action === 'approve') return { ...u, is_approved: true };
          const newType = promoteModal.currentType === 'admin' ? 'user' : 'admin';
          return { ...u, usertype: newType };
      }));
      
      showAlert('Success', promoteModal.action === 'approve' ? 'User approved.' : 'Role updated.', 'success');

    } catch (err) {
      console.error('Error updating user:', err);
      showAlert('Error', 'Failed to update user.', 'error');
    } finally {
        setPromoteModal({ isOpen: false, userId: null, currentType: null, action: null });
    }
  };

  const initDeleteUser = (userId: string) => {
    setDeleteModal({ isOpen: true, userId });
  };

  const confirmDeleteUser = async () => {
    if (!deleteModal.userId) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', deleteModal.userId);

      if (error) throw error;
      
      // Update local state
      setUsers(users.filter(u => u.id !== deleteModal.userId));
    } catch (err) {
      console.error('Error deleting user:', err);
      showAlert('Error', 'Failed to delete user.', 'error');
    } finally {
        setDeleteModal({ isOpen: false, userId: null });
    }
  };

  const filteredUsers = users.filter(u => 
    (u.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (u.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* ... (existing header) */}

      <div className={styles.card}>
        <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
          <input 
            type="text" 
            placeholder="Search users by name or email..." 
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
          <div>Loading users...</div>
        ) : (
          <div className={styles.tableContainer}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #eee' }}>
                  <th style={{ padding: '1rem', color: '#666' }}>User</th>
                  <th style={{ padding: '1rem', color: '#666' }}>Role</th>
                  <th style={{ padding: '1rem', color: '#666' }}>Status</th>
                  <th style={{ padding: '1rem', color: '#666' }}>Joined</th>
                  <th style={{ padding: '1rem', color: '#666', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ 
                          width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f3f4f6', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' 
                        }}>
                          <User size={16} />
                        </div>
                        <div>
                          <div style={{ fontWeight: '500' }}>{user.full_name || 'Unknown'}</div>
                          <div style={{ fontSize: '0.85rem', color: '#666' }}>{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem' }}>
                       {/* ... (existing role badge) */}
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '99px', 
                        backgroundColor: user.usertype === 'admin' ? '#e0e7ff' : '#f3f4f6',
                        color: user.usertype === 'admin' ? '#3730a3' : '#374151',
                        fontSize: '0.85rem',
                        fontWeight: '500',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}>
                        {user.usertype === 'admin' ? <Shield size={12} /> : null}
                        {user.usertype?.toUpperCase() || 'USER'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '99px', 
                        backgroundColor: (user as any).is_approved ? '#dcfce7' : '#fef9c3',
                        color: (user as any).is_approved ? '#166534' : '#854d0e',
                        fontSize: '0.75rem',
                        fontWeight: '600'
                      }}>
                        { (user as any).is_approved ? 'Active' : 'Pending' }
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: '#666' }}>
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      {!(user as any).is_approved ? (
                        <button 
                            onClick={() => initToggleAdmin(user.id, user.usertype || 'user', false)}
                            style={{ 
                              padding: '0.5rem 1rem', 
                              borderRadius: '4px', 
                              border: 'none', 
                              cursor: 'pointer',
                              backgroundColor: '#16a34a',
                              color: 'white',
                              marginRight: '0.5rem',
                              fontSize: '0.85rem'
                            }}
                          >
                            Approve
                          </button>
                      ) : (
                          <button 
                            onClick={() => initToggleAdmin(user.id, user.usertype || 'user', true)}
                            title={user.usertype === 'admin' ? "Remove Admin Access" : "Grant Admin Access"}
                            style={{ 
                              padding: '0.5rem', 
                              borderRadius: '4px', 
                              border: 'none', 
                              cursor: 'pointer',
                              backgroundColor: user.usertype === 'admin' ? '#fff1f2' : '#f0fdf4',
                              color: user.usertype === 'admin' ? '#be123c' : '#15803d',
                              marginRight: '0.5rem'
                            }}
                          >
                            {user.usertype === 'admin' ? <ShieldOff size={18} /> : <Shield size={18} />}
                          </button>
                      )}
                      <button 
                        onClick={() => initDeleteUser(user.id)}
                        title="Delete User"
                        style={{ 
                          padding: '0.5rem', 
                          borderRadius: '4px', 
                          border: 'none', 
                          cursor: 'pointer',
                          backgroundColor: '#fef2f2',
                          color: '#dc2626'
                        }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>No users found.</td>
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
        onConfirm={confirmDeleteUser}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete User"
        isDanger={true}
      />

      {/* Promote/Demote/Approve Confirmation Modal */}
      <ConfirmationModal
        isOpen={promoteModal.isOpen}
        onClose={() => setPromoteModal({ ...promoteModal, isOpen: false })}
        onConfirm={confirmToggleAdmin}
        title={
            promoteModal.action === 'approve' ? "Approve User" :
            promoteModal.action === 'promote' ? "Grant Admin Access" : "Remove Admin Access"
        }
        message={
            promoteModal.action === 'approve'
                ? "Are you sure you want to approve this user? They will be able to log in."
                : promoteModal.action === 'promote' 
                    ? "Are you sure you want to promote this user to Admin? They will have full access to the dashboard." 
                    : "Are you sure you want to remove Admin access from this user?"
        }
        confirmText={
            promoteModal.action === 'approve' ? "Approve" :
            promoteModal.action === 'promote' ? "Grant Access" : "Remove Access"
        }
        isDanger={promoteModal.action === 'demote'}
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
