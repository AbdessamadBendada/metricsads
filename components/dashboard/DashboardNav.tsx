'use client';

// components/dashboard/DashboardNav.tsx

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Sparkles, LayoutDashboard, History, Settings,
  LogOut, ChevronRight,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/types';

interface DashboardNavProps {
  profile: Profile | null;
}

export default function DashboardNav({ profile }: DashboardNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'New Analysis' },
    { href: '/dashboard/history', icon: History, label: 'History' },
    { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-100 flex flex-col z-40">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-100">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-semibold text-slate-900 text-sm leading-tight">MetaMetrics AI</p>
            <p className="text-xs text-slate-400 leading-tight">Ads Intelligence</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon className={`w-4 h-4 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User + sign out */}
      <div className="p-3 border-t border-slate-100">
        {/* Usage bar */}
        {profile && (
          <div className="bg-slate-50 rounded-xl p-3 mb-2">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-slate-500">Free tier usage</span>
              <span className="text-xs font-semibold text-slate-700">
                {profile.analyses_used} / {profile.analyses_limit}
              </span>
            </div>
            <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all"
                style={{ width: `${Math.min(100, (profile.analyses_used / profile.analyses_limit) * 100)}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
          <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-indigo-700">
              {profile?.full_name?.[0]?.toUpperCase() ?? profile?.email?.[0]?.toUpperCase() ?? 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-900 truncate">
              {profile?.full_name || 'User'}
            </p>
            <p className="text-xs text-slate-400 truncate">{profile?.email}</p>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}