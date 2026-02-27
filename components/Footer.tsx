import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.brand}>
            <h3>Veda Kaveri Teerthashram</h3>
            <p>
              A sacred space dedicated to the preservation of ancient Vedic wisdom and the awakening of inner consciousness.
            </p>
          </div>
          
          <div>
            <span className={styles.heading}>Quick Links</span>
            <ul className={styles.links}>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/#about">About Us</Link></li>
              <li><Link href="/visit-us">Visit Temple</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <span className={styles.heading}>Connect</span>
            <ul className={styles.links}>
              <li>info@srichakramahemerutemple.org</li>
              <li>+91 99466 30000</li>
              <li>Garvala, Kodagu, Karnataka</li>
            </ul>
          </div>
        </div>
        
        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} Veda Kaveri Teerthashram. All rights reserved.</p>
          <p>Designed with Devotion.</p>
        </div>
      </div>
    </footer>
  );
}
