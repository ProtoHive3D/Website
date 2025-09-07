'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import styles from './ClientHeader.module.css';

export default function ClientHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const pathname = usePathname();
  const { totalItems } = useCart();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const sectionIds = ['our-services', 'gallery', 'store', 'contact-us'];

    const handleScroll = () => {
      const scrollPos = window.scrollY + 100;
      let current = '';

      sectionIds.forEach((id) => {
        const section = document.getElementById(id);
        if (section && section.offsetTop <= scrollPos) {
          current = id;
        }
      });

      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const trackClick = (label) => {
    fetch('/api/track-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label })
    });
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>

        {/* Left Zone: Logo */}
        <div className={styles.leftZone}>
          <Link href="/" className={styles.logoLink}>
            <div className={styles.logoWrapper}>
              <Image
                src="/logo-blue.svg"
                alt="ProtoHive3D Logo"
                className={`site-logo ${styles.logo}`}
                height={56}
                width={0}
                sizes="auto"
                priority
              />
            </div>
          </Link>
        </div>

        {/* Middle Zone: Navigation Links */}
        <div className={styles.middleZone}>
          <ul className={`${styles.navList} ${menuOpen ? styles.open : ''}`}>
            <li>
              <Link href="/" className={pathname === '/' ? 'active' : ''}>
                Home
              </Link>
            </li>
            <li>
              <Link
                href="#our-services"
                className={activeSection === 'our-services' ? 'active' : ''}
              >
                Our Services
              </Link>
            </li>
            <li>
              <Link
                href="#gallery"
                className={activeSection === 'gallery' ? 'active' : ''}
              >
                Gallery
              </Link>
            </li>
            <li>
              <Link
                href="#store"
                className={activeSection === 'store' ? 'active' : ''}
              >
                Filament Shop
              </Link>
            </li>
            <li>
              <Link
                href="#contact-us"
                className={activeSection === 'contact-us' ? 'active' : ''}
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Right Zone: Social Icons + Cart + Login + Hamburger */}
        <div className={styles.rightZone}>
          <div className={styles.platformIcons}>
            <a
              href="https://instagram.com/protohive3d"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick('Instagram')}
            >
              <Image src="/icons/instagram.svg" alt="Instagram" width={24} height={24} />
            </a>
            <a
              href="https://youtube.com/@protohive3d"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick('YouTube')}
            >
              <Image src="/icons/youtube.svg" alt="YouTube" width={24} height={24} />
            </a>
            <a
              href="https://tiktok.com/@protohive3d"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick('TikTok')}
            >
              <Image src="/icons/tiktok.svg" alt="TikTok" width={24} height={24} />
            </a>
          </div>

          {/* Cart Icon */}
          <Link href="/cart" className={styles.cartLink}>
            <ShoppingCartIcon className={styles.cartIcon} />
            {totalItems > 0 && (
              <span className={styles.cartBadge}>{totalItems}</span>
            )}
          </Link>

          {/* Login Button */}
          <Link href="/login" className={styles.loginButton}>
            Login
          </Link>

          {/* Hamburger Menu */}
          <button
            className={styles.menuButton}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>

      </nav>
    </header>
  );
}