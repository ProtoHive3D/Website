'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './Gallery.module.css'; // create this for styling

const galleryItems = Array.from({ length: 10 }, (_, i) => ({
  id: `print-${i + 1}`,
  title: `Print Model ${i + 1}`,
  thumb: `/gallery/dummy${i + 1}.png`,
  images: [`/gallery/dummy${i + 1}.png`], // can add more images per item later
  description: `This is a placeholder description for Print Model ${i + 1}. Replace with real details about the print, material, and finish.`
}));

export default function Gallery() {
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div className={styles.galleryContainer}>
      <h2 className={styles.heading}>Gallery</h2>
      <div className={styles.scrollWrapper}>
        {galleryItems.map((item) => (
          <div
            key={item.id}
            className={styles.card}
            onClick={() => setSelectedItem(item)}
          >
            <Image
              src={item.thumb}
              alt={item.title}
              width={200}
              height={200}
              className={styles.cardImage}
            />
            <p className={styles.cardTitle}>{item.title}</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedItem && (
        <div className={styles.modalOverlay} onClick={() => setSelectedItem(null)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeButton}
              onClick={() => setSelectedItem(null)}
            >
              ✕
            </button>
            <h3>{selectedItem.title}</h3>
            <div className={styles.modalImages}>
              {selectedItem.images.map((src, idx) => (
                <Image
                  key={idx}
                  src={src}
                  alt={`${selectedItem.title} image ${idx + 1}`}
                  width={400}
                  height={400}
                  className={styles.modalImage}
                />
              ))}
            </div>
            <p className={styles.description}>{selectedItem.description}</p>
            <a
              href={`/quote?printType=${encodeURIComponent(selectedItem.title)}`}
              className={styles.quoteButton}
            >
              Get a Quote
            </a>
          </div>
        </div>
      )}
    </div>
  );
}