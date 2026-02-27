'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Modal from '@/components/Modal';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';

interface ProductActionsProps {
  product: Product;
  buttonStyle?: React.CSSProperties;
  wrapperStyle?: React.CSSProperties;
}

export default function ProductActions({ product, buttonStyle, wrapperStyle }: ProductActionsProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  // Auto-close handled by Modal component now
  
  const handleBuyNow = async () => {
    setLoading(true);
    // Add to cart and redirect to cart page
    addToCart(product);
    router.push('/cart');
    setLoading(false);
  };

  const handleAddToCart = () => {
    addToCart(product);
    setModalTitle('Added to Cart');
    setModalMessage(`${product.name} has been added to your cart.`);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', ...wrapperStyle }}>
        <button
          className="btn btn-primary"
          onClick={handleBuyNow}
          disabled={loading}
          style={buttonStyle}
        >
          {loading ? 'Processing...' : 'Buy Now'}
        </button>
        <button
          className="btn btn-secondary"
          onClick={handleAddToCart}
          disabled={loading}
          style={{ ...buttonStyle, backgroundColor: 'transparent', color: 'var(--color-text-main)', borderColor: 'var(--color-text-main)' }}
        >
          Add to Cart
        </button>
      </div>

      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={modalTitle}
        message={modalMessage}
        autoClose={true}
        duration={3000}
      />
    </>
  );
}
