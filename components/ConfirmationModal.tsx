'use client';
import { useEffect } from 'react';
import { AlertTriangle, HelpCircle } from 'lucide-react';
import styles from './ConfirmationModal.module.css';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
  autoClose?: boolean;
  duration?: number;
}

export default function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  isDanger = false,
  autoClose = false,
  duration = 5000
}: ConfirmationModalProps) {
  
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

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={`${styles.iconWrapper} ${isDanger ? styles.danger : styles.primary}`}>
          {isDanger ? <AlertTriangle size={32} /> : <HelpCircle size={32} />}
        </div>
        
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.message}>{message}</p>
        
        <div className={styles.actions}>
          <button className={`${styles.button} ${styles.cancelButton}`} onClick={onClose}>
            {cancelText}
          </button>
          <button 
            className={`${styles.button} ${styles.confirmButton} ${isDanger ? styles.danger : styles.primary}`} 
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
