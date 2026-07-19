import Sidebar from '../../../components/Sidebar';

export default function Terms() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 max-w-3xl">
        <h1 className="text-2xl font-bold mb-6">Terms of Service</h1>
        <div className="card space-y-4 text-sm text-muted leading-relaxed">
          <p><strong className="text-white">1. Acceptance.</strong> By creating an account you agree to these Terms, the Risk Disclosure Statement, and the Privacy Policy.</p>
          <p><strong className="text-white">2. Eligibility.</strong> You must be at least 18 years old and legally permitted to trade the instruments offered by your chosen broker in your jurisdiction.</p>
          <p><strong className="text-white">3. Account Responsibility.</strong> You are responsible for maintaining the confidentiality of your login credentials and for all activity under your account, including strategies you activate in live mode.</p>
          <p><strong className="text-white">4. Subscription & Payments.</strong> Subscription access is activated after payment verification. KingBot reserves the right to reject payments that cannot be verified, and to suspend accounts with fraudulent or disputed payment activity.</p>
          <p><strong className="text-white">5. Broker Credentials.</strong> When you connect an MT4/MT5 account, you authorize KingBot to transmit your credentials to our infrastructure provider solely for the purpose of establishing a connection and executing trades according to your configured strategies. Credentials are encrypted at rest.</p>
          <p><strong className="text-white">6. Prohibited Use.</strong> You may not use the platform for market manipulation, money laundering, or any unlawful purpose. Accounts found in violation will be suspended.</p>
          <p><strong className="text-white">7. Limitation of Liability.</strong> KingBot, its owners, and operators are not liable for trading losses, missed trades, technical failures, or broker-side issues arising from use of the platform.</p>
          <p><strong className="text-white">8. Termination.</strong> We may suspend or terminate accounts that violate these Terms, misuse the platform, or engage in fraudulent payment activity.</p>
          <p><strong className="text-white">9. Changes.</strong> These Terms may be updated periodically. Continued use of the platform constitutes acceptance of the updated Terms.</p>
        </div>
      </main>
    </div>
  );
}
