import Link from 'next/link';

export default function Privacy() {
  return (
    <main className="privacy-container">
      <h2>Privacy Policy</h2>
      <p>
        ProtoHive3D respects your privacy. We collect only the information necessary to respond to inquiries and fulfill orders. We do not sell or share your data with third parties.
      </p>
      <ul>
        <li>Contact form data is used solely for communication.</li>
        <li>Uploaded files are stored securely and deleted after processing.</li>
        <li>Analytics tools may track anonymous usage patterns.</li>
      </ul>
      <p>
        For questions, feel free to <Link href="/">use our contact form</Link>.
      </p>
    </main>
  );
}