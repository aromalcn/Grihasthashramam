import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import styles from "./store.module.css";
import { supabase } from "@/lib/supabase";
import { Product } from "@/data/products"; // Keeping interface for type safety

// This is a Server Component, so we can make it async
export default async function StorePage() {
  // Fetch products from Supabase
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('price', { ascending: true });

  if (error) {
    console.error('Error fetching products:', error);
  }

  const displayProducts = products || [];

  return (
    <main>
      <Header />
      
      <div className={styles.pageHeader}>
        <div className="container">
          <h1 className={styles.title}>Rudraksha Store</h1>
          <p className={styles.subtitle}>
            Sacred beads and spiritual jewelry to enhance your sadhana and daily life.
            Blessed at Veda Kaveri Teerthashram.
          </p>
        </div>
      </div>

      <section className={styles.storeSection}>
        <div className="container">
          <div className={styles.grid}>
            {displayProducts.length > 0 ? (
              displayProducts.map((product: Product) => (
                <ProductCard key={product.id} product={product as Product} />
              ))
            ) : (
              <p className="text-center">Loading products...</p>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
