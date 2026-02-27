'use client';
import { Check } from 'lucide-react';
import styles from './Modal.module.css';
import { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  children?: React.ReactNode;
  alertType?: 'success' | 'error' | 'info';
  autoClose?: boolean;
  duration?: number;
}

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  children, 
  alertType = 'success',
  autoClose = false,
  duration = 3000
}: ModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    let timer: NodeJS.Timeout;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);

      if (autoClose) {
        timer = setTimeout(() => {
          onClose();
        }, duration);
      }
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
      if (timer) clearTimeout(timer);
    };
  }, [isOpen, onClose, autoClose, duration]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (alertType) {
        case 'error': return <div className={`${styles.iconWrapper} ${styles.error}`}><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg></div>;
        case 'info': return <div className={`${styles.iconWrapper} ${styles.info}`}><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></div>;
        default: return <div className={styles.iconWrapper}><Check size={32} /></div>;
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {!children && getIcon()}
        <h3 className={styles.title}>{title}</h3>
        {message && <p className={styles.message}>{message}</p>}
        
        {children}

        {!children && (
            <button className={`${styles.closeButton} ${alertType === 'error' ? styles.errorBtn : ''}`} onClick={onClose}>
            {alertType === 'error' ? 'Close' : 'Continue'}
            </button>
        )}
      </div>
    </div>
  );
}
