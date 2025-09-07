'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './ClientFooter.module.css';

export default function ClientFooter() {
  const trackClick = (label) => {
    fetch('/api/track-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label })
    });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>

        {/* Customer Service Info */}
        <div className={styles.contactInfo}>
          <h4>Customer Service</h4>
          <p>
            <strong>Phone:</strong>{' '}
            <a
              href="tel:+17132910799"
              onClick={() => trackClick('Phone')}
              className={styles.contactLink}
            >
              (713) 291‑0799
            </a>
          </p>
          <p>
            <strong>Address:</strong><br />
            ProtoHive3D<br />
            9169 West State Street, Suite #429<br />
            Garden City, ID 83714<br />
          </p>
        </div>

        {/* Social Icons */}
        <div className={styles.socialIcons}>
          <Link
            href="https://instagram.com/protohive3d"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackClick('Instagram')}
            aria-label="Instagram"
            className={styles.icon}
          >
            <Image src="/icons/instagram.svg" alt="Instagram" width={24} height={24} />
          </Link>
          <Link
            href="https://youtube.com/@ProtoHive3D"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackClick('YouTube')}
            aria-label="YouTube"
            className={styles.icon}
          >
            <Image src="/icons/youtube.svg" alt="YouTube" width={24} height={24} />
          </Link>
          <Link
            href="https://tiktok.com/@protohive3d"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackClick('TikTok')}
            aria-label="TikTok"
            className={styles.icon}
          >
            <Image src="/icons/tiktok.svg" alt="TikTok" width={24} height={24} />
          </Link>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottomBar}>
        <p>© {currentYear} ProtoHive3D. All rights reserved.</p>
        <p>
          <Link href="#contact">Contact</Link> | <Link href="/privacy">Privacy Policy</Link>
        </p>
      </div>
    </footer>
  );
}