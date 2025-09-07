import './globals.css';
import PageTracker from '@/components/PageTracker';
import ClientHeader from '@/components/ClientHeader';
import ClientFooter from '@/components/ClientFooter';

export const metadata = {
  title: 'ProtoHive3D',
  description: 'Empowering creators through scalable, educational, and community-driven innovation.',
  icons: {
    icon: '/favicon.png',
  },
  openGraph: {
    title: 'ProtoHive3D – 3D Printing with Purpose',
    description: 'Empowering creators through scalable, educational, and community-driven innovation.',
    url: 'https://protohive3d.com',
    type: 'website',
    images: [
      {
        url: 'https://protohive3d.com/preview.jpg',
        width: 1200,
        height: 630,
        alt: 'ProtoHive3D Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ProtoHive3D – 3D Printing with Purpose',
    description: 'Empowering creators through scalable, educational, and community-driven innovation.',
    images: ['https://protohive3d.com/preview.jpg'],
  },
  referrer: 'strict-origin-when-cross-origin',
  other: {
    'Content-Security-Policy': "default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self';",
    'Permissions-Policy': 'geolocation=(), camera=(), microphone=()',
  },
};

export default function RootLayout({ children }) {
  // Change "theme-blue" to "theme-yellow" to switch accent + logo
  return (
    <html lang="en" className="theme-blue">
      <head />
      <body>
        <PageTracker />
        <ClientHeader />
        <main>{children}</main>
        <ClientFooter />
      </body>
    </html>
  );
}