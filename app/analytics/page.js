'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { api } from '../../lib/api';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';

export default function Analytics() {
  const [mode, setMode] = useState('demo');
  const [data, setData] = useState(null);

  useEffect(() => {
    api(`/dashboard/analytics?mode=${mode}`).then(setData).catch(() => {});
  }, [mode]);

  const s = data?.summary;
  const equity = (data?.equity_curve || []).map((e, i) => ({ i, pnl: Number(e.running_pnl) }));
  const bySymbol = (data?.by_symbol || []).map((b) => ({ symbol: b.symbol, pnl: Number(b.pnl) }));
  const winRate = s ? (Number(s.wins) / (Number(s.wins) + Number(s.losses) || 1) * 100).toFixed(1) : '0';

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl font-bold">Analytics</h1>
          <div className="flex gap-2">
            <button onClick={() => setMode('demo')} className={`text-sm px-3 py-1.5 rounded-lg ${mode === 'demo' ? 'bg-gold text-black' : 'bg-panel2 text-muted'}`}>Demo Mode</button>
            <button onClick={() => setMode('live')} className={`text-sm px-3 py-1.5 rounded-lg ${mode === 'live' ? 'bg-gold text-black' : 'bg-panel2 text-muted'}`}>Live Mode</button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Stat label="Win Rate" value={`${winRate}%`} />
          <Stat label="Net P&L" value={`$${Number(s?.net_pnl || 0).toFixed(2)}`} color={Number(s?.net_pnl) >= 0 ? 'text-gain' : 'text-loss'} />
          <Stat label="Avg P&L" value={`$${Number(s?.avg_pnl || 0).toFixed(2)}`} />
          <Stat label="Best Trade" value={`$${Number(s?.best_trade || 0).toFixed(2)}`} color="text-gain" />
          <Stat label="Worst Trade" value={`$${Number(s?.worst_trade || 0).toFixed(2)}`} color="text-loss" />
        </div>

        <div className="card-glow mb-6" style={{ height: 320 }}>
          <p className="text-muted text-sm mb-2">Equity Curve ({mode})</p>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={equity}>
              <CartesianGrid stroke="#1F2A3A" />
              <XAxis dataKey="i" stroke="#8B98A9" fontSize={12} />
              <YAxis stroke="#8B98A9" fontSize={12} />
              <Tooltip contentStyle={{ background: '#161F2E', border: '1px solid #1F2A3A' }} />
              <Line type="monotone" dataKey="pnl" stroke="#F0B429" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card-glow" style={{ height: 320 }}>
          <p className="text-muted text-sm mb-2">P&L by Symbol ({mode})</p>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={bySymbol}>
              <CartesianGrid stroke="#1F2A3A" />
              <XAxis dataKey="symbol" stroke="#8B98A9" fontSize={12} />
              <YAxis stroke="#8B98A9" fontSize={12} />
              <Tooltip contentStyle={{ background: '#161F2E', border: '1px solid #1F2A3A' }} />
              <Bar dataKey="pnl" fill="#F0B429" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value, color = 'text-white' }) {
  return (
    <div className="card-glow">
      <p className="text-muted text-xs uppercase tracking-wider mb-1.5">{label}</p>
      <p className={`font-display text-lg font-bold ${color}`}>{value}</p>
    </div>
  );
}
