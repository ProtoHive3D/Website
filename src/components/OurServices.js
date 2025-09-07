import Image from 'next/image';
import Link from 'next/link';
import styles from './OurServices.module.css';

export default function OurServices() {
  const services = [
    {
      title: 'Custom 3D Printing',
      description: 'From prototypes to production parts, we bring your designs to life with precision and speed.',
      image: '/services/custom-printing.png',
      link: '/quote?type=quote'
    },
    {
      title: 'Educational Workshops',
      description: 'Hands‑on learning for schools, makerspaces, and curious minds of all ages.',
      image: '/services/workshops.png',
      link: '/?type=workshop#contact-us'
    },
    {
      title: 'Design Consultation',
      description: 'Collaborate with our experts to refine your concept and prepare it for flawless printing.',
      image: '/services/design-consultation.png',
      link: '/?type=consultation#contact-us'
    }
  ];

  return (
    <section id="our-services" className={styles.servicesSection}>
      <h2 className={styles.heading}>Our Services</h2>
      <div className={styles.grid}>
        {services.map((service, index) => (
          <Link key={index} href={service.link} className={styles.card}>
            <div className={styles.imageWrapper}>
              <Image
                src={service.image}
                alt={service.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={styles.image}
                onLoad={(event) =>
                  event.currentTarget.setAttribute('data-loaded', 'true')
                }
              />
            </div>
            <div className={styles.content}>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <span className={styles.button}>Learn More</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
