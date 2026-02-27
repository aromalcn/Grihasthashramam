'use client';

import { useCart } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import styles from './cart.module.css';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    
    // Check auth
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push('/login?redirect=/cart');
      return;
    }

    // Simulate order creation for each item
    // In a real app, you'd likely create one order with multiple line items
    for (const item of cartItems) {
      const { error } = await supabase
        .from('orders')
        .insert({
            user_id: user.id,
            product_id: item.id,
            product_name: item.name,
            total_price: item.price * item.quantity,
            quantity: item.quantity,
            status: 'paid' 
        });

      if (error) {
        console.error('Error creating order:', error.message);
        console.error('Error details:', error.details);
        console.error('Error hint:', error.hint);
        alert('Failed to place order. Please try again.');
        setLoading(false);
        return;
      }
    }

    clearCart();
    router.push('/dashboard');
  };

  return (
    <main>
      <Header />
      
      <div className={styles.pageHeader}>
        <div className={styles.container}>
          <h1 className={styles.title}>Your Cart</h1>
          <p className={styles.subtitle}>Review your items before checkout</p>
        </div>
      </div>

      <section className={styles.cartSection}>
        <div className={styles.container}>
          {cartItems.length === 0 ? (
            <div className={styles.emptyState}>
              <h2>Your Cart is Currently Empty</h2>
              <p style={{ margin: '1rem 0' }}>Explore our sacred offerings to find what you are looking for.</p>
              <Link href="/store" className="btn btn-primary">
                Return to Store
              </Link>
            </div>
          ) : (
            <div className={styles.grid}>
              <div>
                {cartItems.map((item) => (
                  <div key={item.id} className={styles.itemCard}>
                    <img src={item.image} alt={item.name} className={styles.itemImage} />
                    <div className={styles.itemDetails}>
                      <span className={styles.itemName}>{item.name}</span>
                      <span className={styles.itemPrice}>₹{item.price.toLocaleString()}</span>
                    </div>
                    <div className={styles.quantityControls}>
                      <button 
                        className={styles.quantityBtn}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus size={16} />
                      </button>
                      <span className={styles.quantity}>{item.quantity}</span>
                      <button 
                        className={styles.quantityBtn}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button 
                      className={styles.removeBtn}
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className={styles.summary}>
                <h3 className={styles.summaryTitle}>Order Summary</h3>
                <div className={styles.summaryRow}>
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className={styles.totalRow}>
                  <span>Total</span>
                  <span>₹{cartTotal.toLocaleString()}</span>
                </div>
                <button 
                  className="btn btn-primary" 
                  style={{ width: '100%', marginTop: '1.5rem' }}
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Proceed to Checkout'}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
