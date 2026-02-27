'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { LayoutDashboard, Package, ShoppingCart, LogOut, ArrowLeft, Users } from 'lucide-react';
import styles from './admin.module.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);


  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login?redirect=/admin');
        return;
      }

      // Check user role from database
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('usertype')
        .eq('id', session.user.id)
        .single();
      
      if (error || profile?.usertype !== 'admin') {
        alert("Access Denied: You do not have admin privileges.");
        router.push('/');
        return;
      }

      setAuthorized(true);
      setLoading(false);
    };

    checkAuth();
  }, [router]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
      setSidebarOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Verifying Admin Access...</div>;
  }

  if (!authorized) return null;

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Products', href: '/admin/products', icon: <Package size={20} /> },
    { name: 'Orders', href: '/admin/orders', icon: <ShoppingCart size={20} /> },
    { name: 'Users', href: '/admin/users', icon: <Users size={20} /> },
  ];

  return (
    <div className={styles.adminContainer}>
      {/* Mobile Header */}
      <div className={styles.mobileHeader}>
          <button className={styles.menuBtn} onClick={() => setSidebarOpen(true)}>
              <LayoutDashboard size={24} />
          </button>
          <span style={{ fontWeight: 'bold' }}>Admin Panel</span>
          <div style={{ width: 24 }}></div> {/* Spacer for center alignment */}
      </div>

      {/* Overlay */}
      <div 
        className={`${styles.overlay} ${sidebarOpen ? styles.overlayOpen : ''}`} 
        onClick={() => setSidebarOpen(false)}
      ></div>

      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.brand}>Admin Panel</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '0.25rem' }}>Grihasthashramam</div>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
          <Link href="/" className={styles.navLink}>
             <ArrowLeft size={20} />
             <span>View Site</span>
          </Link>
          <button 
            onClick={handleSignOut}
            className={styles.navLink} 
            style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '1rem', fontFamily: 'inherit' }}
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
