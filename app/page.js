import Link from 'next/link';
import { Activity, ArrowUpRight, Bot, ChevronRight, LineChart, Shield, Zap } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <header className="flex items-center justify-between px-5 md:px-10 py-5 border-b border-border relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Shield className="text-gold relative z-10" size={26} />
            <div className="absolute inset-0 bg-gold/40 blur-lg rounded-full" />
          </div>
          <span className="font-display text-xl font-extrabold tracking-tight">King<span className="text-gold">Bot</span><span className="text-muted text-xs font-mono ml-2">OS</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-xs text-muted font-mono uppercase tracking-wider">
          <span className="text-white">Platform</span><span>Strategies</span><span>Security</span><span>Docs</span>
        </div>
        <div className="flex gap-2">
          <Link href="/login" className="btn-secondary">Log In</Link>
          <Link href="/signup" className="btn-primary hidden sm:block">Launch terminal</Link>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-5 md:px-10 pt-16 md:pt-24 pb-20 relative">
        <div className="grid lg:grid-cols-[1.05fr_.95fr] gap-14 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gain/30 bg-gain/5 text-gain text-[11px] font-mono uppercase tracking-wider mb-7"><span className="w-1.5 h-1.5 rounded-full bg-gain animate-pulse" /> Engine online · v2.4.1</div>
            <h1 className="font-display text-5xl md:text-7xl font-extrabold leading-[1.02] tracking-[-0.04em] mb-7 max-w-3xl">Trade with a system that never <span className="text-gold">blinks.</span></h1>
            <p className="text-muted text-lg leading-relaxed mb-9 max-w-xl">KingBot is the operating system for systematic traders. Connect your broker, deploy strategies, and let disciplined automation work the market around the clock.</p>
            <div className="flex flex-wrap gap-3 mb-10"><Link href="/signup" className="btn-primary px-6 py-3 inline-flex items-center gap-2">Build your desk <ArrowUpRight size={17} /></Link><Link href="/markets" className="btn-secondary px-6 py-3 inline-flex items-center gap-2">View live markets <ChevronRight size={16} /></Link></div>
            <div className="flex flex-wrap gap-x-7 gap-y-3 text-xs text-muted font-mono"><span className="flex items-center gap-2"><Shield size={14} className="text-cyan" /> Non-custodial</span><span className="flex items-center gap-2"><Zap size={14} className="text-gold" /> Demo to live</span><span className="flex items-center gap-2"><Activity size={14} className="text-gain" /> 99.9% uptime target</span></div>
          </div>
          <div className="relative"><div className="absolute -inset-8 bg-cyan/5 blur-3xl rounded-full" /><div className="relative border border-border bg-[#0b1716]/90 rounded-2xl shadow-card overflow-hidden"><div className="flex items-center justify-between px-5 py-4 border-b border-border bg-white/[.02]"><div className="flex items-center gap-2 text-xs font-mono"><Bot size={15} className="text-gold" /> BOT / MOMENTUM-01</div><span className="text-[10px] text-gain font-mono uppercase tracking-widest">● Running</span></div><div className="p-5 md:p-6"><div className="flex items-end justify-between mb-5"><div><p className="text-muted text-xs font-mono mb-2">EQUITY / DEMO</p><p className="text-3xl font-mono font-medium">$24,892.40</p></div><p className="text-gain font-mono text-sm mb-1">+$1,284.20 <span className="text-xs">+5.44%</span></p></div><div className="h-40 flex items-end gap-1.5 border-b border-border bg-[linear-gradient(rgba(143,255,224,.04)_1px,transparent_1px)] bg-[length:100%_33.33%]">{[28,36,32,48,42,55,50,63,58,72,67,76,70,85,78,92,88,100,94,112,108,126,118,137,130,146,142,158,151,171,166,182,179,198,190,208,200,224].map((height, index) => <div key={index} className="flex-1 rounded-t-sm bg-gradient-to-t from-cyan/20 to-cyan/70" style={{ height: `${height / 2.3}%` }} />)}</div><div className="grid grid-cols-3 gap-3 pt-5"><MiniMetric label="Win rate" value="68.4%" positive /><MiniMetric label="Profit factor" value="2.18" positive /><MiniMetric label="Open risk" value="1.2%" /></div></div><div className="border-t border-border px-5 py-3 flex items-center justify-between text-[10px] font-mono text-muted"><span>EURUSD · GBPJPY · XAUUSD</span><span className="text-cyan">REAL-TIME FEED</span></div></div></div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 md:px-10 pb-20"><div className="grid grid-cols-2 md:grid-cols-4 border-y border-border divide-x divide-border"><MiniMetric label="Markets monitored" value="140+" /><MiniMetric label="Broker ready" value="MT4 / MT5" /><MiniMetric label="Strategy templates" value="24" /><MiniMetric label="Execution latency" value="< 80ms" /></div>
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

function MiniMetric({ label, value, positive }) {
  return <div className="p-5"><p className="text-muted text-[10px] font-mono uppercase tracking-wider mb-2">{label}</p><p className={`font-mono text-lg ${positive ? 'text-gain' : 'text-white'}`}>{value}</p></div>;
}
