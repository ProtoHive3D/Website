'use client';

import Link from 'next/link';
import OurServices from '@/components/OurServices';
import ContactForm from '@/components/ContactForm';
import Gallery from '@/components/Gallery';
import FilamentShop from '@/components/FilamentShop';

export default function HomeContent() {
  return (
    <main style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>ProtoHive3D</h1>
        <p style={{ fontSize: '1.2rem', color: '#555' }}>
          3D Printing with Purpose — Empowering creators through scalable, educational, and community-driven innovation.
        </p>
        <div
          style={{
            marginTop: '2rem',
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem'
          }}
        >
          <Link href="#store">
            <button type="button">Shop Filament</button>
          </Link>
        </div>
      </section>

      {/* Our Services Section */}
      <section id="our-services">
        <OurServices />
      </section>

      {/* Filament Shop Section */}
      <section id="store" style={{ marginBottom: '3rem' }}>
        <FilamentShop />
      </section>

      {/* Gallery Section */}
      <section id="gallery" style={{ marginBottom: '3rem' }}>
        <Gallery />
      </section>

      {/* Contact Form Section */}
      <section id="contact-us">
        <ContactForm />
      </section>

      {/* Brand Closer */}
      <section style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h2>
          ProtoHive3D{' '}
          <span style={{ fontSize: '1rem', color: '#777' }}>
            — Where Makers Learn, Print, and Grow Together.
          </span>
        </h2>
      </section>
    </main>
  );
}
