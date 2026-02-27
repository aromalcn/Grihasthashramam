import Link from 'next/link';
import Image from 'next/image';
import styles from './Hero.module.css';
import ProductActions from './ProductActions';
import { products } from '@/data/products';

export default function Hero() {
  // Select a specific product to feature, e.g., the first one '5 Mukhi Rudraksha Mala' or any other
  const featuredProduct = products[0]; 

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <span className={styles.subtitle}>Featured Offering</span>
          <h1 className={styles.title}>
            {featuredProduct.name}
          </h1>
          <p className={styles.description}>
            {featuredProduct.description}
          </p>
          
          <div className={styles.actions}>
             <div style={{ marginTop: '1rem' }}>
                <Link href="/visit-us" className="btn btn-text" style={{ textDecoration: 'underline', color: 'var(--color-text-muted)' }}>
                  Plan Your Visit Instead
                </Link>
             </div>
          </div>
        </div>
        
        <div className={styles.heroImageWrapper}>
           <div className={styles.imageContainer}>
             <Image
               src={featuredProduct.image}
               alt={featuredProduct.name}
               width={600}
               height={600}
               className={styles.rudrakshaImage} 
               priority
             />
           </div>
           <div className={styles.imageActions}>
              <div className={styles.productInfo}>
                <h3 className={styles.productName}>{featuredProduct.name}</h3>
                <p className={styles.productPrice}>₹{featuredProduct.price.toLocaleString()}</p>
              </div>
              <ProductActions 
                product={featuredProduct} 
                buttonStyle={{ minWidth: '120px' }} 
                wrapperStyle={{ justifyContent: 'center' }}
              />
           </div>
        </div>
      </div>
    </section>
  );
}
