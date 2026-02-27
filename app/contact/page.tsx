'use client';

import { useState } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Modal from "@/components/Modal";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import styles from "./contact.module.css";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setShowModal(true);
      setSubmitting(false);
      setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
    }, 1000);
  };

  return (
    <main>
      <Header />
      
      <Modal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)}
        title="Message Sent"
        message="Thank you for reaching out! Your message has been received with gratitude. We will get back to you shortly."
      />
      
      <div className={styles.hero}>
        <div className="container">
          <h1 className={styles.title}>Contact Us</h1>
          <p className={styles.subtitle}>
            Have a question or wish to offer Seva?
            Reach out to us and let us guide you.
          </p>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Contact Info */}
          <div className={styles.infoCard}>
            <h2 className={styles.heading}>Get in Touch</h2>
            
            <div className={styles.contactItem}>
              <div className={styles.iconWrapper}><Phone size={24} /></div>
              <div>
                <span className={styles.label}>Phone</span>
                <p className={styles.value}>+91 99466 30000</p>
              </div>
            </div>
            
            <div className={styles.contactItem}>
              <div className={styles.iconWrapper}><Mail size={24} /></div>
              <div>
                <span className={styles.label}>Email</span>
                <p className={styles.value}>info@srichakramahemerutemple.org</p>
              </div>
            </div>
            
            <div className={styles.contactItem}>
              <div className={styles.iconWrapper}><MapPin size={24} /></div>
              <div>
                <span className={styles.label}>Location</span>
                <p className={styles.value}>
                  Garvala Village, Somwarpet Taluk,<br/>
                  Kodagu District, Karnataka
                </p>
              </div>
            </div>

            <div className={styles.contactItem}>
              <div className={styles.iconWrapper}><Clock size={24} /></div>
              <div>
                <span className={styles.label}>Office Hours</span>
                <p className={styles.value}>
                  Monday - Sunday<br/>
                  9:00 AM - 6:00 PM
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className={styles.formBox}>
            <h2 className={styles.heading}>Send us a Message</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.inputLabel}>Your Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    required
                    className={styles.input}
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.inputLabel}>Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required
                    className={styles.input}
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="phone" className={styles.inputLabel}>Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    className={styles.input}
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="subject" className={styles.inputLabel}>Subject</label>
                  <select 
                    id="subject" 
                    name="subject" 
                    className={styles.input}
                    value={formData.subject}
                    onChange={(e: any) => handleChange(e)}
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Booking/Visit">Booking/Visit</option>
                    <option value="Donation/Seva">Donation/Seva</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroupFull}>
                <label htmlFor="message" className={styles.inputLabel}>Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  required
                  className={styles.textarea}
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={submitting}
                className={`btn btn-primary ${styles.submitBtn}`}
              >
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
