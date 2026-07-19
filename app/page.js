import Link from 'next/link';
import { Shield, TrendingUp, Link2, LineChart, Zap, BrainCircuit } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <header className="flex items-center justify-between px-8 py-5 border-b border-border relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Shield className="text-gold relative z-10" size={26} />
            <div className="absolute inset-0 bg-gold/40 blur-lg rounded-full" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight">King<span className="text-gold">Bot</span></span>
        </div>
        <div className="flex gap-3">
          <Link href="/login" className="btn-secondary">Log In</Link>
          <Link href="/signup" className="btn-primary">Get Started</Link>
        </div>
      </header>

      <section className="max-w-4xl mx-auto text-center py-28 px-6 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan/30 bg-cyan/5 text-cyan text-xs mb-6">
          <Zap size={12} /> Real broker execution · Real market data · No simulation
        </div>
        <h1 className="font-display text-5xl md:text-6xl font-bold leading-tight mb-6">
          Automate your trading with{' '}
          <span className="bg-gradient-to-r from-gold via-amber-300 to-cyan bg-clip-text text-transparent">
            discipline
          </span>
          , not guesswork.
        </h1>
        <p className="text-muted text-lg mb-10 max-w-2xl mx-auto">
          Connect your MT4/MT5 broker account, configure a strategy — including Smart Money
          Concepts or your own custom rules — and run it in demo mode until you trust it.
          Then flip it live.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/signup" className="btn-primary text-base px-8 py-3">Create Free Account</Link>
          <Link href="/education" className="btn-secondary text-base px-8 py-3">Learn How It Works</Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-5 px-6 pb-24">
        {[
          { icon: Link2, title: 'Real Broker Connection', desc: 'Link your own MT4/MT5 account credentials directly — your account, your control.' },
          { icon: TrendingUp, title: 'Demo & Live Modes', desc: 'Test every strategy against real market data before ever risking live capital.' },
          { icon: BrainCircuit, title: 'SMC & Custom Rules', desc: 'Use Smart Money Concepts, classic indicators, or build entirely custom logic.' },
          { icon: LineChart, title: 'Advanced Analytics', desc: 'Full performance breakdown by symbol, mode, and time — not just a balance.' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="card-glow group">
            <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center mb-3 group-hover:bg-gold/20 transition">
              <Icon className="text-gold" size={20} />
            </div>
            <h3 className="font-semibold text-base mb-2">{title}</h3>
            <p className="text-muted text-sm">{desc}</p>
          </div>
        ))}
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-24 text-center text-sm text-muted">
        <p>
          Trading involves substantial risk of loss and is not suitable for every investor.
          Past performance of any strategy is not indicative of future results. Read our{' '}
          <Link href="/legal/risk-disclosure" className="text-gold underline">Risk Disclosure</Link> before trading live.
        </p>
      </section>
    </main>
  );
}
