import Link from "next/link";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Offerings from "@/components/Offerings";
import Footer from "@/components/Footer";
import LoginPopup from "@/components/LoginPopup";

export default function Home() {
  return (
    <main>
      <Header transparent={false} />
      <Hero />
      <About />
      <Offerings />
      
      <section className="section bg-gold-light" style={{ textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ marginBottom: '1rem' }}>Visit Our Spiritual Store</h2>
          <p style={{ marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem auto', color: 'var(--color-text-muted)' }}>
            Bring home the divine energy. Explore our collection of sacred items, books, and offerings.
          </p>
          <Link href="/store" className="btn btn-primary">
            Visit Store
          </Link>
        </div>
      </section>

      <Footer />
      <LoginPopup />
    </main>
  );
}
