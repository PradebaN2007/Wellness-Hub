import React, { useState, useEffect } from 'react';
import { X, User, Mail, Lock, Camera, Save, Loader2 } from 'lucide-react';

const ProfileEditModal = ({ user, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    bio: '',
    avatar_color: 'blue',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const colorOptions = [
    { id: 'blue', from: 'from-blue-400', to: 'to-indigo-500', hex: '#60a5fa' },
    { id: 'emerald', from: 'from-emerald-400', to: 'to-teal-500', hex: '#34d399' },
    { id: 'rose', from: 'from-rose-400', to: 'to-pink-500', hex: '#fb7185' },
    { id: 'amber', from: 'from-amber-400', to: 'to-orange-500', hex: '#fbbf24' },
    { id: 'violet', from: 'from-violet-400', to: 'to-purple-500', hex: '#a78bfa' },
  ];

  useEffect(() => {
    if (user) {
      setForm(f => ({
        ...f,
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        avatar_color: user.avatar_color || 'blue',
      }));
    }
  }, [user]);

  const handleSubmit = async () => {
    setError('');
    if (form.password && form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        user_id: user.id,
        name: form.name,
        email: form.email,
        bio: form.bio,
        avatar_color: form.avatar_color,
      };
      if (form.password) payload.password = form.password;

      const res = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');
      setSuccess('Profile updated successfully!');
      onSave({ ...user, ...payload });
      setTimeout(onClose, 1200);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedColor = colorOptions.find(c => c.id === form.avatar_color) || colorOptions[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Top gradient bar */}
        <div className={`h-1.5 w-full bg-gradient-to-r ${selectedColor.from} ${selectedColor.to}`} />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Edit Profile</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Avatar color picker */}
          <div className="flex flex-col items-center gap-3">
            <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${selectedColor.from} ${selectedColor.to} flex items-center justify-center shadow-lg`}>
              <User className="w-10 h-10 text-white" />
            </div>
            <div className="flex items-center gap-2">
              {colorOptions.map(c => (
                <button
                  key={c.id}
                  onClick={() => setForm(f => ({ ...f, avatar_color: c.id }))}
                  className={`w-7 h-7 rounded-full bg-gradient-to-br ${c.from} ${c.to} transition-all duration-200 ${form.avatar_color === c.id ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'hover:scale-105'}`}
                />
              ))}
            </div>
            <p className="text-xs text-slate-400">Choose avatar color</p>
          </div>

          {/* Name */}
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                placeholder="Your name"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                placeholder="your@email.com"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Bio <span className="font-normal text-slate-400">(optional)</span></label>
            <textarea
              value={form.bio}
              onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              rows={2}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition resize-none"
              placeholder="A little about yourself..."
            />
          </div>

          {/* New Password */}
          <div>
            <label className="text-xs font-semibold text-slate-600 mb-1 block">New Password <span className="font-normal text-slate-400">(leave blank to keep current)</span></label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                placeholder="New password"
              />
            </div>
          </div>

          {form.password && (
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                  placeholder="Confirm password"
                />
              </div>
            </div>
          )}

          {error && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
          {success && <p className="text-xs text-emerald-600 bg-emerald-50 rounded-lg px-3 py-2">{success}</p>}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`flex-1 py-2.5 bg-gradient-to-r ${selectedColor.from} ${selectedColor.to} text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition shadow-md`}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditModal;