'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Modal from './Modal';

export default function LoginPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // If not logged in, show popup after 5 seconds
        timer = setTimeout(() => {
          setIsOpen(true);
        }, 5000);
      }
    };

    checkAuth();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={() => setIsOpen(false)} 
      title="Join Our Community"
      autoClose={true}
      duration={10000}
    >
      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <p style={{ marginBottom: '2rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
          Enhance your spiritual journey. Log in to access exclusive offerings, track your orders, and more.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <Link href="/login" className="btn btn-primary" style={{ flex: 1 }}>
            Login
          </Link>
          <Link href="/register" className="btn btn-secondary" style={{ flex: 1 }}>
            Sign Up
          </Link>
        </div>

        <button 
          onClick={() => setIsOpen(false)}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--color-text-muted)',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: '0.9rem',
            opacity: 0.8,
            transition: 'opacity 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.opacity = '1'}
          onMouseOut={(e) => e.currentTarget.style.opacity = '0.8'}
        >
          Continue as Guest
        </button>
      </div>
    </Modal>
  );
}
