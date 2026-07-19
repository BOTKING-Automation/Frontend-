'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { api } from '../../lib/api';
import { Zap, TrendingUp, Activity, Waves, Grid3x3, BrainCircuit, Sliders } from 'lucide-react';

const CATEGORY_STYLE = {
  trend: { icon: TrendingUp, color: 'text-cyan', bg: 'bg-cyan/10' },
  scalping: { icon: Zap, color: 'text-gold', bg: 'bg-gold/10' },
  mean_reversion: { icon: Activity, color: 'text-violet', bg: 'bg-violet/10' },
  breakout: { icon: Waves, color: 'text-cyan', bg: 'bg-cyan/10' },
  grid: { icon: Grid3x3, color: 'text-gold', bg: 'bg-gold/10' },
  smc: { icon: BrainCircuit, color: 'text-violet', bg: 'bg-violet/10' },
  custom: { icon: Sliders, color: 'text-gain', bg: 'bg-gain/10' },
};
const RISK_STYLE = { high: 'bg-loss/10 text-loss', low: 'bg-gain/10 text-gain', medium: 'bg-gold/10 text-gold' };

export default function Strategies() {
  const [templates, setTemplates] = useState([]);
  const [myStrategies, setMyStrategies] = useState([]);
  const [connections, setConnections] = useState([]);
  const [configuring, setConfiguring] = useState(null);
  const [form, setForm] = useState({ execution_mode: 'demo', broker_connection_id: '', symbols: 'EURUSD', lot_size: 0.1 });
  const [customRules, setCustomRules] = useState({
    buy: [{ indicator: 'rsi', period: 14, operator: 'lt', value: 30 }],
    sell: [{ indicator: 'rsi', period: 14, operator: 'gt', value: 70 }],
  });
  const [error, setError] = useState('');

  function load() {
    api('/strategies/templates').then(setTemplates).catch(() => {});
    api('/strategies/my-strategies').then(setMyStrategies).catch(() => {});
    api('/broker').then(setConnections).catch(() => {});
  }
  useEffect(load, []);

  function startConfigure(template) {
    setConfiguring(template);
    setForm({ execution_mode: 'demo', broker_connection_id: '', symbols: 'EURUSD', lot_size: template.default_params.lot_size || 0.1 });
    if (template.default_params.rules) setCustomRules(template.default_params.rules);
    setError('');
  }

  function updateRule(side, index, key, value) {
    setCustomRules((prev) => {
      const next = { ...prev, [side]: [...prev[side]] };
      next[side][index] = { ...next[side][index], [key]: value };
      return next;
    });
  }

  function addRule(side) {
    setCustomRules((prev) => ({ ...prev, [side]: [...prev[side], { indicator: 'rsi', period: 14, operator: 'lt', value: 30 }] }));
  }

  function removeRule(side, index) {
    setCustomRules((prev) => ({ ...prev, [side]: prev[side].filter((_, i) => i !== index) }));
  }

  async function createStrategy() {
    setError('');
    const isCustom = configuring.default_params.strategy_key === 'custom';
    try {
      await api('/strategies/my-strategies', {
        method: 'POST',
        body: {
          template_id: configuring.id,
          name: configuring.name,
          params: {
            ...configuring.default_params,
            lot_size: Number(form.lot_size),
            ...(isCustom ? { rules: customRules } : {}),
          },
          execution_mode: form.execution_mode,
          broker_connection_id: form.broker_connection_id || null,
          symbols: form.symbols.split(',').map((s) => s.trim().toUpperCase()),
        },
      });
      setConfiguring(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function toggle(id, isActive) {
    await api(`/strategies/my-strategies/${id}/toggle`, { method: 'PATCH', body: { is_active: !isActive } });
    load();
  }

  async function remove(id) {
    if (!confirm('Delete this strategy?')) return;
    await api(`/strategies/my-strategies/${id}`, { method: 'DELETE' });
    load();
  }

  const isCustomTemplate = configuring?.default_params?.strategy_key === 'custom';

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="font-display text-2xl font-bold mb-1">Bot Strategies</h1>
        <p className="text-muted text-sm mb-6">Every strategy runs on YOUR settings, YOUR symbols, YOUR chosen mode.</p>

        <h2 className="font-display font-semibold text-lg mb-3">Your Active Strategies</h2>
        <div className="space-y-3 mb-10">
          {myStrategies.map((s) => (
            <div key={s.id} className="card-glow flex items-center justify-between">
              <div>
                <p className="font-semibold">{s.name}</p>
                <p className="text-sm text-muted">
                  Mode: <span className={s.execution_mode === 'live' ? 'text-loss font-medium' : 'text-gain font-medium'}>{s.execution_mode}</span>
                  {s.execution_mode === 'live' && s.broker_name && ` · ${s.broker_name} (${s.platform})`}
                  {' · '}Symbols: {(s.symbols || []).join(', ')}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => toggle(s.id, s.is_active)} className={`text-xs px-3 py-1.5 rounded-lg font-medium ${s.is_active ? 'bg-gain/10 text-gain shadow-[0_0_12px_rgba(34,197,94,0.2)]' : 'bg-panel2 text-muted'}`}>
                  {s.is_active ? '● Running' : 'Stopped'}
                </button>
                <button onClick={() => remove(s.id)} className="text-loss text-xs">Delete</button>
              </div>
            </div>
          ))}
          {myStrategies.length === 0 && <p className="text-muted text-sm">You haven't configured any strategies yet.</p>}
        </div>

        <h2 className="font-display font-semibold text-lg mb-3">Strategy Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.map((t) => {
            const cat = CATEGORY_STYLE[t.category] || CATEGORY_STYLE.trend;
            const Icon = cat.icon;
            return (
              <div key={t.id} className="card-glow group">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-9 h-9 rounded-lg ${cat.bg} flex items-center justify-center`}>
                    <Icon className={cat.color} size={18} />
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${RISK_STYLE[t.risk_level]}`}>{t.risk_level} risk</span>
                </div>
                <h3 className="font-semibold mb-1.5">{t.name}</h3>
                <p className="text-sm text-muted mb-4 leading-relaxed">{t.description}</p>
                <button onClick={() => startConfigure(t)} className="btn-secondary w-full text-sm">Configure</button>
              </div>
            );
          })}
        </div>

        {configuring && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-8 overflow-y-auto">
            <div className="card-glow w-full max-w-lg my-auto">
              <h3 className="font-display font-semibold text-lg mb-4">Configure: {configuring.name}</h3>
              {error && <div className="bg-loss/10 border border-loss/30 text-loss text-sm rounded-lg p-3 mb-4">{error}</div>}

              <label className="label">Execution mode</label>
              <select className="input mb-4" value={form.execution_mode} onChange={(e) => setForm({ ...form, execution_mode: e.target.value })}>
                <option value="demo">Demo (simulated fill, real market data)</option>
                <option value="live">Live (real broker execution)</option>
              </select>

              {form.execution_mode === 'live' && (
                <>
                  <label className="label">Broker connection</label>
                  <select className="input mb-4" value={form.broker_connection_id} onChange={(e) => setForm({ ...form, broker_connection_id: e.target.value })}>
                    <option value="">Select a connected broker...</option>
                    {connections.map((c) => (
                      <option key={c.id} value={c.id}>{c.broker_name} ({c.platform}) - {c.connection_status}</option>
                    ))}
                  </select>
                </>
              )}

              <label className="label">Symbols (comma separated)</label>
              <input className="input mb-4" value={form.symbols} onChange={(e) => setForm({ ...form, symbols: e.target.value })} />

              <label className="label">Lot size</label>
              <input type="number" step="0.01" className="input mb-4" value={form.lot_size} onChange={(e) => setForm({ ...form, lot_size: e.target.value })} />

              {isCustomTemplate && (
                <div className="mb-4 space-y-4">
                  {['buy', 'sell'].map((side) => (
                    <div key={side}>
                      <label className="label capitalize">{side} conditions (all must be true)</label>
                      <div className="space-y-2">
                        {customRules[side].map((rule, i) => (
                          <div key={i} className="flex gap-2 items-center">
                            <select className="input text-xs py-1.5" value={rule.indicator} onChange={(e) => updateRule(side, i, 'indicator', e.target.value)}>
                              <option value="price">Price</option>
                              <option value="sma">SMA</option>
                              <option value="ema">EMA</option>
                              <option value="rsi">RSI</option>
                            </select>
                            {rule.indicator !== 'price' && (
                              <input type="number" className="input text-xs py-1.5 w-16" placeholder="period" value={rule.period} onChange={(e) => updateRule(side, i, 'period', Number(e.target.value))} />
                            )}
                            <select className="input text-xs py-1.5 w-20" value={rule.operator} onChange={(e) => updateRule(side, i, 'operator', e.target.value)}>
                              <option value="gt">{'>'}</option>
                              <option value="lt">{'<'}</option>
                            </select>
                            <input type="number" className="input text-xs py-1.5 w-20" placeholder="value" value={rule.value} onChange={(e) => updateRule(side, i, 'value', Number(e.target.value))} />
                            <button onClick={() => removeRule(side, i)} className="text-loss text-xs px-1">✕</button>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => addRule(side)} className="text-cyan text-xs mt-2">+ Add condition</button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-3 mt-2">
                <button onClick={() => setConfiguring(null)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={createStrategy} className="btn-primary flex-1">Save Strategy</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
