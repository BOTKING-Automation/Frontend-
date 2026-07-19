'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '../../lib/api';

export default function Verify() {
  const router = useRouter();
  const params = useSearchParams();
  const userId = params.get('user_id');

  const [emailCode, setEmailCode] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [emailDone, setEmailDone] = useState(false);
  const [phoneDone, setPhoneDone] = useState(false);
  const [error, setError] = useState('');

  async function verify(type, code) {
    setError('');
    try {
      await api('/auth/verify', { method: 'POST', body: { user_id: userId, type, code }, auth: false });
      if (type === 'email') setEmailDone(true);
      else setPhoneDone(true);
    } catch (err) {
      setError(err.message);
    }
  }

  async function resend(type) {
    try {
      await api('/auth/resend-code', { method: 'POST', body: { user_id: userId, type }, auth: false });
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="card w-full max-w-md">
        <h1 className="text-2xl font-bold mb-1">Verify your account</h1>
        <p className="text-muted text-sm mb-6">Enter the codes sent to your email and phone.</p>

        {error && <div className="bg-loss/10 border border-loss/30 text-loss text-sm rounded-lg p-3 mb-4">{error}</div>}

        <div className="mb-5">
          <label className="label">Email code {emailDone && <span className="text-gain">✓ verified</span>}</label>
          <div className="flex gap-2">
            <input className="input" value={emailCode} onChange={(e) => setEmailCode(e.target.value)} disabled={emailDone} />
            <button className="btn-secondary" onClick={() => verify('email', emailCode)} disabled={emailDone}>Verify</button>
          </div>
          <button className="text-xs text-gold mt-1" onClick={() => resend('email')}>Resend email code</button>
        </div>

        <div className="mb-6">
          <label className="label">Phone code {phoneDone && <span className="text-gain">✓ verified</span>}</label>
          <div className="flex gap-2">
            <input className="input" value={phoneCode} onChange={(e) => setPhoneCode(e.target.value)} disabled={phoneDone} />
            <button className="btn-secondary" onClick={() => verify('phone', phoneCode)} disabled={phoneDone}>Verify</button>
          </div>
          <button className="text-xs text-gold mt-1" onClick={() => resend('phone')}>Resend SMS code</button>
        </div>

        <button
          disabled={!emailDone || !phoneDone}
          className="btn-primary w-full"
          onClick={() => router.push('/login')}
        >
          Continue to Login
        </button>
      </div>
    </main>
  );
}
