'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Activity, ArrowDownRight, ArrowUpRight, BookOpen, Bot, ChartNoAxesCombined,
  ChevronDown, CircleHelp, GraduationCap, LayoutDashboard, Link2, LogOut,
  Menu, MessageCircle, Plus, Send, Shield, ShieldCheck, SlidersHorizontal,
  Sparkles, TrendingUp, UserRound, X, Zap,
} from 'lucide-react';

const NAV = [
  ['dashboard', 'Dashboard', LayoutDashboard],
  ['markets', 'Live markets', ChartNoAxesCombined],
  ['strategies', 'Strategies', TrendingUp],
  ['broker', 'Broker connection', Link2],
  ['analytics', 'Analytics', Activity],
  ['journal', 'Trading journal', BookOpen],
  ['education', 'Education', GraduationCap],
  ['profile', 'Profile & billing', UserRound],
  ['admin', 'Admin', ShieldCheck],
];

const SYMBOLS = [
  ['EUR/USD', 'FX:EURUSD'], ['GBP/USD', 'FX:GBPUSD'], ['USD/JPY', 'FX:USDJPY'],
  ['Gold', 'OANDA:XAUUSD'], ['BTC/USD', 'BINANCE:BTCUSDT'], ['ETH/USD', 'BINANCE:ETHUSDT'],
  ['US30', 'FOREXCOM:US30'], ['NAS100', 'FOREXCOM:NSXUSD'],
];

const LEGAL = {
  terms: ['Terms of Service', [
    'By creating an account you agree to these Terms, the Risk Disclosure Statement, and the Privacy Policy.',
    'You must be at least 18 years old and legally permitted to trade the instruments offered by your chosen broker in your jurisdiction.',
    'You are responsible for your credentials and for all activity under your account, including strategies you activate in live mode.',
    'Subscription access is activated after payment verification. KingBot may reject unverifiable payments and suspend accounts for fraud.',
    'You authorize KingBot to transmit connected MT4/MT5 credentials to its infrastructure provider only for connection and configured execution. Credentials are encrypted at rest.',
    'The platform may not be used for market manipulation, money laundering, or unlawful purposes.',
    'KingBot is not liable for trading losses, missed trades, technical failures, or broker-side issues.',
  ]],
  privacy: ['Privacy Policy', [
    'We collect account details, encrypted broker credentials, trading activity, and payment confirmation details to operate the service.',
    'Data is used to verify your identity, connect your broker, execute configured strategies, process subscriptions, and provide support.',
    'Broker credentials are encrypted before storage and transmitted only to the broker-connectivity provider to establish your trading connection.',
    'Data is shared with email/SMS, broker-connectivity, and AI support providers only to provide those services. We do not sell your data.',
    'You may request a copy of your data or account deletion, subject to legal recordkeeping requirements.',
    'We use encryption and access controls, but no system is completely secure. Report suspected unauthorized access immediately.',
  ]],
  risk: ['Risk Disclosure Statement', [
    'Forex, CFDs, commodities, and other leveraged instruments carry substantial risk. You may lose some or all of your capital; do not trade with money you cannot afford to lose.',
    'No strategy, algorithm, or automated system guarantees profit or protection against loss. Past performance is not indicative of future results.',
    'Demo mode uses real market data but simulated fills and does not model all slippage, requotes, latency, or liquidity constraints. Demo results may not match live results.',
    'KingBot is not a broker, dealer, or custodian. You trade directly through your own broker under your agreement with that broker.',
    'Nothing on the platform, including templates, educational content, or AI support, is financial or investment advice.',
    'Automated systems depend on connectivity and third-party services; outages or errors can result in missed, delayed, or duplicated trades.',
  ]],
};

function token() {
  return typeof window === 'undefined' ? null : window.localStorage.getItem('kingbot_token');
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '')}/api`
  : '/api';

async function api(path, { method = 'GET', body, auth = true } = {}) {
  if (process.env.NEXT_PUBLIC_STATIC_SITE === 'true' && !process.env.NEXT_PUBLIC_API_URL) {
    throw new Error('Trading services are not connected yet. Configure the NEXT_PUBLIC_API_URL repository variable.');
  }
  const headers = { 'Content-Type': 'application/json' };
  if (auth && token()) headers.Authorization = `Bearer ${token()}`;
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.error || 'Request failed');
    error.data = data;
    throw error;
  }
  return data;
}

async function upload(path, formData) {
  if (process.env.NEXT_PUBLIC_STATIC_SITE === 'true' && !process.env.NEXT_PUBLIC_API_URL) {
    throw new Error('Trading services are not connected yet. Configure the NEXT_PUBLIC_API_URL repository variable.');
  }
  const headers = token() ? { Authorization: `Bearer ${token()}` } : {};
  const response = await fetch(`${API_BASE}${path}`, { method: 'POST', headers, body: formData });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Upload failed');
  return data;
}

export default function KingBotApp() {
  const [view, setView] = useState('home');
  const [authenticated, setAuthenticated] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [mode, setMode] = useState('demo');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [trades, setTrades] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [connections, setConnections] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [strategies, setStrategies] = useState([]);
  const [journal, setJournal] = useState([]);
  const [articles, setArticles] = useState([]);
  const [activeArticle, setActiveArticle] = useState(null);
  const [profile, setProfile] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [payments, setPayments] = useState([]);
  const [adminData, setAdminData] = useState({ overview: null, pending: [], users: [], media: [] });
  const [marketSymbol, setMarketSymbol] = useState(SYMBOLS[0][1]);
  const [authMode, setAuthMode] = useState('login');
  const [verificationUser, setVerificationUser] = useState('');
  const [authForm, setAuthForm] = useState({ full_name: '', email: '', phone: '', password: '' });
  const [verifyCodes, setVerifyCodes] = useState({ email: '', phone: '' });
  const [verified, setVerified] = useState({ email: false, phone: false });
  const [brokerForm, setBrokerForm] = useState({ broker_name: '', platform: 'mt5', login: '', password: '', server: '' });
  const [journalForm, setJournalForm] = useState({ title: '', notes: '', sentiment: 'confident' });
  const [paymentForm, setPaymentForm] = useState({ plan: 'starter', mpesa_code: '', payer_phone: '' });
  const [strategyForm, setStrategyForm] = useState({ template: null, execution_mode: 'demo', broker_connection_id: '', symbols: 'EURUSD', lot_size: 0.1 });
  const [adminTab, setAdminTab] = useState('overview');
  const [supportOpen, setSupportOpen] = useState(false);
  const [supportMessages, setSupportMessages] = useState([]);
  const [supportInput, setSupportInput] = useState('');
  const [supportLoading, setSupportLoading] = useState(false);
  const chartRef = useRef(null);
  const supportBottom = useRef(null);

  useEffect(() => {
    if (token()) {
      setAuthenticated(true);
      setView('dashboard');
    }
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    const safe = (path, setter, options) => api(path, options).then(setter).catch(() => {});
    if (view === 'dashboard') {
      safe('/dashboard/summary', setSummary);
      safe(`/dashboard/trades?mode=${mode}&limit=10`, setTrades);
    }
    if (view === 'analytics') safe(`/dashboard/analytics?mode=${mode}`, setAnalytics);
    if (view === 'strategies') {
      safe('/strategies/templates', setTemplates);
      safe('/strategies/my-strategies', setStrategies);
      safe('/broker', setConnections);
    }
    if (view === 'broker') safe('/broker', setConnections);
    if (view === 'journal') safe('/dashboard/journal', setJournal);
    if (view === 'education') safe('/content/education', setArticles, { auth: false });
    if (view === 'profile') {
      safe('/profile/me', setProfile);
      safe('/payments/instructions', setPaymentInfo, { auth: false });
      safe('/payments/my-payments', setPayments);
    }
    if (view === 'admin') {
      safe('/admin/overview', (overview) => setAdminData((old) => ({ ...old, overview })));
      safe('/payments/pending', (pending) => setAdminData((old) => ({ ...old, pending })));
      safe('/admin/users', (users) => setAdminData((old) => ({ ...old, users })));
      safe('/content/media', (media) => setAdminData((old) => ({ ...old, media })), { auth: false });
    }
  }, [view, mode, authenticated]);

  useEffect(() => {
    if (view !== 'markets' || !chartRef.current) return;
    chartRef.current.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true, symbol: marketSymbol, interval: '15', timezone: 'Etc/UTC', theme: 'dark',
      style: '1', locale: 'en', backgroundColor: '#0b1716', gridColor: 'rgba(143,255,224,.08)',
      hide_top_toolbar: false, hide_legend: false, allow_symbol_change: true, support_host: 'https://www.tradingview.com',
    });
    chartRef.current.appendChild(script);
  }, [view, marketSymbol]);

  useEffect(() => {
    supportBottom.current?.scrollIntoView({ behavior: 'smooth' });
  }, [supportMessages]);

  useEffect(() => {
    if (!supportOpen || !authenticated || supportMessages.length) return;
    api('/support/conversation').then((result) => setSupportMessages(result.messages || [])).catch(() => {});
  }, [supportOpen, authenticated, supportMessages.length]);

  function navigate(next) {
    setError('');
    setNotice('');
    setView(next);
    setMobileNav(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function signOut() {
    window.localStorage.removeItem('kingbot_token');
    setAuthenticated(false);
    setSummary(null);
    navigate('home');
  }

  async function submitAuth(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (authMode === 'signup') {
        const result = await api('/auth/signup', { method: 'POST', body: authForm, auth: false });
        setVerificationUser(result.user_id);
        navigate('verify');
      } else {
        const result = await api('/auth/login', { method: 'POST', body: { email: authForm.email, password: authForm.password }, auth: false });
        window.localStorage.setItem('kingbot_token', result.token);
        setAuthenticated(true);
        navigate('dashboard');
      }
    } catch (err) {
      if (err.data?.user_id) {
        setVerificationUser(err.data.user_id);
        navigate('verify');
      } else setError(err.data?.errors?.[0]?.msg || err.message);
    } finally {
      setLoading(false);
    }
  }

  async function verify(type, resend = false) {
    setError('');
    try {
      if (resend) await api('/auth/resend-code', { method: 'POST', body: { user_id: verificationUser, type }, auth: false });
      else {
        await api('/auth/verify', { method: 'POST', body: { user_id: verificationUser, type, code: verifyCodes[type] }, auth: false });
        setVerified((old) => ({ ...old, [type]: true }));
      }
    } catch (err) { setError(err.message); }
  }

  async function connectBroker(event) {
    event.preventDefault();
    setError(''); setLoading(true);
    try {
      await api('/broker/connect', { method: 'POST', body: brokerForm });
      setBrokerForm({ broker_name: '', platform: 'mt5', login: '', password: '', server: '' });
      const next = await api('/broker'); setConnections(next); setNotice('Broker connection submitted.');
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  async function createStrategy(event) {
    event.preventDefault();
    const selected = strategyForm.template;
    if (!selected) return;
    setError('');
    try {
      await api('/strategies/my-strategies', { method: 'POST', body: {
        template_id: selected.id, name: selected.name, params: {
          ...selected.default_params,
          lot_size: Number(strategyForm.lot_size),
          ...(selected.default_params?.strategy_key === 'custom' ? { rules: strategyForm.rules || selected.default_params.rules } : {}),
        },
        execution_mode: strategyForm.execution_mode, broker_connection_id: strategyForm.broker_connection_id || null,
        symbols: strategyForm.symbols.split(',').map((symbol) => symbol.trim().toUpperCase()).filter(Boolean),
      } });
      setStrategyForm((old) => ({ ...old, template: null }));
      setStrategies(await api('/strategies/my-strategies'));
      setNotice('Strategy deployed.');
      return true;
    } catch (err) { setError(err.message); return false; }
  }

  async function toggleStrategy(strategy) {
    await api(`/strategies/my-strategies/${strategy.id}/toggle`, { method: 'PATCH', body: { is_active: !strategy.is_active } });
    setStrategies(await api('/strategies/my-strategies'));
  }

  async function deleteStrategy(id) {
    if (!window.confirm('Delete this strategy?')) return;
    await api(`/strategies/my-strategies/${id}`, { method: 'DELETE' });
    setStrategies(await api('/strategies/my-strategies'));
  }

  async function addJournal(event) {
    event.preventDefault();
    if (!journalForm.title.trim()) return;
    await api('/dashboard/journal', { method: 'POST', body: { ...journalForm, tags: [] } });
    setJournalForm({ title: '', notes: '', sentiment: 'confident' });
    setJournal(await api('/dashboard/journal'));
  }

  async function submitPayment(event) {
    event.preventDefault();
    try {
      const result = await api('/payments/submit', { method: 'POST', body: paymentForm });
      setNotice(result.message);
      setPaymentForm((old) => ({ ...old, mpesa_code: '' }));
      setPayments(await api('/payments/my-payments'));
    } catch (err) { setError(err.message); }
  }

  async function sendSupport() {
    if (!supportInput.trim()) return;
    const message = supportInput.trim();
    setSupportMessages((old) => [...old, { sender: 'user', message }]);
    setSupportInput(''); setSupportLoading(true);
    try {
      const result = await api('/support/message', { method: 'POST', body: { message } });
      setSupportMessages((old) => [...old, { sender: 'ai', message: result.reply }]);
    } catch {
      setSupportMessages((old) => [...old, { sender: 'ai', message: 'Support is temporarily unavailable. Please try again shortly.' }]);
    } finally { setSupportLoading(false); }
  }

  async function reloadAdminData() {
    const [overview, pending, users, media] = await Promise.all([
      api('/admin/overview').catch(() => null),
      api('/payments/pending').catch(() => []),
      api('/admin/users').catch(() => []),
      api('/content/media', { auth: false }).catch(() => []),
    ]);
    setAdminData({ overview, pending, users, media });
  }

  const currentPnl = summary?.pnl_by_mode?.find((item) => item.mode === mode);
  const pageTitle = NAV.find(([key]) => key === view)?.[1] || 'KingBot';

  return (
    <div className="min-h-screen">
      {authenticated ? (
        <div className="min-h-screen md:flex">
          <aside className={`${mobileNav ? 'block' : 'hidden'} md:flex fixed md:sticky top-0 left-0 z-40 h-screen w-64 flex-col border-r border-border bg-[#091311]/95 backdrop-blur-xl`}>
            <button onClick={() => navigate('dashboard')} className="px-5 py-6 flex items-center gap-2.5 text-left">
              <Shield className="text-gold" size={24} /><span className="font-display text-xl font-extrabold">King<span className="text-gold">Bot</span><span className="text-muted text-[10px] font-mono ml-2">OS</span></span>
            </button>
            <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
              {NAV.map(([key, label, Icon]) => <button key={key} onClick={() => navigate(key)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition ${view === key ? 'text-cyan bg-cyan/10' : 'text-muted hover:bg-white/5 hover:text-white'}`}><Icon size={17} />{label}</button>)}
              <div className="border-t border-border my-3" />
              {Object.entries({ terms: 'Terms', privacy: 'Privacy', risk: 'Risk disclosure' }).map(([key, label]) => <button key={key} onClick={() => navigate(key)} className="w-full px-3 py-2 text-left text-xs text-muted hover:text-white">{label}</button>)}
            </nav>
            <div className="mx-3 mb-3 px-3 py-2.5 rounded-lg bg-white/[.03] border border-border flex items-center gap-2 text-xs text-muted"><span className="w-2 h-2 rounded-full bg-gain animate-pulse" />Engine online</div>
            <button onClick={signOut} className="mx-3 mb-5 flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted hover:text-loss"><LogOut size={17} />Log out</button>
          </aside>

          <main className="flex-1 min-w-0 px-4 py-5 md:px-8 md:py-8 lg:px-10">
            <header className="flex items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3"><button className="md:hidden text-muted" onClick={() => setMobileNav(!mobileNav)} aria-label="Toggle navigation"><Menu size={20} /></button><div><div className="flex items-center gap-2 text-[10px] text-gain font-mono uppercase tracking-widest mb-1"><span className="w-1.5 h-1.5 rounded-full bg-gain" />Trading engine online</div><h1 className="font-display text-2xl md:text-3xl font-extrabold">{pageTitle}</h1></div></div>
              <div className="flex items-center gap-2"><button onClick={() => navigate('profile')} className="hidden sm:block text-xs text-muted hover:text-white">Account</button><button onClick={() => setSupportOpen(true)} className="btn-secondary p-2" aria-label="Open support"><CircleHelp size={17} /></button></div>
            </header>
            {error && <div className="mb-5 px-4 py-3 border border-loss/30 bg-loss/10 text-loss rounded-lg text-sm">{error}<button onClick={() => setError('')} className="float-right" aria-label="Dismiss"><X size={15} /></button></div>}
            {notice && <div className="mb-5 px-4 py-3 border border-gain/30 bg-gain/10 text-gain rounded-lg text-sm">{notice}<button onClick={() => setNotice('')} className="float-right" aria-label="Dismiss"><X size={15} /></button></div>}
            {renderView()}
          </main>
        </div>
      ) : view === 'login' || view === 'signup' ? renderAuth() : view === 'verify' ? renderVerify() : renderLanding()}

      {supportOpen && authenticated && <div className="fixed bottom-5 right-5 z-50 w-[min(22rem,calc(100vw-2rem))] h-[min(30rem,calc(100vh-2rem))] bg-[#0b1716] border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden"><div className="px-4 py-3 border-b border-border flex items-center justify-between"><span className="font-semibold text-sm">KingBot Support</span><button onClick={() => setSupportOpen(false)} aria-label="Close support"><X size={17} /></button></div><div className="flex-1 overflow-y-auto p-3 space-y-2">{supportMessages.map((message, index) => <div key={index} className={`text-sm max-w-[85%] px-3 py-2 rounded-lg ${message.sender === 'user' ? 'ml-auto bg-gold text-black' : 'bg-white/5'}`}>{message.message}</div>)}{supportLoading && <p className="text-xs text-muted">Typing...</p>}<div ref={supportBottom} /></div><div className="p-3 border-t border-border flex gap-2"><input className="input flex-1 text-sm" placeholder="Ask about your account..." value={supportInput} onChange={(event) => setSupportInput(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && sendSupport()} /><button onClick={sendSupport} className="btn-primary p-2" aria-label="Send message"><Send size={16} /></button></div></div>}
    </div>
  );

  function renderLanding() {
    return <main className="min-h-screen"><header className="px-5 md:px-10 py-5 flex items-center justify-between border-b border-border"><button onClick={() => navigate('home')} className="flex items-center gap-2.5"><Shield className="text-gold" size={24} /><span className="font-display text-xl font-extrabold">King<span className="text-gold">Bot</span><span className="text-muted text-[10px] font-mono ml-2">OS</span></span></button><div className="flex gap-2"><button onClick={() => { setAuthMode('login'); navigate('login'); }} className="btn-secondary">Log in</button><button onClick={() => { setAuthMode('signup'); navigate('signup'); }} className="btn-primary">Launch terminal</button></div></header><section className="max-w-7xl mx-auto grid lg:grid-cols-[1.05fr_.95fr] gap-14 items-center px-5 md:px-10 pt-16 md:pt-24 pb-20"><div><p className="inline-flex items-center gap-2 border border-gain/30 bg-gain/5 text-gain px-3 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wider mb-7"><span className="w-1.5 h-1.5 bg-gain rounded-full animate-pulse" />Engine online · v2.4.1</p><h1 className="font-display text-5xl md:text-7xl font-extrabold leading-[1.02] mb-7">Trade with a system that never <span className="text-gold">blinks.</span></h1><p className="text-muted text-lg leading-relaxed max-w-xl mb-8">Connect your broker, deploy strategies, and let disciplined automation work the market around the clock.</p><div className="flex flex-wrap gap-3 mb-9"><button onClick={() => { setAuthMode('signup'); navigate('signup'); }} className="btn-primary inline-flex items-center gap-2 px-6 py-3">Build your desk <ArrowUpRight size={17} /></button><button onClick={() => { setAuthMode('login'); navigate('login'); }} className="btn-secondary inline-flex items-center gap-2 px-6 py-3">Open terminal <ChevronDown className="-rotate-90" size={16} /></button></div><div className="flex flex-wrap gap-6 text-xs text-muted font-mono"><span className="flex gap-2 items-center"><ShieldCheck size={14} className="text-cyan" />Non-custodial</span><span className="flex gap-2 items-center"><Zap size={14} className="text-gold" />Demo to live</span><span className="flex gap-2 items-center"><Activity size={14} className="text-gain" />MT4 / MT5 ready</span></div></div><div className="border border-border bg-[#0b1716]/90 rounded-xl overflow-hidden shadow-card"><div className="px-5 py-4 border-b border-border flex justify-between text-xs font-mono"><span><Bot size={15} className="inline text-gold mr-2" />BOT / MOMENTUM-01</span><span className="text-gain">● RUNNING</span></div><div className="p-5 md:p-6"><div className="flex items-end justify-between mb-5"><div><p className="text-muted text-[10px] font-mono mb-2">EQUITY / DEMO</p><p className="font-mono text-3xl">$24,892.40</p></div><span className="font-mono text-sm text-gain">+$1,284.20</span></div><Sparkline values={[25,31,28,43,38,50,48,61,57,70,64,78,75,89,85,99,94,112,108,129,124,145,140,160,155,179,174,196]} /><div className="grid grid-cols-3 gap-3 pt-5"><Metric label="Win rate" value="68.4%" /><Metric label="Profit factor" value="2.18" /><Metric label="Open risk" value="1.2%" /></div></div><div className="px-5 py-3 flex justify-between border-t border-border text-[10px] text-muted font-mono"><span>EURUSD · GBPJPY · XAUUSD</span><span className="text-cyan">MARKET FEED</span></div></div></section><section className="max-w-7xl mx-auto px-5 md:px-10 pb-20"><div className="grid grid-cols-2 md:grid-cols-4 border-y border-border">{[['Markets monitored', '140+'], ['Broker ready', 'MT4 / MT5'], ['Strategy templates', '24'], ['Mode', 'Demo first']].map(([label, value]) => <Metric key={label} label={label} value={value} />)}</div></section><footer className="px-5 md:px-10 pb-12 text-center text-xs text-muted">Trading involves substantial risk of loss. Past performance is not indicative of future results. <button onClick={() => navigate('risk')} className="text-gold underline">Read risk disclosure</button></footer></main>;
  }

  function renderAuth() {
    return <main className="min-h-screen flex items-center justify-center px-4 py-10"><form onSubmit={submitAuth} className="card w-full max-w-md"><button type="button" onClick={() => navigate('home')} className="text-xs text-muted mb-6">← Back to KingBot</button><h1 className="font-display text-2xl font-extrabold mb-2">{authMode === 'signup' ? 'Create your account' : 'Welcome back'}</h1><p className="text-muted text-sm mb-6">{authMode === 'signup' ? 'Start in demo mode with real market data.' : 'Sign in to your trading desk.'}</p>{error && <p className="text-loss text-sm mb-4">{error}</p>}{authMode === 'signup' && <><label className="label">Full name</label><input className="input mb-4" required value={authForm.full_name} onChange={(event) => setAuthForm({ ...authForm, full_name: event.target.value })} /><label className="label">Phone</label><input className="input mb-4" required value={authForm.phone} onChange={(event) => setAuthForm({ ...authForm, phone: event.target.value })} /></>}<label className="label">Email</label><input className="input mb-4" type="email" required value={authForm.email} onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })} /><label className="label">Password</label><input className="input mb-6" type="password" minLength={authMode === 'signup' ? 8 : undefined} required value={authForm.password} onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })} /><button className="btn-primary w-full" disabled={loading}>{loading ? 'Please wait...' : authMode === 'signup' ? 'Create account' : 'Log in'}</button><p className="text-sm text-muted text-center mt-5">{authMode === 'signup' ? 'Already have an account?' : 'No account yet?'} <button type="button" onClick={() => { setError(''); setAuthMode(authMode === 'signup' ? 'login' : 'signup'); }} className="text-gold">{authMode === 'signup' ? 'Log in' : 'Sign up'}</button></p></form></main>;
  }

  function renderVerify() {
    return <main className="min-h-screen flex items-center justify-center px-4"><section className="card w-full max-w-md"><button onClick={() => navigate('login')} className="text-xs text-muted mb-6">← Back to login</button><h1 className="font-display text-2xl font-extrabold mb-2">Verify your account</h1><p className="text-muted text-sm mb-6">Enter the codes sent to your email and phone.</p>{error && <p className="text-loss text-sm mb-4">{error}</p>}{['email', 'phone'].map((type) => <div key={type} className="mb-5"><label className="label capitalize">{type} code {verified[type] && <span className="text-gain">· verified</span>}</label><div className="flex gap-2"><input className="input" value={verifyCodes[type]} disabled={verified[type]} onChange={(event) => setVerifyCodes({ ...verifyCodes, [type]: event.target.value })} /><button className="btn-secondary" onClick={() => verify(type)} disabled={verified[type]}>Verify</button></div><button className="text-xs text-gold mt-2" onClick={() => verify(type, true)}>Resend {type} code</button></div>)}<button disabled={!verified.email || !verified.phone} className="btn-primary w-full" onClick={() => { setAuthMode('login'); navigate('login'); }}>Continue to login</button></section></main>;
  }

  function renderView() {
    if (LEGAL[view]) return <LegalPage view={view} />;
    if (view === 'dashboard') return <DashboardView summary={summary} trades={trades} mode={mode} setMode={setMode} pnl={currentPnl} />;
    if (view === 'markets') return <section><div className="flex justify-end mb-4"><select className="input max-w-xs" value={marketSymbol} onChange={(event) => setMarketSymbol(event.target.value)}>{SYMBOLS.map(([label, value]) => <option key={value} value={value}>{label}</option>)}</select></div><div className="card-glow p-0 overflow-hidden h-[65vh] min-h-[420px]"><div ref={chartRef} className="tradingview-widget-container h-full w-full" /></div></section>;
    if (view === 'strategies') return <StrategiesView templates={templates} strategies={strategies} connections={connections} form={strategyForm} setForm={setStrategyForm} onCreate={createStrategy} onToggle={toggleStrategy} onDelete={deleteStrategy} />;
    if (view === 'broker') return <BrokerView connections={connections} form={brokerForm} setForm={setBrokerForm} onSubmit={connectBroker} loading={loading} onReload={() => api('/broker').then(setConnections)} />;
    if (view === 'analytics') return <AnalyticsView data={analytics} mode={mode} setMode={setMode} />;
    if (view === 'journal') return <JournalView entries={journal} form={journalForm} setForm={setJournalForm} onSubmit={addJournal} onDelete={async (id) => { await api(`/dashboard/journal/${id}`, { method: 'DELETE' }); setJournal(await api('/dashboard/journal')); }} />;
    if (view === 'education') return <EducationView articles={articles} active={activeArticle} setActive={setActiveArticle} />;
    if (view === 'profile') return <ProfileView profile={profile} instructions={paymentInfo} payments={payments} form={paymentForm} setForm={setPaymentForm} onSubmit={submitPayment} />;
    if (view === 'admin') return <AdminView data={adminData} tab={adminTab} setTab={setAdminTab} reload={reloadAdminData} />;
    return <DashboardView summary={summary} trades={trades} mode={mode} setMode={setMode} pnl={currentPnl} />;
  }
}

function Metric({ label, value }) {
  return <div className="p-5 border-r border-border last:border-r-0"><p className="text-muted text-[10px] font-mono uppercase tracking-wider mb-2">{label}</p><p className="font-mono text-lg">{value ?? '—'}</p></div>;
}

function Sparkline({ values }) {
  const max = Math.max(...values);
  return <div className="h-40 flex items-end gap-1 border-b border-border bg-[linear-gradient(rgba(143,255,224,.04)_1px,transparent_1px)] bg-[length:100%_33.33%]">{values.map((value, index) => <span key={index} className="flex-1 rounded-t-sm bg-gradient-to-t from-cyan/20 to-cyan/70" style={{ height: `${Math.max(12, value / max * 100)}%` }} />)}</div>;
}

function DashboardView({ summary, trades, mode, setMode, pnl }) {
  const wallet = summary?.wallet;
  return <><div className="flex flex-wrap justify-between items-end gap-3 mb-6"><div><p className="text-muted text-sm">Your desk at a glance</p><p className="font-mono text-xs text-gain mt-1">{mode.toUpperCase()} ACCOUNT · LIVE DATA</p></div><div className="flex gap-1"><ModeButton value="demo" mode={mode} setMode={setMode} /><ModeButton value="live" mode={mode} setMode={setMode} /></div></div><div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-5"><MetricCard label="Demo balance" value={`$${wallet?.demo_balance ?? '—'}`} accent="text-gain" /><MetricCard label="Live balance" value={wallet?.live_balance_cache ? `$${wallet.live_balance_cache}` : 'Not connected'} accent="text-cyan" /><MetricCard label="Open trades" value={summary?.open_trades ?? '—'} accent="text-gold" /><MetricCard label="Active strategies" value={summary?.active_strategies ?? '—'} accent="text-violet" /></div><div className="grid xl:grid-cols-[1.4fr_.8fr] gap-4 mb-5"><section className="card-glow"><div className="flex justify-between mb-5"><div><p className="label">Equity overview</p><p className="font-mono text-2xl">${wallet?.demo_balance ?? '—'}</p></div><p className="font-mono text-gain">{pnl ? `${Number(pnl.total_pnl) >= 0 ? '+' : ''}${Number(pnl.total_pnl).toFixed(2)}` : '—'}</p></div><Sparkline values={[25,29,27,35,40,38,48,46,59,56,65,62,74,71,84,80,90,96,93,108,104,117,122,120,138,143,152,149,169,178,187]} /><div className="flex justify-between mt-3 text-[10px] text-muted font-mono"><span>30 DAYS AGO</span><span>TODAY</span></div></section><section className="card-glow"><p className="label mb-5">Performance / {mode}</p><p className={`font-mono text-3xl mb-6 ${Number(pnl?.total_pnl || 0) >= 0 ? 'text-gain' : 'text-loss'}`}>{pnl ? `$${Number(pnl.total_pnl).toFixed(2)}` : '—'}</p><MetricRow label="Closed trades" value={pnl?.trade_count ?? 0} /><MetricRow label="Open exposure" value={summary?.open_trades ?? '—'} /><MetricRow label="Strategies online" value={summary?.active_strategies ?? '—'} /></section></div><TradeTable trades={trades} mode={mode} /></>;
}

function MetricCard({ label, value, accent }) {
  return <section className="card-glow"><p className="label">{label}</p><p className={`font-mono text-xl md:text-2xl ${accent}`}>{value}</p></section>;
}

function MetricRow({ label, value }) {
  return <div className="flex justify-between border-t border-border py-3 text-sm"><span className="text-muted">{label}</span><span className="font-mono">{value}</span></div>;
}

function ModeButton({ value, mode, setMode }) {
  return <button onClick={() => setMode(value)} className={`px-3 py-1.5 text-xs rounded-md capitalize ${mode === value ? 'bg-gold text-black' : 'bg-white/5 text-muted'}`}>{value}</button>;
}

function TradeTable({ trades, mode }) {
  return <section className="card-glow overflow-x-auto"><div className="flex items-center justify-between gap-3 mb-4"><div><h2 className="font-display font-semibold">Recent activity</h2><p className="text-xs text-muted mt-1">Latest executions · {mode} mode</p></div></div><table className="w-full min-w-[720px] text-sm"><thead className="text-left text-muted border-b border-border"><tr>{['Symbol', 'Direction', 'Volume', 'Open price', 'P&L', 'Status', 'Opened'].map((label) => <th key={label} className="py-2 pr-4 font-medium">{label}</th>)}</tr></thead><tbody>{trades.map((trade) => <tr key={trade.id} className="border-b border-border/50"><td className="py-3 pr-4 font-mono">{trade.symbol}</td><td className={trade.direction === 'buy' ? 'text-gain' : 'text-loss'}>{trade.direction}</td><td>{trade.volume}</td><td>{trade.open_price}</td><td className={Number(trade.profit) >= 0 ? 'text-gain' : 'text-loss'}>{trade.profit ?? '—'}</td><td className="capitalize">{trade.status}</td><td className="text-muted">{trade.opened_at ? new Date(trade.opened_at).toLocaleString() : '—'}</td></tr>)}{!trades.length && <tr><td colSpan={7} className="text-center py-10 text-muted">No trades yet in {mode} mode.</td></tr>}</tbody></table></section>;
}

function StrategiesView({ templates, strategies, connections, form, setForm, onCreate, onToggle, onDelete }) {
  const [configuring, setConfiguring] = useState(null);
  const defaultRules = { buy: [{ indicator: 'rsi', period: 14, operator: 'lt', value: 30 }], sell: [{ indicator: 'rsi', period: 14, operator: 'gt', value: 70 }] };
  const custom = configuring?.default_params?.strategy_key === 'custom';

  function changeRule(side, index, key, value) {
    const rules = { ...(form.rules || configuring.default_params.rules || defaultRules), [side]: [...((form.rules || configuring.default_params.rules || defaultRules)[side])] };
    rules[side][index] = { ...rules[side][index], [key]: value };
    setForm({ ...form, rules });
  }

  return <>
    <section className="mb-9">
      <div className="flex items-end justify-between mb-4"><div><p className="label">Automation</p><h2 className="font-display text-xl font-bold">Your strategies</h2></div><span className="text-xs text-muted">{strategies.length} configured</span></div>
      <div className="space-y-3">{strategies.map((strategy) => <div key={strategy.id} className="card-glow flex flex-wrap items-center justify-between gap-3"><div><p className="font-semibold">{strategy.name}</p><p className="text-xs text-muted mt-1">{strategy.execution_mode} · {(strategy.symbols || []).join(', ')}</p></div><div className="flex items-center gap-3"><span className={`text-xs ${strategy.is_active ? 'text-gain' : 'text-muted'}`}>{strategy.is_active ? '● Running' : 'Stopped'}</span><button onClick={() => onToggle(strategy)} className="btn-secondary text-xs">{strategy.is_active ? 'Pause' : 'Start'}</button><button onClick={() => onDelete(strategy.id)} className="text-loss text-xs">Delete</button></div></div>)}{!strategies.length && <p className="text-sm text-muted">No configured strategies yet.</p>}</div>
    </section>
    <section><p className="label">Strategy library</p><h2 className="font-display text-xl font-bold mb-4">Templates</h2><div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{templates.map((item) => <article className="card-glow" key={item.id}><div className="flex justify-between mb-4"><span className="text-gold"><Bot size={18} /></span><span className="text-xs text-muted capitalize">{item.risk_level} risk</span></div><h3 className="font-semibold mb-2">{item.name}</h3><p className="text-sm text-muted min-h-12 mb-4">{item.description}</p><button onClick={() => { setConfiguring(item); setForm({ ...form, template: item, lot_size: item.default_params?.lot_size || 0.1, rules: item.default_params?.rules || defaultRules }); }} className="btn-secondary w-full text-sm">Configure</button></article>)}</div>{!templates.length && <p className="text-sm text-muted">Strategy templates will appear when connected.</p>}</section>
    {configuring && <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 overflow-y-auto"><form onSubmit={(event) => { onCreate(event).then((saved) => saved && setConfiguring(null)); }} className="card-glow w-full max-w-lg my-auto"><div className="flex justify-between items-center mb-5"><h2 className="font-display font-bold text-lg">Configure {configuring.name}</h2><button type="button" onClick={() => setConfiguring(null)} aria-label="Close"><X size={18} /></button></div><label className="label">Execution mode</label><select className="input mb-4" value={form.execution_mode} onChange={(event) => setForm({ ...form, execution_mode: event.target.value })}><option value="demo">Demo · simulated fills</option><option value="live">Live · broker execution</option></select>{form.execution_mode === 'live' && <><label className="label">Broker connection</label><select className="input mb-4" value={form.broker_connection_id} onChange={(event) => setForm({ ...form, broker_connection_id: event.target.value })}><option value="">Select broker</option>{connections.map((connection) => <option key={connection.id} value={connection.id}>{connection.broker_name} · {connection.platform}</option>)}</select></>}<label className="label">Symbols (comma separated)</label><input className="input mb-4" value={form.symbols} onChange={(event) => setForm({ ...form, symbols: event.target.value })} /><label className="label">Lot size</label><input className="input mb-4" type="number" step="0.01" min="0.01" value={form.lot_size} onChange={(event) => setForm({ ...form, lot_size: form.lot_size })} onBlur={(event) => setForm({ ...form, lot_size: event.target.value })} />{custom && <div className="space-y-4 mb-5">{['buy', 'sell'].map((side) => <div key={side}><p className="label capitalize">{side} conditions</p>{(form.rules || configuring.default_params.rules || defaultRules)[side].map((rule, index) => <div className="grid grid-cols-[1fr_72px_64px_72px_32px] gap-2 mb-2" key={`${side}-${index}`}><select className="input text-xs px-2" value={rule.indicator} onChange={(event) => changeRule(side, index, 'indicator', event.target.value)}><option value="price">Price</option><option value="sma">SMA</option><option value="ema">EMA</option><option value="rsi">RSI</option></select><input className="input text-xs px-2" type="number" value={rule.period ?? 14} onChange={(event) => changeRule(side, index, 'period', Number(event.target.value))} /><select className="input text-xs px-2" value={rule.operator} onChange={(event) => changeRule(side, index, 'operator', event.target.value)}><option value="gt">&gt;</option><option value="lt">&lt;</option></select><input className="input text-xs px-2" type="number" value={rule.value} onChange={(event) => changeRule(side, index, 'value', Number(event.target.value))} /><button type="button" className="text-loss" onClick={() => setForm({ ...form, rules: { ...(form.rules || configuring.default_params.rules || defaultRules), [side]: (form.rules || configuring.default_params.rules || defaultRules)[side].filter((_, i) => i !== index) } })} aria-label="Remove condition"><X size={15} /></button></div>)}<button type="button" className="text-xs text-cyan" onClick={() => setForm({ ...form, rules: { ...(form.rules || configuring.default_params.rules || defaultRules), [side]: [...(form.rules || configuring.default_params.rules || defaultRules)[side], { indicator: 'rsi', period: 14, operator: side === 'buy' ? 'lt' : 'gt', value: side === 'buy' ? 30 : 70 }] } })}>+ Add condition</button></div>)}</div>}<div className="flex gap-3"><button type="button" className="btn-secondary flex-1" onClick={() => setConfiguring(null)}>Cancel</button><button className="btn-primary flex-1">Deploy strategy</button></div></form></div>}
  </>;
}

function LegacyStrategiesView({ templates, strategies, connections, form, setForm, onCreate, onToggle }) {
  const [configuring, setConfiguring] = useState(null);
  return <><section className="mb-9"><div className="flex items-end justify-between mb-4"><div><p className="label">Automation</p><h2 className="font-display text-xl font-bold">Your strategies</h2></div><span className="text-xs text-muted">{strategies.length} configured</span></div><div className="space-y-3">{strategies.map((strategy) => <div key={strategy.id} className="card-glow flex flex-wrap items-center justify-between gap-3"><div><p className="font-semibold">{strategy.name}</p><p className="text-xs text-muted mt-1">{strategy.execution_mode} · {(strategy.symbols || []).join(', ')}</p></div><div className="flex items-center gap-3"><span className={`text-xs ${strategy.is_active ? 'text-gain' : 'text-muted'}`}>{strategy.is_active ? '● Running' : 'Stopped'}</span><button onClick={() => onToggle(strategy)} className="btn-secondary text-xs">{strategy.is_active ? 'Pause' : 'Start'}</button></div></div>)}{!strategies.length && <p className="text-sm text-muted">No configured strategies yet.</p>}</div></section><section><p className="label">Strategy library</p><h2 className="font-display text-xl font-bold mb-4">Templates</h2><div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{templates.map((item) => <article className="card-glow" key={item.id}><div className="flex justify-between mb-4"><span className="text-gold"><Bot size={18} /></span><span className="text-xs text-muted capitalize">{item.risk_level} risk</span></div><h3 className="font-semibold mb-2">{item.name}</h3><p className="text-sm text-muted min-h-12 mb-4">{item.description}</p><button onClick={() => { setConfiguring(item); setForm({ ...form, template: item, lot_size: item.default_params?.lot_size || 0.1 }); }} className="btn-secondary w-full text-sm">Configure</button></article>)}{!templates.length && <p className="text-sm text-muted">Strategy templates will appear when connected.</p>}</div></section>{configuring && <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 overflow-y-auto"><form onSubmit={(event) => { onCreate(event).then(() => setConfiguring(null)); }} className="card-glow w-full max-w-lg my-auto"><div className="flex justify-between items-center mb-5"><h2 className="font-display font-bold text-lg">Configure {configuring.name}</h2><button type="button" onClick={() => setConfiguring(null)} aria-label="Close"><X size={18} /></button></div><label className="label">Execution mode</label><select className="input mb-4" value={form.execution_mode} onChange={(event) => setForm({ ...form, execution_mode: event.target.value })}><option value="demo">Demo · simulated fills</option><option value="live">Live · broker execution</option></select>{form.execution_mode === 'live' && <><label className="label">Broker connection</label><select className="input mb-4" value={form.broker_connection_id} onChange={(event) => setForm({ ...form, broker_connection_id: event.target.value })}><option value="">Select broker</option>{connections.map((connection) => <option key={connection.id} value={connection.id}>{connection.broker_name} · {connection.platform}</option>)}</select></>}<label className="label">Symbols (comma separated)</label><input className="input mb-4" value={form.symbols} onChange={(event) => setForm({ ...form, symbols: event.target.value })} /><label className="label">Lot size</label><input className="input mb-5" type="number" step="0.01" min="0.01" value={form.lot_size} onChange={(event) => setForm({ ...form, lot_size: event.target.value })} /><div className="flex gap-3"><button type="button" className="btn-secondary flex-1" onClick={() => setConfiguring(null)}>Cancel</button><button className="btn-primary flex-1">Deploy strategy</button></div></form></div>}</>;
}

function BrokerView({ connections, form, setForm, onSubmit, loading, onReload }) {
  async function checkStatus(connection) {
    try {
      const result = await api(`/broker/${connection.id}/status`);
      window.alert(`Status: ${result.connectionStatus}\nBalance: ${result.liveBalance ?? 'n/a'}\nEquity: ${result.liveEquity ?? 'n/a'}`);
      onReload();
    } catch (error) { window.alert(error.message); }
  }

  async function disconnect(connection) {
    if (!window.confirm('Disconnect this broker account?')) return;
    try { await api(`/broker/${connection.id}`, { method: 'DELETE' }); onReload(); }
    catch (error) { window.alert(error.message); }
  }

  return <div className="max-w-4xl"><p className="text-sm text-muted mb-6">Connect your MT4/MT5 account. Credentials are encrypted and are not shown again after submission.</p><form onSubmit={onSubmit} className="card-glow mb-8"><div className="grid sm:grid-cols-2 gap-4"><Field label="Platform"><select className="input" value={form.platform} onChange={(event) => setForm({ ...form, platform: event.target.value })}><option value="mt5">MetaTrader 5</option><option value="mt4">MetaTrader 4</option></select></Field><Field label="Broker name"><input className="input" placeholder="e.g. Exness, XM, HFM" required value={form.broker_name} onChange={(event) => setForm({ ...form, broker_name: event.target.value })} /></Field><Field label="Account login"><input className="input" required value={form.login} onChange={(event) => setForm({ ...form, login: event.target.value })} /></Field><Field label="Account password"><input className="input" type="password" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></Field><Field label="Broker server"><input className="input sm:col-span-2" placeholder="e.g. Broker-MT5Real" required value={form.server} onChange={(event) => setForm({ ...form, server: event.target.value })} /></Field></div><button className="btn-primary w-full mt-5" disabled={loading}>{loading ? 'Connecting...' : 'Connect broker account'}</button></form><div className="flex justify-between items-center mb-3"><h2 className="font-display font-semibold text-lg">Connections</h2><button onClick={onReload} className="text-xs text-cyan">Refresh</button></div><div className="space-y-3">{connections.map((connection) => <div key={connection.id} className="card flex flex-wrap items-center justify-between gap-3"><div><p className="font-semibold">{connection.broker_name} · {connection.platform.toUpperCase()}</p><p className="text-xs text-muted mt-1">Login {connection.login} · {connection.server}</p></div><div className="flex items-center gap-2"><span className={`text-xs ${connection.connection_status === 'connected' ? 'text-gain' : 'text-muted'}`}>{connection.connection_status}</span><button onClick={() => checkStatus(connection)} className="btn-secondary text-xs">Check status</button><button onClick={() => disconnect(connection)} className="text-loss text-xs px-2">Disconnect</button></div></div>)}{!connections.length && <p className="text-sm text-muted">No broker accounts connected.</p>}</div></div>;
}

function LegacyBrokerView({ connections, form, setForm, onSubmit, loading, onReload }) {
  return <div className="max-w-4xl"><p className="text-sm text-muted mb-6">Connect your MT4/MT5 account. Credentials are encrypted and are not shown again after submission.</p><form onSubmit={onSubmit} className="card-glow mb-8"><div className="grid sm:grid-cols-2 gap-4"><Field label="Platform"><select className="input" value={form.platform} onChange={(event) => setForm({ ...form, platform: event.target.value })}><option value="mt5">MetaTrader 5</option><option value="mt4">MetaTrader 4</option></select></Field><Field label="Broker name"><input className="input" placeholder="e.g. Exness, XM, HFM" required value={form.broker_name} onChange={(event) => setForm({ ...form, broker_name: event.target.value })} /></Field><Field label="Account login"><input className="input" required value={form.login} onChange={(event) => setForm({ ...form, login: event.target.value })} /></Field><Field label="Account password"><input className="input" type="password" required value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></Field><Field label="Broker server"><input className="input sm:col-span-2" placeholder="e.g. Broker-MT5Real" required value={form.server} onChange={(event) => setForm({ ...form, server: event.target.value })} /></Field></div><button className="btn-primary w-full mt-5" disabled={loading}>{loading ? 'Connecting...' : 'Connect broker account'}</button></form><div className="flex justify-between items-center mb-3"><h2 className="font-display font-semibold text-lg">Connections</h2><button onClick={onReload} className="text-xs text-cyan">Refresh</button></div><div className="space-y-3">{connections.map((connection) => <div key={connection.id} className="card flex flex-wrap items-center justify-between gap-3"><div><p className="font-semibold">{connection.broker_name} · {connection.platform.toUpperCase()}</p><p className="text-xs text-muted mt-1">Login {connection.login} · {connection.server}</p></div><span className={`text-xs ${connection.connection_status === 'connected' ? 'text-gain' : 'text-muted'}`}>{connection.connection_status}</span></div>)}{!connections.length && <p className="text-sm text-muted">No broker accounts connected.</p>}</div></div>;
}

function AnalyticsView({ data, mode, setMode }) {
  const summary = data?.summary;
  const curve = (data?.equity_curve || []).map((item) => Number(item.running_pnl));
  const symbols = (data?.by_symbol || []).slice(0, 14);
  const winRate = summary ? (Number(summary.wins) / (Number(summary.wins) + Number(summary.losses) || 1) * 100).toFixed(1) : '0.0';
  return <><div className="flex justify-end gap-2 mb-5"><ModeButton value="demo" mode={mode} setMode={setMode} /><ModeButton value="live" mode={mode} setMode={setMode} /></div><div className="grid sm:grid-cols-2 xl:grid-cols-5 gap-3 mb-5"><MetricCard label="Win rate" value={`${winRate}%`} accent="text-gain" /><MetricCard label="Net P&L" value={`$${Number(summary?.net_pnl || 0).toFixed(2)}`} accent={Number(summary?.net_pnl) >= 0 ? 'text-gain' : 'text-loss'} /><MetricCard label="Average P&L" value={`$${Number(summary?.avg_pnl || 0).toFixed(2)}`} accent="text-white" /><MetricCard label="Best trade" value={`$${Number(summary?.best_trade || 0).toFixed(2)}`} accent="text-gain" /><MetricCard label="Worst trade" value={`$${Number(summary?.worst_trade || 0).toFixed(2)}`} accent="text-loss" /></div><section className="card-glow mb-5"><p className="label">Equity curve · {mode}</p><Sparkline values={curve.length ? curve.map((value) => Math.max(2, value - Math.min(...curve) + 2)) : [4, 6, 5, 9, 7, 12, 13, 11, 16, 18, 17, 21]} /></section><section className="card-glow"><p className="label mb-4">P&L by symbol</p><div className="grid sm:grid-cols-2 gap-x-8">{symbols.map((item) => <MetricRow key={item.symbol} label={item.symbol} value={`$${Number(item.pnl).toFixed(2)}`} />)}{!symbols.length && <p className="text-sm text-muted">No closed-trade analytics for this mode yet.</p>}</div></section></>;
}

function JournalView({ entries, form, setForm, onSubmit, onDelete }) {
  return <div className="max-w-4xl"><form onSubmit={onSubmit} className="card-glow mb-7"><div className="grid md:grid-cols-2 gap-4"><Field label="Entry title"><input className="input" required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="What happened or what did you learn?" /></Field><Field label="Sentiment"><select className="input" value={form.sentiment} onChange={(event) => setForm({ ...form, sentiment: event.target.value })}>{['confident', 'uncertain', 'mistake', 'disciplined'].map((value) => <option key={value}>{value}</option>)}</select></Field><Field label="Notes"><textarea className="input md:col-span-2" rows={4} value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} /></Field></div><button className="btn-primary mt-4">Add journal entry</button></form><div className="space-y-3">{entries.map((entry) => <article className="card" key={entry.id}><div className="flex justify-between gap-4"><div><h3 className="font-semibold">{entry.title}</h3>{entry.symbol && <p className="text-xs text-muted mt-1">{entry.symbol} · {entry.direction} · {entry.mode} · P&L {entry.profit ?? '—'}</p>}<p className="text-sm text-muted mt-3 whitespace-pre-line">{entry.notes}</p><span className="inline-block mt-3 text-xs text-gold capitalize">{entry.sentiment}</span></div><button onClick={() => onDelete(entry.id)} className="text-loss text-xs">Delete</button></div></article>)}{!entries.length && <p className="text-sm text-muted">No journal entries yet.</p>}</div></div>;
}

function EducationView({ articles, active, setActive }) {
  return <div className="grid lg:grid-cols-[.8fr_1.2fr] gap-4"><div className="space-y-2">{articles.map((article) => <button key={article.id} onClick={() => setActive(article)} className={`card w-full text-left ${active?.id === article.id ? 'border-gold' : ''}`}><p className="text-[10px] text-gold uppercase mb-1">{article.category}</p><p className="font-semibold">{article.title}</p></button>)}{!articles.length && <p className="text-sm text-muted">Education articles are not available right now.</p>}</div><article className="card min-h-64">{active ? <><h2 className="font-display text-xl font-bold mb-4">{active.title}</h2><p className="text-muted leading-relaxed whitespace-pre-line">{active.content}</p></> : <p className="text-sm text-muted">Choose an article to read.</p>}</article></div>;
}

function ProfileView({ profile, instructions, payments, form, setForm, onSubmit }) {
  return <div className="max-w-4xl space-y-5">{profile && <section className="card"><div className="grid sm:grid-cols-2 gap-5">{[['Full name', profile.full_name], ['Email', `${profile.email} ${profile.email_verified ? '✓' : '(unverified)'}`], ['Phone', `${profile.phone} ${profile.phone_verified ? '✓' : '(unverified)'}`], ['Account status', profile.account_status], ['Subscription', `${profile.subscription_status}${profile.subscription_plan ? ` · ${profile.subscription_plan}` : ''}`], ['Member since', new Date(profile.created_at).toLocaleDateString()]].map(([label, value]) => <div key={label}><p className="text-xs text-muted">{label}</p><p>{value}</p></div>)}</div></section>}<section className="card-glow"><h2 className="font-display font-bold text-lg mb-4">Subscribe or renew via M-Pesa</h2>{instructions?.steps && <ol className="list-decimal ml-5 text-sm text-muted mb-4 space-y-1">{instructions.steps.map((step, index) => <li key={index}>{step}</li>)}</ol>}<form onSubmit={onSubmit} className="grid md:grid-cols-3 gap-3"><select className="input" value={form.plan} onChange={(event) => setForm({ ...form, plan: event.target.value })}>{Object.entries(instructions?.plans || { starter: { label: 'Starter', amount: '—' } }).map(([key, plan]) => <option key={key} value={key}>{plan.label} · KES {plan.amount}</option>)}</select><input className="input" required placeholder="M-Pesa confirmation code" value={form.mpesa_code} onChange={(event) => setForm({ ...form, mpesa_code: event.target.value })} /><input className="input" placeholder="Payer phone" value={form.payer_phone} onChange={(event) => setForm({ ...form, payer_phone: event.target.value })} /><button className="btn-primary md:col-span-3">Submit payment</button></form></section><section className="card"><h2 className="font-semibold mb-3">Payment history</h2>{payments.map((payment) => <div key={payment.id} className="flex justify-between gap-3 border-t border-border py-3 text-sm"><span>{payment.plan} · KES {payment.amount} · {payment.mpesa_code}</span><span className="capitalize text-gold">{payment.status}</span></div>)}{!payments.length && <p className="text-sm text-muted">No payments submitted yet.</p>}</section></div>;
}

function AdminView({ data, tab, setTab, reload }) {
  async function decide(id, decision) {
    const note = decision === 'rejected' ? window.prompt('Reason for rejection (optional):') || '' : '';
    await api(`/payments/${id}/decide`, { method: 'POST', body: { decision, note } }); reload();
  }
  async function setStatus(id, account_status) {
    await api(`/admin/users/${id}/status`, { method: 'PATCH', body: { account_status } }); reload();
  }
  async function uploadImage(event) {
    const file = event.target.files[0]; if (!file) return;
    const formData = new FormData(); formData.append('image', file); formData.append('section', 'general'); formData.append('label', file.name);
    await upload('/content/media/upload', formData); reload();
  }
  const overview = data.overview || {};
  return <><div className="flex gap-2 mb-5 overflow-x-auto">{['overview', 'payments', 'users', 'media'].map((value) => <button key={value} onClick={() => setTab(value)} className={`px-4 py-2 rounded-lg text-sm capitalize ${tab === value ? 'bg-gold text-black' : 'bg-white/5 text-muted'}`}>{value}</button>)}</div>{tab === 'overview' && <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">{[['Total users', overview.total_users], ['Active subscriptions', overview.active_subscriptions], ['Pending payments', overview.pending_payments], ['Live broker connections', overview.live_broker_connections], ['Active strategies', overview.active_strategies], ['Total revenue (KES)', overview.total_revenue]].map(([label, value]) => <MetricCard key={label} label={label} value={value ?? '—'} accent="text-white" />)}</div>}{tab === 'payments' && <div className="space-y-3">{data.pending.map((payment) => <div key={payment.id} className="card flex flex-wrap justify-between items-center gap-3"><div><p className="font-semibold">{payment.full_name} · {payment.email}</p><p className="text-xs text-muted">{payment.plan} · KES {payment.amount} · {payment.mpesa_code} · {payment.payer_phone}</p></div><div className="flex gap-2"><button onClick={() => decide(payment.id, 'approved')} className="btn-primary text-xs">Approve</button><button onClick={() => decide(payment.id, 'rejected')} className="text-loss text-xs px-3">Reject</button></div></div>)}{!data.pending.length && <p className="text-sm text-muted">No pending payments.</p>}</div>}{tab === 'users' && <div className="card overflow-x-auto"><table className="w-full min-w-[680px] text-sm"><thead className="text-muted text-left"><tr>{['Name', 'Email', 'Status', 'Subscription', 'Actions'].map((label) => <th className="pb-3" key={label}>{label}</th>)}</tr></thead><tbody>{data.users.map((user) => <tr className="border-t border-border" key={user.id}><td className="py-3">{user.full_name}</td><td>{user.email}</td><td className="capitalize">{user.account_status}</td><td>{user.subscription_status}</td><td className="space-x-2">{['active', 'suspended', 'banned'].map((status) => <button key={status} onClick={() => setStatus(user.id, status)} className="text-xs text-cyan capitalize">{status}</button>)}</td></tr>)}</tbody></table></div>}{tab === 'media' && <section className="card"><label className="btn-primary inline-flex items-center gap-2 cursor-pointer mb-5">Upload image<input type="file" accept="image/*" className="hidden" onChange={uploadImage} /></label><div className="grid sm:grid-cols-3 xl:grid-cols-4 gap-3">{data.media.map((item) => <div className="border border-border rounded-lg p-2" key={item.id}><img src={item.file_url} alt={item.label || ''} className="w-full h-28 object-cover rounded" /><p className="text-xs text-muted mt-2">{item.section} · {item.label}</p></div>)}</div></section>}</>;
}

function LegalPage({ view }) {
  const [title, paragraphs] = LEGAL[view];
  return <div className="max-w-3xl"><p className="label">KingBot policies</p><h2 className="font-display text-2xl font-bold mb-5">{title}</h2><article className="card space-y-4 text-sm text-muted leading-relaxed">{paragraphs.map((paragraph, index) => <p key={index}><strong className="text-white">{index + 1}. </strong>{paragraph}</p>)}</article></div>;
}

function Field({ label, children }) {
  return <label className="block"><span className="label">{label}</span>{children}</label>;
}