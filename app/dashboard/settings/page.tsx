'use client';

// app/dashboard/settings/page.tsx

import { useState, useEffect } from 'react';
import { Loader2, Save, User, Key, Bell, Shield, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Profile } from '@/types';

export default function SettingsPage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  // Password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile(data);
        setFullName(data.full_name || '');
        setEmail(data.email || '');
      }
      setLoading(false);
    })();
  }, [supabase]);

  const handleSaveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    setSaved(false);

    await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', profile.id);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChangePassword = async () => {
    if (!newPassword) return;
    setPasswordLoading(true);
    setPasswordMsg('');

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setPasswordMsg(error.message);
    } else {
      setPasswordMsg('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
    }
    setPasswordLoading(false);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 max-w-2xl">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 mt-1 text-sm">Manage your account and preferences.</p>
      </div>

      <div className="space-y-6">

        {/* Profile */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 card-shadow">
          <div className="flex items-center gap-2 font-semibold text-slate-900 mb-5">
            <User className="w-4 h-4 text-indigo-600" />
            Profile
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50 text-slate-400 cursor-not-allowed"
              />
              <p className="text-xs text-slate-400 mt-1">Email cannot be changed.</p>
            </div>

            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              {saving
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : saved
                ? <CheckCircle2 className="w-4 h-4" />
                : <Save className="w-4 h-4" />
              }
              {saved ? 'Saved!' : 'Save changes'}
            </button>
          </div>
        </div>

        {/* Password */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 card-shadow">
          <div className="flex items-center gap-2 font-semibold text-slate-900 mb-5">
            <Key className="w-4 h-4 text-indigo-600" />
            Change Password
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">New password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 8 characters"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {passwordMsg && (
              <p className={`text-sm ${passwordMsg.includes('success') ? 'text-emerald-600' : 'text-red-600'}`}>
                {passwordMsg}
              </p>
            )}

            <button
              onClick={handleChangePassword}
              disabled={passwordLoading || !newPassword}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              {passwordLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              Update password
            </button>
          </div>
        </div>

        {/* Plan */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 card-shadow">
          <div className="flex items-center gap-2 font-semibold text-slate-900 mb-5">
            <Shield className="w-4 h-4 text-indigo-600" />
            Plan & Usage
          </div>

          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-semibold text-slate-900 capitalize">{profile?.plan} Plan</p>
              <p className="text-sm text-slate-500 mt-0.5">
                {profile?.analyses_used} of {profile?.analyses_limit} analyses used this month
              </p>
            </div>
            <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold px-3 py-1.5 rounded-full capitalize">
              {profile?.plan}
            </span>
          </div>

          {/* Usage bar */}
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all"
              style={{
                width: `${Math.min(100, ((profile?.analyses_used ?? 0) / (profile?.analyses_limit ?? 50)) * 100)}%`
              }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-2">Resets on the 1st of each month.</p>
        </div>

        {/* Danger zone */}
        <div className="bg-white rounded-2xl border border-red-200 p-6">
          <div className="flex items-center gap-2 font-semibold text-red-600 mb-3">
            <Bell className="w-4 h-4" />
            Danger Zone
          </div>
          <p className="text-sm text-slate-500 mb-4">
            Permanently delete your account and all your data. This cannot be undone.
          </p>
          <button className="text-sm text-red-600 hover:text-red-700 border border-red-200 hover:border-red-300 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors font-medium">
            Delete my account
          </button>
        </div>

      </div>
    </div>
  );
}