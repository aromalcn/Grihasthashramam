'use client';
/* eslint-disable @next/next/no-img-element */
import { Product } from '@/data/products';
import styles from './ProductCard.module.css';
import ProductActions from './ProductActions';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img 
          src={product.image} 
          alt={product.name} 
          className={styles.image}
        />
      </div>
      <div className={styles.content}>
        <span className={styles.category}>{product.category}</span>
        <h3 className={styles.title}>{product.name}</h3>
        <span className={styles.price}>₹{product.price.toLocaleString()}</span>
        
        <ProductActions 
          product={product} 
          buttonStyle={{ flex: 1, padding: '0.5rem 1rem', fontSize: '0.9rem' }} 
        />
      </div>
    </div>
  );
}
