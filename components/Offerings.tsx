import { Gem, Flame, Flower } from 'lucide-react';
import styles from './Offerings.module.css';

const offerings = [
  {
    icon: <Gem size={32} />,
    title: "Sree Chakra Darshan",
    desc: "Experience the powerful presence of the world’s largest Panchaloha Sree Chakra Maha Meru, radiating divine energy."
  },
  {
    icon: <Flower size={32} />,
    title: "Meditation & Sadhana",
    desc: "Guided spiritual practices rooted in ancient Vedic wisdom to awaken peace, clarity, and inner consciousness."
  },
  {
    icon: <Flame size={32} />,
    title: "Vedic Rituals & Homas",
    desc: "Sacred pujas and homas performed to invoke blessings, harmony, and spiritual protection for all devotees."
  }
];

export default function Offerings() {
  return (
    <section id="offerings" className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <span className={styles.subheading}>Divine Offerings</span>
          <h2>Experiences That Elevate the Soul</h2>
        </div>
        
        <div className={styles.grid}>
          {offerings.map((item, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.iconWrapper}>
                {item.icon}
              </div>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardText}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
