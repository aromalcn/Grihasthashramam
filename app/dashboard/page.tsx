'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Modal from '@/components/Modal';
import styles from './dashboard.module.css';
import { supabase } from '@/lib/supabase';

interface Profile {
  full_name: string | null;
  email: string | null;
}

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);

  // Modal States
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Form States
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
          router.push('/login');
          return;
        }

        // Fetch Profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', session.user.id)
          .single();

        setProfile({
            full_name: profileData?.full_name || session.user.user_metadata.full_name || 'User',
            email: session.user.email || '',
        });
        
        // Pre-fill name for editing
        if (profileData?.full_name) setNewName(profileData.full_name);

        // Fetch Orders
        const { data: ordersData, error: ordersError } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false });
        
        if (ordersData) {
            setOrders(ordersData);
        }

      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user found');

        // Update profile (name)
        const { error: profileError } = await supabase
            .from('profiles')
            .update({ 
                full_name: newName
            })
            .eq('id', user.id);

        if (profileError) throw profileError;

        // Update local state
        setProfile(prev => prev ? ({ ...prev, full_name: newName }) : null);
        
        setShowEditProfile(false);
        setSuccessMessage('Your profile has been updated.');
        setShowSuccess(true);
    } catch (err) {
        console.error('Update failed:', err);
        alert('Failed to update profile.');
    } finally {
        setActionLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }
    if (newPassword.length < 6) {
        alert("Password must be at least 6 characters.");
        return;
    }

    setActionLoading(true);
    try {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;

        setShowChangePassword(false);
        setSuccessMessage('Your password has been changed securely.');
        setShowSuccess(true);
        setNewPassword('');
        setConfirmPassword('');
    } catch (err) {
        console.error('Password reset failed:', err);
        alert('Failed to update password.');
    } finally {
        setActionLoading(false);
    }
  };



  if (loading) {
    return (
      <main>
        <Header />
        <div className={styles.loading}>Loading Dashboard...</div>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Header />
      <div className={styles.container}>
        <div className={styles.dashboardGrid}>
          
          {/* Left Sidebar: Profile */}
          <div className={styles.profileCard}>
            <h2 className={styles.welcomeHeading}>Welcome, {profile?.full_name?.split(' ')[0]}</h2>
            
            <div className={styles.infoGroup}>
              <span className={styles.label}>Full Name</span>
              <div className={styles.value}>{profile?.full_name}</div>
            </div>

            <div className={styles.infoGroup}>
              <span className={styles.label}>Email Address</span>
              <div className={styles.value}>{profile?.email}</div>
            </div>

            <div className={styles.actions}>
                <button onClick={() => {
                    if (profile) {
                        setNewName(profile.full_name || '');
                    }
                    setShowEditProfile(true);
                }} className={styles.actionBtn}>
                    Edit Profile
                </button>
                <button onClick={() => setShowChangePassword(true)} className={styles.actionBtn}>
                    Change Password
                </button>

            </div>
          </div>

          {/* Right Content: Orders & Activity */}
          <div className={styles.mainContent}>
            <div className={styles.sectionCard}>
                <h3 className={styles.sectionTitle}>Order History</h3>
                
                {orders.length > 0 ? (
                    <div className={styles.ordersList}>
                        {orders.map((order) => (
                            <div key={order.id} className={styles.orderItem} style={{ 
                                padding: '1rem', 
                                borderBottom: '1px solid #eee',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <h4 style={{ color: 'var(--color-brown-deep)', marginBottom: '0.25rem' }}>{order.product_name}</h4>
                                    <span style={{ fontSize: '0.85rem', color: '#888' }}>
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 'bold', color: 'var(--color-text-main)' }}>₹{order.total_price.toLocaleString()}</div>
                                    <span style={{ 
                                        fontSize: '0.75rem', 
                                        padding: '0.2rem 0.5rem', 
                                        borderRadius: '4px', 
                                        backgroundColor: 'var(--color-green-light)', 
                                        color: 'var(--color-green-primary)',
                                        textTransform: 'capitalize' 
                                    }}>{order.status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <p className={styles.emptyText}>You haven&apos;t placed any orders yet.</p>
                        <button onClick={() => router.push('/store')} className={styles.shopLink}>
                            Browse Store
                        </button>
                    </div>
                )}
            </div>
          </div>

        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        title="Edit Profile"
      >
        <form onSubmit={handleUpdateProfile} style={{ marginTop: '1rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#666' }}>Full Name</label>
                <input 
                    type="text" 
                    value={newName} 
                    onChange={(e) => setNewName(e.target.value)}
                    required
                    style={{ 
                        width: '100%', 
                        padding: '0.75rem', 
                        borderRadius: '4px', 
                        border: '1px solid #ddd',
                        fontSize: '1rem'
                    }}
                />
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                    type="button"
                    onClick={() => setShowEditProfile(false)}
                    style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Cancel
                </button>
                <button 
                    type="submit"
                    disabled={actionLoading}
                    style={{ flex: 1, padding: '0.75rem', background: 'var(--color-brown-deep)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    {actionLoading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        isOpen={showChangePassword}
        onClose={() => setShowChangePassword(false)}
        title="Change Password"
      >
        <form onSubmit={handleChangePassword} style={{ marginTop: '1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#666' }}>New Password</label>
                <input 
                    type="password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    style={{ 
                        width: '100%', 
                        padding: '0.75rem', 
                        borderRadius: '4px', 
                        border: '1px solid #ddd',
                        fontSize: '1rem'
                    }}
                />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#666' }}>Confirm Password</label>
                <input 
                    type="password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    style={{ 
                        width: '100%', 
                        padding: '0.75rem', 
                        borderRadius: '4px', 
                        border: '1px solid #ddd',
                        fontSize: '1rem'
                    }}
                />
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                    type="button"
                    onClick={() => setShowChangePassword(false)}
                    style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Cancel
                </button>
                <button 
                    type="submit"
                    disabled={actionLoading}
                    style={{ flex: 1, padding: '0.75rem', background: 'var(--color-brown-deep)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    {actionLoading ? 'Updating...' : 'Update Password'}
                </button>
            </div>
        </form>
      </Modal>

      {/* Success Modal */}
      <Modal 
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Success"
        message={successMessage}
      />

      <Footer />
    </main>
  );
}
