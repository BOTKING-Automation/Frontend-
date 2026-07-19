'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { api, apiUpload } from '../../lib/api';

export default function Admin() {
  const [tab, setTab] = useState('overview');
  const [overview, setOverview] = useState(null);
  const [pending, setPending] = useState([]);
  const [users, setUsers] = useState([]);
  const [media, setMedia] = useState([]);

  function loadAll() {
    api('/admin/overview').then(setOverview).catch(() => {});
    api('/payments/pending').then(setPending).catch(() => {});
    api('/admin/users').then(setUsers).catch(() => {});
    api('/content/media', { auth: false }).then(setMedia).catch(() => {});
  }
  useEffect(loadAll, []);

  async function decide(id, decision) {
    const note = decision === 'rejected' ? prompt('Reason for rejection (optional):') || '' : '';
    await api(`/payments/${id}/decide`, { method: 'POST', body: { decision, note } });
    loadAll();
  }

  async function setStatus(id, account_status) {
    await api(`/admin/users/${id}/status`, { method: 'PATCH', body: { account_status } });
    loadAll();
  }

  async function uploadImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    const section = prompt('Section for this image (e.g. hero, education, strategy_icons):', 'hero');
    const label = prompt('Label (optional):', '') || '';
    const fd = new FormData();
    fd.append('image', file);
    fd.append('section', section || 'misc');
    fd.append('label', label);
    await apiUpload('/content/media/upload', fd);
    loadAll();
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <h1 className="font-display text-2xl font-bold mb-6">Admin Panel</h1>

        <div className="flex gap-2 mb-6">
          {['overview', 'payments', 'users', 'media'].map((t) => (
            <button key={t} onClick={() => setTab(t)} className={`text-sm px-4 py-2 rounded-lg capitalize ${tab === t ? 'bg-gold text-black' : 'bg-panel2 text-muted'}`}>{t}</button>
          ))}
        </div>

        {tab === 'overview' && overview && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Stat label="Total Users" value={overview.total_users} />
            <Stat label="Active Subscriptions" value={overview.active_subscriptions} />
            <Stat label="Pending Payments" value={overview.pending_payments} />
            <Stat label="Live Broker Connections" value={overview.live_broker_connections} />
            <Stat label="Active Strategies" value={overview.active_strategies} />
            <Stat label="Total Revenue (KES)" value={overview.total_revenue} />
          </div>
        )}

        {tab === 'payments' && (
          <div className="space-y-3">
            {pending.map((p) => (
              <div key={p.id} className="card flex items-center justify-between">
                <div>
                  <p className="font-semibold">{p.full_name} · {p.email}</p>
                  <p className="text-sm text-muted">{p.plan} · KES {p.amount} · Code: <span className="text-gold">{p.mpesa_code}</span> · from {p.payer_phone}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => decide(p.id, 'approved')} className="btn-primary text-sm px-4 py-1.5">Approve</button>
                  <button onClick={() => decide(p.id, 'rejected')} className="bg-loss/10 text-loss text-sm px-4 py-1.5 rounded-lg">Reject</button>
                </div>
              </div>
            ))}
            {pending.length === 0 && <p className="text-muted text-sm">No pending payments. Check them against your M-Pesa statement before approving.</p>}
          </div>
        )}

        {tab === 'users' && (
          <table className="w-full text-sm card">
            <thead className="text-muted text-left border-b border-border">
              <tr><th className="py-2">Name</th><th>Email</th><th>Status</th><th>Subscription</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-border/50">
                  <td className="py-2">{u.full_name}</td>
                  <td>{u.email}</td>
                  <td className="capitalize">{u.account_status}</td>
                  <td>{u.subscription_status}</td>
                  <td className="flex gap-2 py-2">
                    <button onClick={() => setStatus(u.id, 'active')} className="text-gain text-xs">Activate</button>
                    <button onClick={() => setStatus(u.id, 'suspended')} className="text-gold text-xs">Suspend</button>
                    <button onClick={() => setStatus(u.id, 'banned')} className="text-loss text-xs">Ban</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'media' && (
          <div>
            <label className="btn-primary inline-block cursor-pointer mb-6">
              Upload Image
              <input type="file" accept="image/*" className="hidden" onChange={uploadImage} />
            </label>
            <div className="grid grid-cols-4 gap-4">
              {media.map((m) => (
                <div key={m.id} className="card p-2">
                  <img src={m.file_url} alt={m.label} className="rounded-lg w-full h-24 object-cover mb-2" />
                  <p className="text-xs text-muted">{m.section} · {m.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="card">
      <p className="text-muted text-xs mb-1">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
