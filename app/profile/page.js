'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import { api } from '../../lib/api';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [instructions, setInstructions] = useState(null);
  const [payments, setPayments] = useState([]);
  const [form, setForm] = useState({ plan: 'starter', mpesa_code: '', payer_phone: '' });
  const [msg, setMsg] = useState('');

  function load() {
    api('/profile/me').then(setUser).catch(() => {});
    api('/payments/instructions', { auth: false }).then(setInstructions).catch(() => {});
    api('/payments/my-payments').then(setPayments).catch(() => {});
  }
  useEffect(load, []);

  async function submitPayment(e) {
    e.preventDefault();
    setMsg('');
    try {
      const res = await api('/payments/submit', { method: 'POST', body: form });
      setMsg(res.message);
      setForm({ ...form, mpesa_code: '' });
      load();
    } catch (err) {
      setMsg(err.message);
    }
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-8 max-w-3xl">
        <h1 className="font-display text-2xl font-bold mb-6">Profile</h1>

        {user && (
          <div className="card mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <Field label="Full name" value={user.full_name} />
              <Field label="Email" value={`${user.email} ${user.email_verified ? '✓' : '(unverified)'}`} />
              <Field label="Phone" value={`${user.phone} ${user.phone_verified ? '✓' : '(unverified)'}`} />
              <Field label="Account status" value={user.account_status} />
              <Field label="Subscription" value={`${user.subscription_status}${user.subscription_plan ? ' · ' + user.subscription_plan : ''}`} />
              <Field label="Member since" value={new Date(user.created_at).toLocaleDateString()} />
            </div>
          </div>
        )}

        <div className="card mb-6">
          <h2 className="font-semibold text-lg mb-3">Subscribe / Renew via M-Pesa</h2>
          {instructions && (
            <ol className="text-sm text-muted list-decimal ml-5 mb-4 space-y-1">
              {instructions.steps.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
          )}
          {msg && <div className="bg-gold/10 border border-gold/30 text-gold text-sm rounded-lg p-3 mb-4">{msg}</div>}
          <form onSubmit={submitPayment} className="space-y-3">
            <select className="input" value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })}>
              {instructions && Object.entries(instructions.plans).map(([key, p]) => (
                <option key={key} value={key}>{p.label} - KES {p.amount}</option>
              ))}
            </select>
            <input className="input" placeholder="M-Pesa confirmation code (e.g. QFT7K2XXXX)" required value={form.mpesa_code} onChange={(e) => setForm({ ...form, mpesa_code: e.target.value })} />
            <input className="input" placeholder="Phone you paid from" value={form.payer_phone} onChange={(e) => setForm({ ...form, payer_phone: e.target.value })} />
            <button className="btn-primary w-full">Submit Payment</button>
          </form>
        </div>

        <div className="card">
          <h2 className="font-semibold text-lg mb-3">Payment History</h2>
          <div className="space-y-2">
            {payments.map((p) => (
              <div key={p.id} className="flex justify-between text-sm border-b border-border/50 py-2">
                <span>{p.plan} · KES {p.amount} · {p.mpesa_code}</span>
                <span className={p.status === 'approved' ? 'text-gain' : p.status === 'rejected' ? 'text-loss' : 'text-gold'}>{p.status}</span>
              </div>
            ))}
            {payments.length === 0 && <p className="text-muted text-sm">No payments submitted yet.</p>}
          </div>
        </div>
      </main>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-muted text-xs mb-0.5">{label}</p>
      <p className="text-white">{value}</p>
    </div>
  );
}
