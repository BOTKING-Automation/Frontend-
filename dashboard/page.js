'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { api } from '../../lib/api';
import { ArrowUpRight, Bot, ChevronDown, Download, Plus, RefreshCw, ShieldCheck, SlidersHorizontal, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [trades, setTrades] = useState([]);
  const [mode, setMode] = useState('demo');

  useEffect(() => {
    api('/dashboard/summary').then(setSummary).catch(() => {});
  }, []);

  useEffect(() => {
    api(`/dashboard/trades?mode=${mode}&limit=10`).then(setTrades).catch(() => {});
  }, [mode]);

  const wallet = summary?.wallet;
  const pnl = summary?.pnl_by_mode?.find((item) => item.mode === mode);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 min-w-0 p-5 md:p-8 lg:p-10">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div><div className="flex items-center gap-2 text-xs text-gain font-mono uppercase tracking-widest mb-2"><span className="w-1.5 h-1.5 rounded-full bg-gain animate-pulse" /> Trading engine online</div><h1 className="font-display text-3xl font-extrabold tracking-tight">Good morning, trader.</h1><p className="text-muted text-sm mt-1">Here is what your desk is doing today.</p></div>
          <div className="flex gap-2"><button className="btn-secondary text-sm inline-flex items-center gap-2"><RefreshCw size={14} /> Refresh</button><button className="btn-primary text-sm inline-flex items-center gap-2"><Plus size={15} /> Deploy strategy</button></div>
        </div>

        <div className="flex items-center justify-between border-b border-border mb-6 pb-3"><div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted"><span className="text-white">Portfolio overview</span><span>/</span><span>{mode} account</span></div><button className="text-muted hover:text-white text-xs flex items-center gap-1">Last 30 days <ChevronDown size={14} /></button></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <StatCard label="Demo balance" value={`$${wallet?.demo_balance ?? '—'}`} detail="Available equity" icon={TrendingUp} accent="text-gain" />
          <StatCard label="Live balance" value={wallet?.live_balance_cache ? `$${wallet.live_balance_cache}` : 'Not connected'} detail="Broker account" icon={ShieldCheck} accent="text-cyan" />
          <StatCard label="Open trades" value={summary?.open_trades ?? '—'} detail="Across all symbols" icon={SlidersHorizontal} accent="text-gold" />
          <StatCard label="Active strategies" value={summary?.active_strategies ?? '—'} detail="Running now" icon={Bot} accent="text-violet" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_.8fr] gap-4 mb-6">
          <div className="card-glow min-h-[300px]"><div className="flex items-start justify-between mb-6"><div><p className="text-muted text-xs font-mono uppercase tracking-wider mb-2">Equity curve</p><p className="text-2xl font-mono">${wallet?.demo_balance ?? '—'} <span className="text-gain text-sm ml-2">+{pnl ? Number(pnl.total_pnl).toFixed(2) : '—'}</span></p></div><div className="flex gap-1 text-[10px] font-mono text-muted"><span className="px-2 py-1 rounded bg-gold/10 text-gold">DEMO</span><span className="px-2 py-1">LIVE</span></div></div><div className="h-40 flex items-end gap-1 border-b border-border bg-[linear-gradient(rgba(143,255,224,.04)_1px,transparent_1px)] bg-[length:100%_25%]">{[32,38,35,44,41,52,48,58,55,64,61,74,68,78,75,87,84,96,91,104,101,116,110,124,120,136,131,145,140,154,150,168,161,177,172,188].map((height, index) => <div key={index} className="flex-1 rounded-t-sm bg-gradient-to-t from-gain/10 to-gain/70" style={{ height: `${height / 2.2}%` }} />)}</div><div className="flex justify-between text-[10px] text-muted font-mono mt-3"><span>01 JUN</span><span>15 JUN</span><span>30 JUN</span></div></div>
          <div className="card-glow"><div className="flex items-center justify-between mb-6"><div><p className="text-muted text-xs font-mono uppercase tracking-wider mb-2">Performance</p><p className="text-2xl font-mono text-gain">+{pnl ? Number(pnl.total_pnl).toFixed(2) : '—'}</p></div><ArrowUpRight className="text-gain" size={20} /></div><div className="space-y-4"><Progress label="Win rate" value="68.4%" width="68%" color="bg-gain" /><Progress label="Profit factor" value="2.18" width="82%" color="bg-cyan" /><Progress label="Risk utilization" value="24.0%" width="24%" color="bg-gold" /></div><div className="mt-7 pt-4 border-t border-border text-xs text-muted flex justify-between"><span>{pnl?.trade_count ?? 0} closed trades</span><span className="text-white">{mode} mode</span></div></div>
        </div>

        <div className="card-glow">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div><h2 className="font-display font-semibold text-lg">Recent activity</h2><p className="text-muted text-xs mt-1">Your latest executions and open positions</p></div>
            <div className="flex gap-2 items-center">
              <button onClick={() => setMode('demo')} className={`text-sm px-3 py-1.5 rounded-lg ${mode === 'demo' ? 'bg-gold text-black' : 'bg-panel2 text-muted'}`}>Demo</button>
              <button onClick={() => setMode('live')} className={`text-sm px-3 py-1.5 rounded-lg ${mode === 'live' ? 'bg-gold text-black' : 'bg-panel2 text-muted'}`}>Live</button>
              <button className="p-2 text-muted hover:text-white" aria-label="Download trades"><Download size={16} /></button>
            </div>
          </div>
          <table className="w-full text-sm">
            <thead className="text-muted text-left border-b border-border">
              <tr>
                <th className="py-2">Symbol</th><th>Direction</th><th>Volume</th><th>Open Price</th><th>P&L</th><th>Status</th><th>Opened</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((t) => (
                <tr key={t.id} className="border-b border-border/50">
                  <td className="py-2">{t.symbol}</td>
                  <td className={t.direction === 'buy' ? 'text-gain' : 'text-loss'}>{t.direction}</td>
                  <td>{t.volume}</td>
                  <td>{t.open_price}</td>
                  <td className={Number(t.profit) >= 0 ? 'text-gain' : 'text-loss'}>{t.profit ?? '—'}</td>
                  <td className="capitalize">{t.status}</td>
                  <td className="text-muted">{new Date(t.opened_at).toLocaleString()}</td>
                </tr>
              ))}
              {trades.length === 0 && (
                <tr><td colSpan={7} className="py-6 text-center text-muted">No trades yet in {mode} mode.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, detail, icon: Icon, accent }) {
  return <div className="card-glow"><div className="flex items-start justify-between mb-4"><p className="text-muted text-xs uppercase tracking-wider">{label}</p><Icon size={17} className={accent} /></div><p className="stat-value">{value}</p><p className="text-muted text-xs mt-2">{detail}</p></div>;
}

function Progress({ label, value, width, color }) {
  return <div><div className="flex justify-between text-xs mb-2"><span className="text-muted">{label}</span><span className="font-mono text-white">{value}</span></div><div className="h-1.5 rounded-full bg-white/5 overflow-hidden"><div className={`h-full rounded-full ${color}`} style={{ width }} /></div></div>;
}
