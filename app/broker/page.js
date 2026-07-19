'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { api } from '../../lib/api';

export default function Broker() {
  const [connections, setConnections] = useState([]);
  const [form, setForm] = useState({ broker_name: '', platform: 'mt5', login: '', password: '', server: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function load() {
    api('/broker').then(setConnections).catch(() => {});
  }
  useEffect(load, []);

  async function connect(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api('/broker/connect', { method: 'POST', body: form });
      setForm({ broker_name: '', platform: 'mt5', login: '', password: '', server: '' });
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function checkStatus(id) {
    const res = await api(`/broker/${id}/status`);
    alert(`Status: ${res.connectionStatus}\nBalance: ${res.liveBalance ?? 'n/a'}\nEquity: ${res.liveEquity ?? 'n/a'}`);
    load();
  }

  async function disconnect(id) {
    if (!confirm('Disconnect this broker account?')) return;
    await api(`/broker/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 max-w-3xl">
        <h1 className="font-display text-2xl font-bold mb-2">Broker Connection</h1>
        <p className="text-muted text-sm mb-6">
          Connect your own MT4 or MT5 account. Your password is encrypted (AES-256) and never shown again.
          We connect via MetaApi.cloud, a licensed cloud bridge to your broker's terminal.
        </p>

        <form onSubmit={connect} className="card-glow mb-8">
          {error && <div className="bg-loss/10 border border-loss/30 text-loss text-sm rounded-lg p-3 mb-4">{error}</div>}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="label">Platform</label>
              <select className="input" value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}>
                <option value="mt5">MetaTrader 5</option>
                <option value="mt4">MetaTrader 4</option>
              </select>
            </div>
            <div>
              <label className="label">Broker name</label>
              <input className="input" placeholder="e.g. Exness, XM, HFM" required value={form.broker_name} onChange={(e) => setForm({ ...form, broker_name: e.target.value })} />
            </div>
          </div>
          <label className="label">Account login (number)</label>
          <input className="input mb-4" required value={form.login} onChange={(e) => setForm({ ...form, login: e.target.value })} />
          <label className="label">Account password</label>
          <input type="password" className="input mb-4" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <label className="label">Broker server</label>
          <input className="input mb-6" placeholder="e.g. Exness-MT5Real8" required value={form.server} onChange={(e) => setForm({ ...form, server: e.target.value })} />
          <button disabled={loading} className="btn-primary w-full">{loading ? 'Connecting...' : 'Connect Broker Account'}</button>
        </form>

        <h2 className="font-display font-semibold text-lg mb-3">Your Connections</h2>
        <div className="space-y-3">
          {connections.map((c) => (
            <div key={c.id} className="card-glow flex items-center justify-between">
              <div>
                <p className="font-semibold">{c.broker_name} ({c.platform.toUpperCase()})</p>
                <p className="text-sm text-muted">Login: {c.login} · Server: {c.server}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-1 rounded-full ${c.connection_status === 'connected' ? 'bg-gain/10 text-gain' : 'bg-panel2 text-muted'}`}>
                  {c.connection_status}
                </span>
                <button onClick={() => checkStatus(c.id)} className="btn-secondary text-xs px-3 py-1.5">Check Status</button>
                <button onClick={() => disconnect(c.id)} className="text-loss text-xs px-3 py-1.5">Disconnect</button>
              </div>
            </div>
          ))}
          {connections.length === 0 && <p className="text-muted text-sm">No broker accounts connected yet.</p>}
        </div>
      </main>
    </div>
  );
}
