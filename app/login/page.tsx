'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Modal from '@/components/Modal';
import styles from './login.module.css';
import { supabase } from '@/lib/supabase';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'success'
  });

  const handleRedirect = async (userId: string) => {
    try {
      console.log('[LOGIN] Starting redirect for user:', userId);
      
      // Fetch user profile with explicit column selection
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, email, usertype, is_approved')
        .eq('id', userId)
        .single();

      console.log('[LOGIN] Profile fetch result:', { profile, error });

      // If we can't fetch the profile, log it but don't block.
      // We'll assume they are a standard user for now to allow access.
      let finalUserType = 'user';
      let finalIsApproved = true;

      if (error || !profile) {
        console.warn('[LOGIN] Failed to fetch profile - Defaulting to USER role', error);
        // Optional: Try to retrieve user type from metadata if available, or just stick to 'user'
      } else {
        finalUserType = profile.usertype;
        finalIsApproved = profile.is_approved;
      }

      console.log('[LOGIN] User type:', finalUserType, '| Approved:', finalIsApproved);

      // ADMIN - Full access
      if (finalUserType === 'admin') {
        console.log('[LOGIN] ✓ Admin verified - Redirecting to /admin');
        router.push('/admin');
        router.refresh();
        return;
      }

      // STAFF - Must be approved
      if (finalUserType === 'staff') {
        if (finalIsApproved !== true) {
          console.warn('[LOGIN] ✗ Staff NOT approved - BLOCKING');
          await supabase.auth.signOut();
          setLoading(false);
          setModalState({
            isOpen: true,
            title: 'Account Pending Approval',
            message: 'Your staff account is awaiting admin approval. You will receive access once approved.',
            type: 'error'
          });
          return;
        }

        console.log('[LOGIN] ✓ Staff approved - Redirecting to /staff');
        router.push('/staff');
        router.refresh();
        return;
      }

      // USER - Standard access (default fallback)
      console.log('[LOGIN] ✓ User/Default verified - Redirecting to /dashboard');
      router.push('/dashboard');
      router.refresh();
      return;

    } catch (err) {
      console.error('[LOGIN] Redirect error:', err);
      // Even on error, try to let them in if we have a session? 
      // But if we are here, something big crashed. 
      // safer to show error, but user said "dont need to verify".
      // Let's stick to showing error for unexpected exceptions to avoid loops.
      await supabase.auth.signOut();
      setLoading(false);
      setError('Login failed. Please try again.');
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setConnectionStatus('connected');
        
        // If already logged in, redirect
        if (session) {
          await handleRedirect(session.user.id);
        }
      } catch (err: any) {
        console.error('[LOGIN] Connection check failed:', err);
        setConnectionStatus('error');
      }
    };
    
    checkConnection();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      console.log('[LOGIN] Attempting login for:', formData.email);
      
      // Add timeout to prevent infinite hang
      const authPromise = supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password,
      });

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Authentication timeout - Supabase may be unreachable')), 10000);
      });

      const { data, error } = await Promise.race([authPromise, timeoutPromise]) as any;

      console.log('[LOGIN] Auth response:', { data: data?.user?.id, error: error?.message });

      if (error) {
        console.error('[LOGIN] Auth error:', error);
        throw error;
      }

      if (!data?.user?.id) {
        console.error('[LOGIN] No user ID in response');
        throw new Error('No user ID returned from authentication');
      }

      console.log('[LOGIN] Authentication successful, user ID:', data.user.id);
      
      // Redirect based on user type and approval status
      console.log('[LOGIN] Calling handleRedirect...');
      await handleRedirect(data.user.id);
      console.log('[LOGIN] handleRedirect completed');
      
    } catch (err: any) {
      console.error('[LOGIN] Login failed with error:', err);
      setError(err.message || 'Invalid email or password');
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setModalState({ ...modalState, isOpen: false });
  };

  return (
    <main>
      <Header />
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Login</h1>
          
          {connectionStatus === 'error' && (
            <div style={{ padding: '1rem', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem' }}>
              <strong>Connection Error:</strong> Unable to connect to authentication server. 
              <br/>Please check:
              <ul style={{ paddingLeft: '1.2rem', marginTop: '0.5rem' }}>
                <li>Internet connection</li>
                <li>Supabase Project status (is it paused?)</li>
                <li>Environment variables (.env.local)</li>
              </ul>
            </div>
          )}

          {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}

          <form className={styles.form} onSubmit={handleLogin}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>Email Address</label>
              <input 
                type="email" 
                id="email" 
                className={styles.input} 
                placeholder="Enter your email" 
                required 
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <div className={styles.passwordWrapper}>
                <input 
                  type={showPassword ? "text" : "password"}
                  id="password" 
                  className={styles.input} 
                  placeholder="Enter your password" 
                  required 
                  value={formData.password}
                  onChange={handleChange}
                />
                <button 
                  type="button"
                  className={styles.toggleButton}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className={styles.footer}>
            <p>Don&apos;t have an account? <Link href="/register" className={styles.link}>Register Here</Link></p>
          </div>
        </div>
      </div>
      
      <Modal 
        isOpen={modalState.isOpen} 
        onClose={handleModalClose}
        title={modalState.title}
        message={modalState.message}
        alertType={modalState.type === 'error' ? 'error' : 'success'}
      />

      <Footer />
    </main>
  );
}
