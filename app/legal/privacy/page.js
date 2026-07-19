import Sidebar from '../../../components/Sidebar';

export default function Privacy() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 max-w-3xl">
        <h1 className="text-2xl font-bold mb-6">Privacy Policy</h1>
        <div className="card space-y-4 text-sm text-muted leading-relaxed">
          <p><strong className="text-white">1. Data We Collect.</strong> Full name, email, phone number, password (hashed), broker account credentials (encrypted), trading activity, and payment confirmation codes you submit.</p>
          <p><strong className="text-white">2. How We Use It.</strong> To operate your account, verify your identity, connect your broker account, execute your configured strategies, process subscription payments, and provide support.</p>
          <p><strong className="text-white">3. Broker Credentials.</strong> Your MT4/MT5 password is encrypted using AES-256 before storage and is transmitted only to our broker-connectivity provider to establish your trading connection. It is never displayed in plaintext after entry.</p>
          <p><strong className="text-white">4. Third Parties.</strong> We share data only with: (a) our email/SMS providers to send verification codes, (b) our broker-connectivity provider to connect your MT4/MT5 account, and (c) our AI support provider to answer your support questions. We do not sell your data.</p>
          <p><strong className="text-white">5. Data Retention.</strong> We retain account and trading data for as long as your account is active and as required for legal and audit purposes thereafter.</p>
          <p><strong className="text-white">6. Your Rights.</strong> You may request a copy of your data or account deletion by contacting support, subject to legal recordkeeping requirements.</p>
          <p><strong className="text-white">7. Security.</strong> We use encryption, rate limiting, and access controls to protect your data, but no system is completely secure. Report suspected unauthorized access immediately.</p>
        </div>
      </main>
    </div>
  );
}
