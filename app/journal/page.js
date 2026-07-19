'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { api } from '../../lib/api';

const SENTIMENTS = ['confident', 'uncertain', 'mistake', 'disciplined'];

export default function Journal() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ title: '', notes: '', sentiment: 'confident' });

  function load() {
    api('/dashboard/journal').then(setEntries).catch(() => {});
  }
  useEffect(load, []);

  async function addEntry(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    await api('/dashboard/journal', { method: 'POST', body: { ...form, tags: [] } });
    setForm({ title: '', notes: '', sentiment: 'confident' });
    load();
  }

  async function remove(id) {
    await api(`/dashboard/journal/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 max-w-3xl">
        <h1 className="font-display text-2xl font-bold mb-6">Trading Journal</h1>

        <form onSubmit={addEntry} className="card mb-8">
          <label className="label">Title</label>
          <input className="input mb-4" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="What happened / what did you learn?" />
          <label className="label">Notes</label>
          <textarea className="input mb-4" rows={4} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <label className="label">Sentiment</label>
          <select className="input mb-4" value={form.sentiment} onChange={(e) => setForm({ ...form, sentiment: e.target.value })}>
            {SENTIMENTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button className="btn-primary">Add Entry</button>
        </form>

        <div className="space-y-3">
          {entries.map((e) => (
            <div key={e.id} className="card">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{e.title}</p>
                  {e.symbol && <p className="text-xs text-muted mb-1">{e.symbol} · {e.direction} · {e.mode} · P&L: {e.profit ?? '—'}</p>}
                  <p className="text-sm text-muted">{e.notes}</p>
                </div>
                <button onClick={() => remove(e.id)} className="text-loss text-xs">Delete</button>
              </div>
              <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-panel2 text-muted capitalize">{e.sentiment}</span>
            </div>
          ))}
          {entries.length === 0 && <p className="text-muted text-sm">No journal entries yet.</p>}
        </div>
      </main>
    </div>
  );
}
