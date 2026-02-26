import React, { useState, useEffect } from 'react';
import { Calendar, BookOpen, Save, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// ─── constants ───────────────────────────────────────────────────────────────
const moodScore = { happy: 4, neutral: 3, stressed: 2, burnout: 1 };
const moodColor = {
  happy:   '#10b981',
  neutral: '#3b82f6',
  stressed:'#f59e0b',
  burnout: '#f43f5e',
};
const moodLabel = {
  4: '😊 Happy',
  3: '😐 Neutral',
  2: '😰 Stressed',
  1: '😞 Burnout',
};

const moods = [
  { id: 'happy',    label: 'Happy',    emoji: '😊', color: 'from-emerald-400 to-green-500',  bgColor: 'bg-emerald-50'  },
  { id: 'neutral',  label: 'Neutral',  emoji: '😐', color: 'from-blue-400 to-cyan-500',      bgColor: 'bg-blue-50'     },
  { id: 'stressed', label: 'Stressed', emoji: '😰', color: 'from-orange-400 to-amber-500',   bgColor: 'bg-orange-50'   },
  { id: 'burnout',  label: 'Burnout',  emoji: '😞', color: 'from-rose-400 to-red-500',       bgColor: 'bg-rose-50'     },
];

// ─── helper: defined at module level so it's always available ────────────────
const getMoodEmoji = (mood) => moods.find(m => m.id === mood)?.emoji || '😐';

// FIX: format "2024-01-15 14:30" → "Jan 15" for clean axis labels
const formatDateLabel = (dateStr) => {
  if (!dateStr) return '';
  try {
    // backend sends "YYYY-MM-DD HH:MM" — replace space with T for safe parsing
    const d = new Date(dateStr.replace(' ', 'T'));
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return dateStr.slice(0, 10);
  }
};

// ─── chart custom components ─────────────────────────────────────────────────
const CustomDot = (props) => {
  const { cx, cy, payload } = props;
  if (cx === undefined || cy === undefined) return null;
  const color = moodColor[payload.mood] || '#38bdf8';
  return <circle cx={cx} cy={cy} r={8} fill={color} stroke="#fff" strokeWidth={2.5} />;
};

const CustomActiveDot = (props) => {
  const { cx, cy, payload } = props;
  if (cx === undefined || cy === undefined) return null;
  const color = moodColor[payload.mood] || '#38bdf8';
  return <circle cx={cx} cy={cy} r={11} fill={color} stroke="#fff" strokeWidth={3} opacity={0.9} />;
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { mood, date } = payload[0].payload;
    const color = moodColor[mood] || '#38bdf8';
    const score = payload[0].value;
    return (
      <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-xl">
        <p className="text-slate-400 text-xs mb-1">{formatDateLabel(date)}</p>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
          <p className="text-slate-800 font-bold text-sm">{moodLabel[score]}</p>
        </div>
      </div>
    );
  }
  return null;
};

// ─── main component ───────────────────────────────────────────────────────────
const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodHistory, setMoodHistory] = useState([]);
  const [journalText, setJournalText] = useState('');
  const [journals, setJournals] = useState([]);
  const [expandedJournal, setExpandedJournal] = useState(null);
  const [moodCounts, setMoodCounts] = useState({ happy: 0, neutral: 0, stressed: 0, burnout: 0 });
  const [isSavingMood, setIsSavingMood] = useState(false);
  const [isSavingJournal, setIsSavingJournal] = useState(false);
  const [activeTab, setActiveTab] = useState('mood');

  const journalPrompts = [
    "What made you smile today?",
    "What's one thing you're grateful for?",
    "What challenged you today and how did you handle it?",
    "What are you looking forward to tomorrow?",
    "How did you take care of yourself today?",
  ];
  const [currentPrompt] = useState(
    journalPrompts[Math.floor(Math.random() * journalPrompts.length)]
  );

  useEffect(() => {
    fetchMoods();
    fetchJournals();
  }, []);

  const fetchMoods = async () => {
    const userId = localStorage.getItem('user_id');
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/moods/${userId}`);
      const data = await res.json();

      const counts = { happy: 0, neutral: 0, stressed: 0, burnout: 0 };

      // FIX: map to cleaned date labels for the chart
      const lineData = data.map((entry) => {
        if (counts[entry.mood] !== undefined) counts[entry.mood] += 1;
        return {
          date: entry.date,                          // raw, used in tooltip
          label: formatDateLabel(entry.date),        // clean label for XAxis
          score: moodScore[entry.mood] || 3,
          mood: entry.mood,
        };
      });

      setMoodHistory(lineData);
      setMoodCounts(counts);
    } catch (error) {
      console.error('Error fetching moods:', error);
    }
  };

  const fetchJournals = async () => {
    const userId = localStorage.getItem('user_id');
    try {
      const res = await fetch(`http://127.0.0.1:5000/api/journals/${userId}`);
      const data = await res.json();
      setJournals(data);
    } catch (error) {
      console.error('Error fetching journals:', error);
    }
  };

  const saveMood = async () => {
    if (!selectedMood) { alert('Select a mood first!'); return; }
    setIsSavingMood(true);
    try {
      await fetch('http://127.0.0.1:5000/api/moods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: parseInt(localStorage.getItem('user_id')),
          mood: selectedMood,
          note: '',
        }),
      });
      await fetchMoods();
      setSelectedMood(null);
      alert('Mood saved! ✅');
    } catch (error) {
      alert('Error saving mood');
    } finally {
      setIsSavingMood(false);
    }
  };

  const saveJournal = async () => {
    if (!journalText.trim()) { alert('Write something first!'); return; }
    setIsSavingJournal(true);
    try {
      await fetch('http://127.0.0.1:5000/api/journals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: parseInt(localStorage.getItem('user_id')),
          content: journalText,
          mood: selectedMood || 'neutral',
        }),
      });
      setJournalText('');
      setSelectedMood(null);
      await fetchJournals();
      alert('Journal saved! ✅');
    } catch (error) {
      alert('Error saving journal');
    } finally {
      setIsSavingJournal(false);
    }
  };

  const deleteJournal = async (journalId) => {
    if (!window.confirm('Delete this journal entry?')) return;
    try {
      await fetch(`http://127.0.0.1:5000/api/journals/${journalId}`, { method: 'DELETE' });
      await fetchJournals();
    } catch (error) {
      alert('Error deleting journal');
    }
  };

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
          Mood Tracker 💭
        </h1>
        <p className="text-slate-600 text-lg">Track your emotions and write your daily journal</p>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('mood')}
          className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
            activeTab === 'mood' ? 'bg-white text-slate-800 shadow-md' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          😊 Mood Log
        </button>
        <button
          onClick={() => setActiveTab('journal')}
          className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
            activeTab === 'journal' ? 'bg-white text-slate-800 shadow-md' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          📓 Journal ({journals.length})
        </button>
      </div>

      {/* ══════════ MOOD TAB ══════════ */}
      {activeTab === 'mood' && (
        <>
          {/* Mood Selection */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-slate-200/60">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl p-2.5">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">How are you feeling today?</h2>
                <p className="text-slate-500 text-sm">Select your current mood to track your journey</p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {moods.map((mood) => {
                const isSelected = selectedMood === mood.id;
                return (
                  <button
                    key={mood.id}
                    onClick={() => setSelectedMood(mood.id)}
                    className={`relative group p-6 rounded-2xl transition-all duration-300 border-2
                      ${isSelected
                        ? `bg-gradient-to-br ${mood.color} shadow-2xl scale-105 border-white`
                        : `${mood.bgColor} hover:scale-105 hover:shadow-xl border-transparent`
                      }`}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <span className={`text-5xl transition-transform duration-300 ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`}>
                        {mood.emoji}
                      </span>
                      <p className={`font-bold text-lg ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                        {mood.label}
                      </p>
                    </div>
                    {isSelected && <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse" />}
                  </button>
                );
              })}
            </div>

            {selectedMood && (
              <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-2xl p-6 border border-blue-100">
                <p className="text-slate-700 mb-4 font-medium">
                  You selected <strong>{getMoodEmoji(selectedMood)} {moods.find(m => m.id === selectedMood)?.label}</strong>. Ready to log it?
                </p>
                <div className="flex gap-3 flex-wrap">
                  <button
                    onClick={saveMood}
                    disabled={isSavingMood}
                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-400 to-blue-500 text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {isSavingMood ? 'Saving...' : 'Save Mood'}
                  </button>
                  <button
                    onClick={() => setActiveTab('journal')}
                    className="flex items-center gap-2 bg-white text-slate-700 font-semibold px-6 py-3 rounded-xl hover:shadow-lg transition-all border border-slate-200"
                  >
                    <BookOpen className="w-4 h-4" />
                    Write in Journal
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* LINE CHART — FIX: dataKey="label" for XAxis */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-slate-200/60">
            <h2 className="text-2xl font-bold text-slate-800 mb-1">Your Mood Journey</h2>
            <p className="text-slate-500 mb-4">Mood trend over time — dots change color per mood</p>

            {/* Legend */}
            <div className="flex gap-5 mb-6 flex-wrap">
              {[
                { label: 'Happy',    color: 'bg-emerald-500', text: 'text-emerald-600' },
                { label: 'Neutral',  color: 'bg-blue-500',    text: 'text-blue-600'    },
                { label: 'Stressed', color: 'bg-orange-400',  text: 'text-orange-500'  },
                { label: 'Burnout',  color: 'bg-rose-500',    text: 'text-rose-500'    },
              ].map(({ label, color, text }) => (
                <span key={label} className={`flex items-center gap-2 text-sm font-semibold ${text}`}>
                  <span className={`w-4 h-4 rounded-full ${color} inline-block border-2 border-white shadow`} />
                  {label}
                </span>
              ))}
            </div>

            {moodHistory.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                <p className="text-4xl mb-3">📈</p>
                <p className="text-lg">No mood data yet! Start tracking above 👆</p>
              </div>
            ) : (
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={moodHistory}
                    margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                    {/* FIX: use "label" key (formatted date) not raw "date" */}
                    <XAxis
                      dataKey="label"
                      stroke="#94a3b8"
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      domain={[1, 4]}
                      ticks={[1, 2, 3, 4]}
                      stroke="#94a3b8"
                      tick={{ fontSize: 13 }}
                      tickLine={false}
                      tickFormatter={(v) => (['', '😞', '😰', '😐', '😊'][v] || '')}
                      width={36}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#38bdf8"
                      strokeWidth={3}
                      dot={<CustomDot />}
                      activeDot={<CustomActiveDot />}
                      name="Mood"
                      isAnimationActive={true}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Mood Count Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {[
                { key: 'happy',    label: 'Happy',    emoji: '😊', bg: 'bg-emerald-50 border-emerald-100', dot: 'bg-emerald-500', text: 'text-emerald-700' },
                { key: 'neutral',  label: 'Neutral',  emoji: '😐', bg: 'bg-blue-50 border-blue-100',       dot: 'bg-blue-500',    text: 'text-blue-700'    },
                { key: 'stressed', label: 'Stressed', emoji: '😰', bg: 'bg-orange-50 border-orange-100',   dot: 'bg-orange-400',  text: 'text-orange-600'  },
                { key: 'burnout',  label: 'Burnout',  emoji: '😞', bg: 'bg-rose-50 border-rose-100',       dot: 'bg-rose-500',    text: 'text-rose-600'    },
              ].map((item) => (
                <div key={item.key} className={`${item.bg} rounded-xl p-4 border`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 ${item.dot} rounded-full`} />
                    <span className={`text-sm font-semibold ${item.text}`}>{item.label}</span>
                  </div>
                  <p className="text-3xl mb-1">{item.emoji}</p>
                  <p className="text-2xl font-bold text-slate-800">{moodCounts[item.key]}</p>
                  <p className="text-xs text-slate-500">Total logged</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ══════════ JOURNAL TAB ══════════ */}
      {activeTab === 'journal' && (
        <>
          {/* Write Journal */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-slate-200/60">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-violet-400 to-purple-500 rounded-xl p-2.5">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Daily Journal</h2>
                <p className="text-slate-500 text-sm">Your private space to express thoughts</p>
              </div>
            </div>

            {/* Mood Picker */}
            <div className="mb-5">
              <p className="text-sm font-semibold text-slate-700 mb-2">Current mood (optional)</p>
              <div className="flex gap-2 flex-wrap">
                {moods.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => setSelectedMood(selectedMood === mood.id ? null : mood.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      selectedMood === mood.id
                        ? `bg-gradient-to-r ${mood.color} text-white shadow-lg scale-105`
                        : `${mood.bgColor} text-slate-700 hover:scale-105`
                    }`}
                  >
                    {mood.emoji} {mood.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt */}
            <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-4 mb-4 border border-violet-100">
              <p className="text-xs text-violet-600 font-semibold uppercase tracking-wider">✨ Today's Prompt</p>
              <p className="text-slate-700 mt-1 italic text-base">"{currentPrompt}"</p>
            </div>

            {/* Textarea */}
            <textarea
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              placeholder="Pour your heart out here... This is your safe space 💙"
              rows={8}
              className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-purple-400 focus:bg-white transition-all duration-300 text-slate-800 placeholder-slate-400 text-base resize-none"
            />

            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-slate-400">{journalText.length} characters</p>
              <button
                onClick={saveJournal}
                disabled={isSavingJournal || !journalText.trim()}
                className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold px-8 py-3 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {isSavingJournal ? 'Saving...' : 'Save Journal'}
              </button>
            </div>
          </div>

          {/* Past Journals */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-slate-200/60">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              📚 My Journal Entries ({journals.length})
            </h2>

            {journals.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-5xl mb-4">📓</p>
                <p className="text-slate-500 text-lg font-medium">No journal entries yet!</p>
                <p className="text-slate-400 text-sm mt-1">Write your first entry above ✍️</p>
              </div>
            ) : (
              <div className="space-y-3">
                {journals.map((journal) => (
                  <div key={journal.id} className="border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300">
                    <div
                      className="flex items-center justify-between p-5 cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors"
                      onClick={() => setExpandedJournal(expandedJournal === journal.id ? null : journal.id)}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: moodColor[journal.mood] || '#94a3b8' }}
                        />
                        <span className="text-xl flex-shrink-0">{getMoodEmoji(journal.mood)}</span>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 truncate">
                            {journal.content.substring(0, 70)}{journal.content.length > 70 ? '...' : ''}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">{formatDateLabel(journal.date)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteJournal(journal.id); }}
                          className="p-2 hover:bg-red-100 rounded-lg text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {expandedJournal === journal.id
                          ? <ChevronUp className="w-5 h-5 text-slate-400" />
                          : <ChevronDown className="w-5 h-5 text-slate-400" />
                        }
                      </div>
                    </div>
                    {expandedJournal === journal.id && (
                      <div className="p-5 bg-white border-t border-slate-100">
                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-base">{journal.content}</p>
                        <div className="mt-4 flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: moodColor[journal.mood] || '#94a3b8' }} />
                          <span className="text-xs font-semibold" style={{ color: moodColor[journal.mood] }}>
                            {getMoodEmoji(journal.mood)} {journal.mood}
                          </span>
                          <span className="text-xs text-slate-400">{formatDateLabel(journal.date)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MoodTracker;
