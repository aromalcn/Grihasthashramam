import Link from 'next/link';
import styles from './About.module.css';

export default function About() {
  return (
    <section id="about" className={styles.section}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.textColumn}>
            <span className={styles.label}>Our Story</span>
            <h2 className={styles.heading}>A Temple Born From <br/> Eternal Vedic Wisdom</h2>
            <p className={styles.paragraph}>
              From time immemorial, divine wisdom has flowed unbroken through the lineage of Rishis, saints, and sages.
              Veda Kaveri Teerthashram is a manifestation of this ancient knowledge, designed to awaken the Kundalini Shakti within.
            </p>
            <p className={styles.paragraph}>
              Located in the serene hills of Coorg, our temple offers a sanctuary where nature and divinity merge into one sacred presence, guiding every seeker towards inner peace and realization.
            </p>
            <Link href="/about" className="btn btn-secondary">
              Read Our Story
            </Link>
          </div>
          <div className={styles.imageColumn}>
            <div className={styles.imagePlace} role="img" aria-label="Temple Architecture"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
