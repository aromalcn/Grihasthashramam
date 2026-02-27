'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Modal from '@/components/Modal';
import styles from './register.module.css';
import { supabase } from '@/lib/supabase';
import { Eye, EyeOff, User, Briefcase } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    usertype: 'user'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
       const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            full_name: formData.name.trim(),
            usertype: formData.usertype,
          },
        },
      });

      if (error) {
        throw error;
      }

       // Success! Show modal
       setShowSuccessModal(true);
       
    } catch (err: any) {
      console.error('Registration error:', err);
      // Show detailed error if available, specifically for 400s
      const detailedError = err.message || JSON.stringify(err);
      setError(detailedError);
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    router.push('/login');
  };

  return (
    <main>
      <Header />
      <div className={styles.container}>
        <div className={styles.card}>
          <h1 className={styles.title}>Create Account</h1>
          
          {error && <div style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}

          <form className={styles.form} onSubmit={handleRegister}>
            <div className={styles.inputGroup}>
              <label htmlFor="name" className={styles.label}>Full Name</label>
              <input 
                type="text" 
                id="name" 
                className={styles.input} 
                placeholder="Enter your full name" 
                required 
                value={formData.name}
                onChange={handleChange}
              />
            </div>

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
                  placeholder="Create a password" 
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



            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
              <div className={styles.passwordWrapper}>
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword" 
                  className={styles.input} 
                  placeholder="Confirm your password" 
                  required 
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button 
                  type="button"
                  className={styles.toggleButton}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Choose Role</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
                
                <div 
                  onClick={() => setFormData({...formData, usertype: 'user'})}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: formData.usertype === 'user' ? '2px solid var(--color-brown-deep)' : '1px solid #e5e7eb',
                    backgroundColor: formData.usertype === 'user' ? '#fffbf0' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <User size={24} color={formData.usertype === 'user' ? 'var(--color-brown-deep)' : '#9ca3af'} />
                  <span style={{ 
                    fontWeight: '500', 
                    color: formData.usertype === 'user' ? 'var(--color-brown-deep)' : '#4b5563' 
                  }}>User</span>
                  <input 
                    type="radio" 
                    name="usertype" 
                    value="user" 
                    checked={formData.usertype === 'user'} 
                    onChange={() => {}} // Handled by div click
                    style={{ display: 'none' }}
                  />
                </div>

                <div 
                  onClick={() => setFormData({...formData, usertype: 'staff'})}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: formData.usertype === 'staff' ? '2px solid var(--color-brown-deep)' : '1px solid #e5e7eb',
                    backgroundColor: formData.usertype === 'staff' ? '#fffbf0' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Briefcase size={24} color={formData.usertype === 'staff' ? 'var(--color-brown-deep)' : '#9ca3af'} />
                  <span style={{ 
                    fontWeight: '500', 
                    color: formData.usertype === 'staff' ? 'var(--color-brown-deep)' : '#4b5563' 
                  }}>Staff</span>
                  <input 
                    type="radio" 
                    name="usertype" 
                    value="staff" 
                    checked={formData.usertype === 'staff'} 
                    onChange={() => {}} // Handled by div click
                    style={{ display: 'none' }}
                  />
                </div>

              </div>
            </div>

            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <div className={styles.footer}>
            <p>Already have an account? <Link href="/login" className={styles.link}>Login Here</Link></p>
          </div>
        </div>
      </div>
      
      <Modal 
        isOpen={showSuccessModal} 
        onClose={handleModalClose}
        title="Registration Successful!"
        message="Your account has been created. Please sign in to continue."
      />

      <Footer />
    </main>
  );
}
