import React, { useState, useEffect } from 'react';
import { TrendingDown, Heart, Brain, Smile, ArrowUp, Activity, Calendar, Moon, Flame, Wind, BookOpen } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const API = 'http://127.0.0.1:5000/api';

const moodValues     = { happy: 10, neutral: 7, stressed: 4, burnout: 2 };
const moodToWellness = { happy: 85, neutral: 65, stressed: 45, burnout: 25 };

const fmt        = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
const toDateOnly = (d) => (d ? d.split(' ')[0].split('T')[0] : '');
const cap        = (n) => Math.min(Math.round(n), 100);
const ago        = (days) => { const d = new Date(); d.setDate(d.getDate() - days); return d; };

const StatCard = ({ label, value, subtitle, Icon, gradient, trend, trendUp, loading }) => (
  <div className="relative group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-100 overflow-hidden">
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
    <div className="relative z-10">
      <div className="flex items-start justify-between mb-4">
        <div className={`bg-gradient-to-br ${gradient} rounded-xl p-3 shadow-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
          <ArrowUp className={`w-3 h-3 ${!trendUp ? 'rotate-180' : ''}`} />
          {trend}
        </span>
      </div>
      <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-1">{label}</p>
      <p className="text-4xl font-black text-slate-800 leading-none mb-1">
        {loading ? <span className="inline-block w-16 h-9 bg-slate-100 rounded animate-pulse" /> : value}
      </p>
      <p className="text-slate-400 text-xs mt-1">{subtitle}</p>
    </div>
  </div>
);

const SectionHeader = ({ title, sub }) => (
  <div className="mb-5">
    <h2 className="text-xl font-bold text-slate-800">{title}</h2>
    {sub && <p className="text-slate-400 text-sm mt-0.5">{sub}</p>}
  </div>
);

const EmptyState = ({ icon: Icon, message }) => (
  <div className="flex flex-col items-center justify-center h-40 text-slate-300 gap-3">
    <Icon className="w-12 h-12" />
    <p className="text-sm font-medium">{message}</p>
  </div>
);

const ActivitySection = ({ activities, exercises, loading }) => {
  const allItems = [
    ...activities.map(a => ({ name: a.activity,     duration: a.duration, date: a.date, icon: Activity, color: 'from-violet-400 to-purple-500' })),
    ...exercises.map(e  => ({ name: e.exercise_type, duration: e.duration, date: e.date, calories: e.calories, icon: Flame, color: 'from-orange-400 to-rose-500' })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);

  const last7 = [...Array(7)].map((_, i) => {
    const d       = new Date(); d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const label   = d.toLocaleDateString('en-US', { weekday: 'short' });
    const actMins = activities.filter(a => toDateOnly(a.date) === dateStr).reduce((s, a) => s + (a.duration || 0), 0);
    const exMins  = exercises.filter(e  => toDateOnly(e.date) === dateStr).reduce((s, e) => s + (e.duration || 0), 0);
    return { day: label, Activity: actMins, Exercise: exMins };
  });

  const totalMins  = allItems.reduce((s, i) => s + (i.duration || 0), 0);
  const activeDays = last7.filter(d => d.Activity + d.Exercise > 0).length;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100">
      <SectionHeader title="🏃 Activity & Exercise" sub="Combined view of your logged activities and workouts" />
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Total Minutes', value: loading ? '—' : totalMins },
          { label: 'Active Days',   value: loading ? '—' : `${activeDays}/7` },
          { label: 'Sessions',      value: loading ? '—' : allItems.length },
        ].map(({ label, value }) => (
          <div key={label} className="bg-slate-50 rounded-2xl p-3 text-center">
            <p className="text-2xl font-black text-slate-800">{value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>
      {loading ? (
        <div className="h-48 bg-slate-50 rounded-2xl animate-pulse" />
      ) : last7.some(d => d.Activity + d.Exercise > 0) ? (
        <div className="h-48 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last7} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} unit="m" />
              <Tooltip contentStyle={{ background: '#fff', border: 'none', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,.08)', fontSize: 12 }} cursor={{ fill: '#f8fafc' }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#64748b' }} />
              <Bar dataKey="Activity" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Exercise" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <EmptyState icon={Activity} message="No activity data yet — start logging!" />
      )}
      {allItems.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Recent Sessions</p>
          {allItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                <div className={`bg-gradient-to-br ${item.color} rounded-lg p-2`}><Icon className="w-3.5 h-3.5 text-white" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700 truncate">{item.name}</p>
                  <p className="text-xs text-slate-400">{fmt(item.date)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-700">{item.duration}m</p>
                  {item.calories != null && <p className="text-xs text-slate-400">{item.calories} kcal</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const MentalWellnessSection = ({ moods, meditations, sleepLogs, wellnessScore, loading }) => {
  const last7 = [...Array(7)].map((_, i) => {
    const d       = new Date(); d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const label   = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayMoods = moods.filter(m => toDateOnly(m.date) === dateStr);
    const ws = dayMoods.length
      ? Math.round(dayMoods.reduce((s, m) => s + (moodToWellness[m.mood] || 50), 0) / dayMoods.length)
      : null;
    const meditationMins = meditations.filter(m => toDateOnly(m.date) === dateStr).reduce((s, m) => s + (m.duration || 0), 0);
    const sleepHrs       = sleepLogs.filter(s  => toDateOnly(s.date)  === dateStr).reduce((s, sl) => s + (sl.duration || 0), 0);
    return { day: label, Wellness: ws, Meditation: meditationMins || null, Sleep: sleepHrs || null };
  });

  const meditationTotal = meditations.reduce((s, m) => s + (m.duration || 0), 0);
  const avgSleep = sleepLogs.length
    ? (sleepLogs.reduce((s, sl) => s + (sl.duration || 0), 0) / sleepLogs.length).toFixed(1)
    : '—';
  const totalMoodLogs = moods.length;
  const moodBreakdown = ['happy', 'neutral', 'stressed', 'burnout'].map(m => ({
    label: m.charAt(0).toUpperCase() + m.slice(1),
    count: moods.filter(x => x.mood === m).length,
    color: { happy: '#10b981', neutral: '#3b82f6', stressed: '#f97316', burnout: '#ef4444' }[m],
  })).filter(m => m.count > 0);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100">
      <SectionHeader title="🧠 Mental Wellness" sub="Mood trends, meditation practice & sleep quality" />
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Wellness Score',     value: loading ? '—' : `${wellnessScore}%` },
          { label: 'Meditation (total)', value: loading ? '—' : `${meditationTotal}m` },
          { label: 'Avg Sleep',          value: loading ? '—' : `${avgSleep}h` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-slate-50 rounded-2xl p-3 text-center">
            <p className="text-2xl font-black text-slate-800">{value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>
      {loading ? (
        <div className="h-52 bg-slate-50 rounded-2xl animate-pulse mb-6" />
      ) : last7.some(d => d.Wellness !== null) ? (
        <div className="h-52 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={last7}>
              <defs>
                <linearGradient id="wellGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0, 100]} unit="%" />
              <Tooltip contentStyle={{ background: '#fff', border: 'none', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,.08)', fontSize: 12 }} />
              <Area type="monotone" dataKey="Wellness" stroke="#6366f1" strokeWidth={2.5} fill="url(#wellGrad)" connectNulls dot={{ r: 3, fill: '#6366f1' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <EmptyState icon={Brain} message="Log your mood to see wellness trends" />
      )}
      {totalMoodLogs > 0 && (
        <div className="mb-6">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Mood Breakdown</p>
          <div className="space-y-2">
            {moodBreakdown.map(({ label, count, color }) => (
              <div key={label} className="flex items-center gap-3">
                <p className="text-xs font-medium text-slate-600 w-16">{label}</p>
                <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${(count / totalMoodLogs) * 100}%`, background: color }} />
                </div>
                <p className="text-xs text-slate-400 w-6 text-right">{count}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {meditations.slice(0, 4).length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Recent Meditations</p>
          <div className="space-y-2">
            {meditations.slice(0, 4).map((m, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                <div className="bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg p-2"><Wind className="w-3.5 h-3.5 text-white" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700">{m.meditation_type}</p>
                  <p className="text-xs text-slate-400">{m.mood_before && m.mood_after ? `${m.mood_before} → ${m.mood_after}` : fmt(m.date)}</p>
                </div>
                <p className="text-sm font-bold text-indigo-600">{m.duration}m</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {sleepLogs.slice(0, 3).length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Recent Sleep</p>
          <div className="space-y-2">
            {sleepLogs.slice(0, 3).map((s, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                <div className="bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg p-2"><Moon className="w-3.5 h-3.5 text-white" /></div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-700">{s.duration}h sleep</p>
                  <p className="text-xs text-slate-400">{s.bedtime} → {s.wake_time} · {s.quality}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.quality === 'Good' || s.quality === 'Excellent' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                  {s.quality}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Dashboard = ({ onNavigate }) => {
  const [loading,     setLoading]     = useState(true);
  const [moods,       setMoods]       = useState([]);
  const [activities,  setActivities]  = useState([]);
  const [exercises,   setExercises]   = useState([]);
  const [meditations, setMeditations] = useState([]);
  const [sleepLogs,   setSleepLogs]   = useState([]);
  const [journals,    setJournals]    = useState([]);
  const [stats,       setStats]       = useState(null);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    const userId = localStorage.getItem('user_id');
    if (!userId) return;
    setLoading(true);
    try {
      const [moodsRes, activitiesRes, exercisesRes, meditationsRes, sleepRes, journalsRes, statsRes] = await Promise.all([
        fetch(`${API}/moods/${userId}`),
        fetch(`${API}/activity/${userId}`),
        fetch(`${API}/exercises/${userId}`),
        fetch(`${API}/meditations/${userId}`),
        fetch(`${API}/sleep/${userId}`),
        fetch(`${API}/journals/${userId}`),
        fetch(`${API}/stats/${userId}`),
      ]);
      const [moodsData, activitiesData, exercisesData, meditationsData, sleepData, journalsData, statsData] = await Promise.all([
        moodsRes.json(), activitiesRes.json(), exercisesRes.json(),
        meditationsRes.json(), sleepRes.json(), journalsRes.json(), statsRes.json(),
      ]);
      setMoods(Array.isArray(moodsData)         ? moodsData         : []);
      setActivities(Array.isArray(activitiesData)   ? activitiesData    : []);
      setExercises(Array.isArray(exercisesData)     ? exercisesData     : []);
      setMeditations(Array.isArray(meditationsData) ? meditationsData   : []);
      setSleepLogs(Array.isArray(sleepData)         ? sleepData         : []);
      setJournals(Array.isArray(journalsData)       ? journalsData      : []);
      setStats(statsData && !statsData.message      ? statsData         : null);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // ── Derived stats (all computed from raw fetched data) ────────────────────

  // Average mood score across all logged entries
  const moodScore = moods.length
    ? (moods.reduce((s, m) => s + (moodValues[m.mood] || 5), 0) / moods.length).toFixed(1)
    : 0;

  // Mood trend: last 7 days avg vs prior 7 days avg
  const moodTrend = (() => {
    const cut7 = ago(7), cut14 = ago(14);
    const last7 = moods.filter(m => new Date(m.date) >= cut7);
    const prev7 = moods.filter(m => new Date(m.date) >= cut14 && new Date(m.date) < cut7);
    const avg = (arr) => arr.length ? arr.reduce((s, m) => s + (moodValues[m.mood] || 5), 0) / arr.length : null;
    const a = avg(last7), b = avg(prev7);
    if (a === null) return { label: '—', up: true };
    if (b === null || b === 0) return { label: '+0%', up: true };
    const delta = Math.round(((a - b) / b) * 100);
    return { label: `${delta >= 0 ? '+' : ''}${delta}%`, up: delta >= 0 };
  })();

  // Stress level: count stressed/burnout in last 7 entries
  const stressLevel = (() => {
    const last7 = moods.slice(-7);
    const n = last7.filter(m => m.mood === 'stressed' || m.mood === 'burnout').length;
    return n >= 5 ? 'High' : n >= 3 ? 'Medium' : 'Low';
  })();

  // Stress trend: stressed/burnout ratio this week vs last (lower = better = green)
  const stressTrend = (() => {
    const cut7 = ago(7), cut14 = ago(14);
    const last7 = moods.filter(m => new Date(m.date) >= cut7);
    const prev7 = moods.filter(m => new Date(m.date) >= cut14 && new Date(m.date) < cut7);
    const ratio = (arr) => arr.length
      ? arr.filter(m => m.mood === 'stressed' || m.mood === 'burnout').length / arr.length : null;
    const a = ratio(last7), b = ratio(prev7);
    if (a === null) return { label: '—', up: true };
    if (b === null) return { label: '0%', up: true };
    const delta = Math.round((a - b) * 100);
    return { label: `${delta >= 0 ? '+' : ''}${delta}%`, up: delta <= 0 };
  })();

  // Activity score: BOTH Activity + Exercise tables, last 7 days, vs 300-min goal
  const activityScore = (() => {
    const cutoff  = ago(7);
    const exMins  = exercises.filter(e => new Date(e.date) >= cutoff).reduce((s, e) => s + (e.duration || 0), 0);
    const actMins = activities.filter(a => new Date(a.date) >= cutoff).reduce((s, a) => s + (a.duration || 0), 0);
    return cap(Math.round(((exMins + actMins) / 300) * 100));
  })();

  // Wellness score: average of activity + sleep + meditation percentages
  const sleepScore      = stats ? cap(stats.sleep.percentage)      : 0;
  const meditationScore = stats ? cap(stats.meditation.percentage) : 0;
  const wellnessScore   = cap(Math.round((activityScore + sleepScore + meditationScore) / 3));

  // Wellness trend: mood-derived wellness score this week vs last
  const wellnessTrend = (() => {
    const cut7 = ago(7), cut14 = ago(14);
    const thisW = moods.filter(m => new Date(m.date) >= cut7);
    const prevW = moods.filter(m => new Date(m.date) >= cut14 && new Date(m.date) < cut7);
    const wScore = (arr) => arr.length
      ? Math.round(arr.reduce((s, m) => s + (moodToWellness[m.mood] || 50), 0) / arr.length) : null;
    const a = wScore(thisW), b = wScore(prevW);
    if (a === null || b === null || b === 0) return { label: '+0%', up: true };
    const delta = Math.round(((a - b) / b) * 100);
    return { label: `${delta >= 0 ? '+' : ''}${delta}%`, up: delta >= 0 };
  })();

  // Activity trend: combined minutes this week vs last week
  const activityTrend = (() => {
    const cut7 = ago(7), cut14 = ago(14);
    const sumRange = (arr, from, to) =>
      arr.filter(x => { const d = new Date(x.date); return d >= from && (!to || d < to); })
         .reduce((s, x) => s + (x.duration || 0), 0);
    const thisWeek = sumRange(exercises, cut7) + sumRange(activities, cut7);
    const prevWeek = sumRange(exercises, cut14, cut7) + sumRange(activities, cut14, cut7);
    if (prevWeek === 0 && thisWeek === 0) return { label: '—', up: true };
    if (prevWeek === 0) return { label: '+100%', up: true };
    const delta = Math.round(((thisWeek - prevWeek) / prevWeek) * 100);
    return { label: `${delta >= 0 ? '+' : ''}${delta}%`, up: delta >= 0 };
  })();

  // Unique active days all time
  const totalActiveDays = [...new Set([
    ...activities.map(a => toDateOnly(a.date)),
    ...exercises.map(e  => toDateOnly(e.date)),
  ])].filter(Boolean).length;

  const statCards = [
    {
      label: 'Mood Score', value: `${moodScore}/10`,
      subtitle: moodScore >= 7 ? 'Feeling great!' : moodScore >= 5 ? 'Steady on' : 'Needs care',
      Icon: Smile, gradient: 'from-amber-400 to-orange-500',
      trend: moodTrend.label, trendUp: moodTrend.up,
    },
    {
      label: 'Stress Level', value: stressLevel,
      subtitle: stressLevel === 'Low' ? 'Keep it up!' : stressLevel === 'Medium' ? 'Watch yourself' : 'Take a break',
      Icon: TrendingDown,
      gradient: stressLevel === 'Low' ? 'from-emerald-400 to-teal-500' : stressLevel === 'Medium' ? 'from-amber-400 to-orange-500' : 'from-rose-400 to-red-500',
      trend: stressTrend.label, trendUp: stressTrend.up,
    },
    {
      label: 'Mental Wellness', value: `${wellnessScore}%`,
      subtitle: wellnessScore >= 70 ? 'Thriving' : wellnessScore >= 50 ? 'In progress' : 'Start small',
      Icon: Brain, gradient: 'from-indigo-400 to-violet-500',
      trend: wellnessTrend.label, trendUp: wellnessTrend.up,
    },
    {
      label: 'Activity Score', value: `${activityScore}%`,
      subtitle: activityScore >= 70 ? 'Very active!' : activityScore >= 40 ? 'Almost there' : "Let's move!",
      Icon: Heart, gradient: 'from-pink-400 to-rose-500',
      trend: activityTrend.label, trendUp: activityTrend.up,
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-800 mb-1">WellnessHub 👋</h1>
          <p className="text-slate-400 text-base">Here's your full wellness snapshot</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Today</p>
          <p className="text-lg font-bold text-slate-700">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-8 shadow-2xl">
        <div className="absolute -top-10 -right-10 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="relative z-10">
          <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full">💡 Daily Insight</span>
          <h2 className="text-3xl font-black text-white mt-4 mb-2">Your Mental Health Matters</h2>
          <p className="text-white/80 text-base mb-6 max-w-xl leading-relaxed">
            {loading
              ? 'Loading your wellness data…'
              : `${journals.length} journal ${journals.length === 1 ? 'entry' : 'entries'} · Wellness score ${wellnessScore}% · ${meditations.length} meditation ${meditations.length === 1 ? 'session' : 'sessions'} logged. Keep going! 🌱`}
          </p>
          <div className="flex gap-3 flex-wrap">
            <button onClick={() => onNavigate?.('wellness')} className="bg-white text-indigo-600 font-bold text-sm px-5 py-2.5 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200">Explore Resources</button>
            <button onClick={() => onNavigate?.('mood')} className="bg-white/20 backdrop-blur-sm text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-white/30 transition-all duration-200">Track Mood</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((s, i) => <StatCard key={i} {...s} loading={loading} />)}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ActivitySection activities={activities} exercises={exercises} loading={loading} />
        <MentalWellnessSection
          moods={moods} meditations={meditations} sleepLogs={sleepLogs}
          wellnessScore={wellnessScore} loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Journal Entries',        value: loading ? '…' : journals.length,     Icon: BookOpen, color: 'from-blue-50 to-indigo-50 border-blue-100' },
          { label: 'Wellness Goal',           value: loading ? '…' : `${wellnessScore}%`, Icon: Brain,    color: 'from-emerald-50 to-teal-50 border-emerald-100' },
          { label: 'Active Days (all time)',  value: loading ? '…' : totalActiveDays,     Icon: Calendar, color: 'from-amber-50 to-orange-50 border-amber-100' },
          { label: 'Meditation Sessions',     value: loading ? '…' : meditations.length,  Icon: Wind,     color: 'from-purple-50 to-pink-50 border-purple-100' },
        ].map(({ label, value, Icon, color }) => (
          <div key={label} className={`bg-gradient-to-br ${color} border rounded-2xl p-5 flex items-center gap-4`}>
            <Icon className="w-6 h-6 text-slate-400 shrink-0" />
            <div>
              <p className="text-2xl font-black text-slate-800">{value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;