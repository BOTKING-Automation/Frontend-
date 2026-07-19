'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { api } from '../../lib/api';

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

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="font-display text-2xl font-bold mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Demo Balance" value={`$${wallet?.demo_balance ?? '—'}`} />
          <StatCard label="Live Balance" value={wallet?.live_balance_cache ? `$${wallet.live_balance_cache}` : 'Not connected'} />
          <StatCard label="Open Trades" value={summary?.open_trades ?? '—'} />
          <StatCard label="Active Strategies" value={summary?.active_strategies ?? '—'} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {(summary?.pnl_by_mode || []).map((p) => (
            <div key={p.mode} className="card">
              <p className="text-muted text-sm mb-1 capitalize">{p.mode} mode P&L ({p.trade_count} trades)</p>
              <p className={`text-2xl font-bold ${Number(p.total_pnl) >= 0 ? 'text-gain' : 'text-loss'}`}>
                ${Number(p.total_pnl).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <div className="card-glow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-lg">Trade History</h2>
            <div className="flex gap-2">
              <button onClick={() => setMode('demo')} className={`text-sm px-3 py-1.5 rounded-lg ${mode === 'demo' ? 'bg-gold text-black' : 'bg-panel2 text-muted'}`}>Demo</button>
              <button onClick={() => setMode('live')} className={`text-sm px-3 py-1.5 rounded-lg ${mode === 'live' ? 'bg-gold text-black' : 'bg-panel2 text-muted'}`}>Live</button>
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

function StatCard({ label, value }) {
  return (
    <div className="card-glow">
      <p className="text-muted text-xs uppercase tracking-wider mb-1.5">{label}</p>
      <p className="stat-value">{value}</p>
    </div>
  );
}
