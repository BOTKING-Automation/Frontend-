'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, User, LineChart, TrendingUp, Link2, BookOpen, GraduationCap, ScrollText, Shield, LogOut, Activity } from 'lucide-react';
import { clearToken } from '../lib/api';

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/markets', label: 'Live Markets', icon: LineChart },
  { href: '/strategies', label: 'Strategies', icon: TrendingUp },
  { href: '/broker', label: 'Broker Connection', icon: Link2 },
  { href: '/analytics', label: 'Analytics', icon: Activity },
  { href: '/journal', label: 'Journal', icon: BookOpen },
  { href: '/education', label: 'Education', icon: GraduationCap },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/legal/terms', label: 'Legal', icon: ScrollText },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="w-64 glass-nav h-screen sticky top-0 flex flex-col z-40">
      <div className="px-5 py-6 flex items-center gap-2.5">
        <div className="relative">
          <Shield className="text-gold relative z-10" size={26} />
          <div className="absolute inset-0 bg-gold/40 blur-lg rounded-full" />
        </div>
        <span className="font-display text-xl font-bold text-white tracking-tight">
          King<span className="text-gold">Bot</span>
        </span>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 relative overflow-hidden ${
                active ? 'text-cyan bg-cyan/10 shadow-glow' : 'text-muted hover:bg-panel2 hover:text-white'
              }`}
            >
              {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 bg-cyan rounded-full" />}
              <Icon size={18} className={active ? 'text-cyan' : 'group-hover:text-cyan/80'} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mx-3 mb-3 px-3 py-2.5 rounded-xl bg-panel2 border border-border flex items-center gap-2 text-xs text-muted">
        <span className="w-2 h-2 rounded-full bg-gain animate-pulse" />
        Engine online
      </div>

      <button
        onClick={() => { clearToken(); router.push('/login'); }}
        className="mx-3 mb-5 flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted hover:text-loss hover:bg-panel2 transition"
      >
        <LogOut size={18} /> Log out
      </button>
    </aside>
  );
}
