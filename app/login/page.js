'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, setToken } from '../../lib/api';

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api('/auth/login', { method: 'POST', body: form, auth: false });
      setToken(res.token);
      router.push('/dashboard');
    } catch (err) {
      if (err.data?.user_id) {
        router.push(`/verify?user_id=${err.data.user_id}`);
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="card w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Welcome back</h1>
        {error && <div className="bg-loss/10 border border-loss/30 text-loss text-sm rounded-lg p-3 mb-4">{error}</div>}

        <label className="label">Email</label>
        <input type="email" className="input mb-4" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />

        <label className="label">Password</label>
        <input type="password" className="input mb-6" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />

        <button disabled={loading} className="btn-primary w-full mb-4">{loading ? 'Logging in...' : 'Log In'}</button>
        <p className="text-sm text-muted text-center">No account? <Link href="/signup" className="text-gold">Sign up</Link></p>
      </form>
    </main>
  );
}
