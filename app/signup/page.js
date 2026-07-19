'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../lib/api';

export default function Signup() {
  const router = useRouter();
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api('/auth/signup', { method: 'POST', body: form, auth: false });
      router.push(`/verify?user_id=${res.user_id}`);
    } catch (err) {
      setError(err.data?.errors?.[0]?.msg || err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="card w-full max-w-md">
        <h1 className="text-2xl font-bold mb-1">Create your account</h1>
        <p className="text-muted text-sm mb-6">Start in demo mode - no risk, real market data.</p>

        {error && <div className="bg-loss/10 border border-loss/30 text-loss text-sm rounded-lg p-3 mb-4">{error}</div>}

        <label className="label">Full name</label>
        <input className="input mb-4" required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />

        <label className="label">Email</label>
        <input type="email" className="input mb-4" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />

        <label className="label">Phone (e.g. 0712345678)</label>
        <input className="input mb-4" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />

        <label className="label">Password</label>
        <input type="password" minLength={8} className="input mb-6" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />

        <button disabled={loading} className="btn-primary w-full mb-4">{loading ? 'Creating account...' : 'Sign Up'}</button>
        <p className="text-sm text-muted text-center">Already have an account? <Link href="/login" className="text-gold">Log in</Link></p>
      </form>
    </main>
  );
}
