'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, ShoppingBag, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import styles from './Header.module.css';
import { supabase } from '@/lib/supabase';
import Modal from './Modal';

interface HeaderProps {
  transparent?: boolean;
}

export default function Header({ transparent = false }: HeaderProps) {
  const { cartCount } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    // Check immediately on mount
    handleScroll();
    window.addEventListener('scroll', handleScroll);

    let mounted = true;

    const initAuth = async () => {
      try {
        // Safety timeout in case Supabase hangs
        const timeoutPromise = new Promise(resolve => setTimeout(resolve, 3000));
        const sessionPromise = supabase.auth.getSession();
        
        const result: any = await Promise.race([sessionPromise, timeoutPromise]);
        
        if (!result) {
          // Timeout occurred
          console.warn('Auth check timed out');
        } else if (result.data) {
          const { session: currentSession } = result.data;
          
          if (mounted) {
            setSession(currentSession);
            if (currentSession) {
              const { data: profile } = await supabase
                .from('profiles')
                .select('usertype')
                .eq('id', currentSession.user.id)
                .single();
              
              if (mounted) {
                setIsAdmin(profile?.usertype === 'admin');
              }
            }
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event: any, session: any) => {
      if (mounted) {
        setSession(session);
        if (session) {
           const { data: profile } = await supabase
            .from('profiles')
            .select('usertype')
            .eq('id', session.user.id)
            .single();
           setIsAdmin(profile?.usertype === 'admin');
        } else {
           setIsAdmin(false);
        }
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      window.removeEventListener('scroll', handleScroll);
      subscription.unsubscribe();
    };
  }, []); 

  const headerClass = scrolled || !transparent ? styles.headerScrolled : '';

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    router.push('/');
    router.refresh();
  };

  return (
    <>
    <header className={`${styles.header} ${headerClass}`}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          <img 
            src="/logo.png" 
            alt="Grihasthashramam Logo" 
            style={{ 
              height: '50px', 
              width: 'auto',
              filter: scrolled || !transparent ? 'none' : 'brightness(0) invert(1)'
            }} 
          />
        </Link>
        
        <nav className={styles.navLinks}>
          <Link href="/" className={styles.navLink}>Home</Link>
          <Link href="/#about" className={styles.navLink}>About</Link>
          <Link href="/#offerings" className={styles.navLink}>Offerings</Link>
          <Link href="/visit-us" className={styles.navLink}>Visit</Link>
          <Link href="/contact" className={styles.navLink}>Contact</Link>
          
          <Link href="/cart" className={styles.navLink} style={{ display: 'flex', alignItems: 'center' }}>
            <ShoppingBag size={18} style={{ marginRight: '0.25rem' }} />
            Cart ({cartCount})
          </Link>
          
          {session && (pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin')) && (
            <>
              {isAdmin && (
                <Link href="/admin" className={styles.navLink} style={{ color: 'var(--color-brown-deep)', fontWeight: 'bold' }}>Admin Panel</Link>
              )}
              <Link href="/dashboard" className={styles.navLink}>Dashboard</Link>
              <button onClick={handleSignOut} className={styles.navLink} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}>
                Logout
              </button>
            </>
          )}

          <button 
            onClick={() => setShowDonateModal(true)}
            className={`btn ${scrolled || !transparent ? 'btn-primary' : 'btn-primary'}`} 
            style={{ 
              marginLeft: '0.5rem', 
              backgroundColor: scrolled || !transparent ? 'var(--color-brown-deep)' : 'var(--color-green-primary)', 
              borderColor: 'transparent',
              cursor: 'pointer'
            }}
          >
            Donate
          </button>
        </nav>

        {/* Mobile Login Button */}
        {!session && !['/login', '/register'].includes(pathname) && (
          <Link href="/login" className={styles.mobileLoginButton} style={{ marginLeft: 'auto' }}>
            <User size={24} color={scrolled || !transparent ? 'var(--color-text-main)' : 'white'} />
          </Link>
        )}

        <Link href="/cart" className={styles.mobileStoreButton} style={{ position: 'relative', marginLeft: !session ? '0' : 'auto' }}>
          <ShoppingBag size={24} color={scrolled || !transparent ? 'var(--color-text-main)' : 'white'} />
        </Link>

        {/* Mobile Menu Button */}
        <button 
          className={`${styles.menuButton} ${transparent && !scrolled && !isMobileMenuOpen ? styles.menuButtonDark : ''}`}
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu size={24} color={scrolled || !transparent ? 'var(--color-text-main)' : 'white'} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`${styles.mobileMenuOverlay} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
        <button className={styles.closeButton} onClick={() => setIsMobileMenuOpen(false)}>
          <X size={32} />
        </button>
        
        <nav className={styles.mobileNavLinks}>
          <Link href="/" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link href="/#about" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>About</Link>
          <Link href="/#offerings" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Offerings</Link>
          <Link href="/visit-us" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Visit</Link>
          <Link href="/contact" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
          
          {session && (pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin')) && (
            <>
              <Link href="/dashboard" className={styles.mobileNavLink} onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
              <button 
                onClick={() => {
                  handleSignOut();
                  setIsMobileMenuOpen(false);
                }} 
                className={styles.mobileNavLink} 
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Logout
              </button>
            </>
          )}

          <button 
            onClick={() => {
              setShowDonateModal(true);
              setIsMobileMenuOpen(false);
            }}
            className="btn btn-primary"
            style={{ 
              marginTop: '1rem',
              backgroundColor: 'var(--color-white)', 
              color: 'var(--color-brown-deep)',
              border: 'none',
              width: '200px'
            }}
          >
            Donate
          </button>
        </nav>
      </div>

      <Modal
        isOpen={showDonateModal}
        onClose={() => setShowDonateModal(false)}
        title="Coming Soon"
        message="Online donations are coming soon! Thank you for your support."
        autoClose={true}
        duration={3000}
      />
    </header>
    <Link href="/store" className={styles.floatingStoreButton}>
      <ShoppingBag size={24} style={{ marginRight: '0.5rem' }} />
      Store
    </Link>

    {!session && !['/login', '/register'].includes(pathname) && (
      <Link href="/login" className={styles.floatingLoginButton}>
        <User size={24} style={{ marginRight: '0.5rem' }} />
        Login
      </Link>
    )}
    </>
  );
}
