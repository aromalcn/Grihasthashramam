import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MapPin, Phone, Mail, Plane, Train, Bus, Clock, Info } from "lucide-react";
import styles from "./visit.module.css";

export default function VisitPage() {
  return (
    <main>
      <Header />
      
      <div className={styles.hero}>
        <div className="container">
          <h1 className={styles.title}>Visit The Temple</h1>
          <p className={styles.subtitle}>
            Embark on a sacred journey to Veda Kaveri Teerthashram.
            Located amidst the serene hills of Coorg.
          </p>
        </div>
      </div>

      <section className={styles.mainContent}>
        <div className="container">
          <div className={styles.grid}>
            {/* Left Column: Location & Travel */}
            <div>
              <div className={styles.infoBlock}>
                <h2 className={styles.sectionTitle}>Location & Contact</h2>
                <address className={styles.address}>
                  <strong>Veda Kaveri Teerthashram</strong><br />
                  Garvala Village, Somwarpet Taluk,<br />
                  Kodagu (Coorg) District,<br />
                  Karnataka, India - 571251
                </address>

                <div className={styles.contactRow}>
                  <Phone size={20} className="text-red" />
                  <span>+91 99466 30000</span>
                </div>
                <div className={styles.contactRow}>
                  <Mail size={20} className="text-red" />
                  <span>info@srichakramahemerutemple.org</span>
                </div>
                
                <div className={styles.mapWrapper}>
                   <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15573.585502758277!2d75.875!3d12.585!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDM1JzEwLjAiTiA3NcKwNTInMzAuMCJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin" 
                    className={styles.mapFrame} 
                    loading="lazy"
                    title="Temple Location"
                  ></iframe>
                </div>
              </div>

              <div className={styles.infoBlock}>
                <h2 className={styles.sectionTitle}>How to Reach</h2>
                
                <div className={styles.travelMode}>
                  <h3 className={styles.travelTitle}><Plane size={20} /> By Air</h3>
                  <p className={styles.travelText}>
                    The nearest international airport is Kannur International Airport (CNN), approximately 90 km away. 
                    Mangalore International Airport (IXE) is about 140 km away.
                  </p>
                </div>

                <div className={styles.travelMode}>
                  <h3 className={styles.travelTitle}><Train size={20} /> By Train</h3>
                  <p className={styles.travelText}>
                    The nearest railway stations are Mysore (120 km), Hassan (80 km), and Mangalore (140 km). 
                    From there, one can take a taxi or bus.
                  </p>
                </div>

                <div className={styles.travelMode}>
                  <h3 className={styles.travelTitle}><Bus size={20} /> By Road</h3>
                  <p className={styles.travelText}>
                    Regular KSRTC buses operate from Bangalore, Mysore, and Mangalore to Somwarpet or Madikeri. 
                    From Somwarpet, local transport is available to Garvala.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Timings & Tips */}
            <aside>
              <div className={styles.sidebarBox}>
                <h3 className={styles.travelTitle}><Clock size={20} /> Temple Timings</h3>
                <ul className={styles.timingList}>
                  <li className={styles.timingItem}>
                    <span>Morning</span>
                    <span>6:00 AM - 1:00 PM</span>
                  </li>
                  <li className={styles.timingItem}>
                    <span>Evening</span>
                    <span>4:00 PM - 8:30 PM</span>
                  </li>
                </ul>
                <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
                  * Timings may change during festivals.
                </p>
              </div>

              <div className={styles.sidebarBox} style={{ backgroundColor: '#F5F5F5' }}>
                <h3 className={styles.travelTitle}><Info size={20} /> Visitor Guidelines</h3>
                <ul style={{ listStyle: 'disc', paddingLeft: '1.2rem', color: 'var(--color-text-muted)', lineHeight: '1.6' }}>
                  <li>Please wear modest traditional attire.</li>
                  <li>Maintain silence within the temple premises.</li>
                  <li>Photography is restricted in the inner sanctum.</li>
                  <li>Mobile phones should be kept on silent mode.</li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
