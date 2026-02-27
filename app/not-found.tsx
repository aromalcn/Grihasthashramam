import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function NotFound() {
  return (
    <>
      <Header />
      <main style={{ 
        minHeight: '70vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
        marginTop: '80px' // Add spacing for fixed header
      }}>
        <h1 style={{ 
          fontSize: '4rem', 
          marginBottom: '1rem',
          fontFamily: 'var(--font-outfit)',
          color: 'var(--color-brown-deep)'
        }}>404</h1>
        <h2 style={{ 
          fontSize: '2rem', 
          marginBottom: '1.5rem',
          fontFamily: 'var(--font-outfit)',
          color: 'var(--color-text-main)'
        }}>Page Not Found</h2>
        <p style={{ 
          maxWidth: '600px', 
          marginBottom: '2rem',
          fontSize: '1.1rem',
          lineHeight: '1.6',
          color: 'var(--color-text-light)'
        }}>
          We couldn't find the page you were looking for. It might have been moved, deleted, or you may have mistyped the address.
        </p>
        <Link href="/" className="btn btn-primary" style={{
           display: 'inline-block',
           padding: '0.75rem 2rem',
           backgroundColor: 'var(--color-brown-deep)',
           color: '#fff',
           textDecoration: 'none',
           borderRadius: '8px',
           fontWeight: '600',
           transition: 'all 0.3s ease'
        }}>
          Return Home
        </Link>
      </main>
      <Footer />
    </>
  );
}
