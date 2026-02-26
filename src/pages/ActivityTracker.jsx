import React, { useState, useEffect } from 'react';
import { Dumbbell, Moon, Brain, Plus, TrendingUp, Award, X } from 'lucide-react';

const ActivityTracker = () => {
  // State
  const [activities, setActivities] = useState([]);
  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [duration, setDuration] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Weekly stats
  const [weeklyStats, setWeeklyStats] = useState({
    exercise: { current: 0, goal: 300, streak: 0 },
    sleep: { current: 0, goal: 56, streak: 0 },
    meditation: { current: 0, goal: 140, streak: 0 },
  });

  // Activity types configuration
  const activityTypes = [
    {
      id: 'Exercise',
      label: 'Exercise',
      icon: Dumbbell,
      color: 'from-orange-400 to-red-500',
      bgColor: 'from-orange-50 to-red-50',
      unit: 'minutes',
      goal: 300,
    },
    {
      id: 'Sleep',
      label: 'Sleep',
      icon: Moon,
      color: 'from-indigo-400 to-purple-500',
      bgColor: 'from-indigo-50 to-purple-50',
      unit: 'hours',
      goal: 56,
    },
    {
      id: 'Meditation',
      label: 'Meditation',
      icon: Brain,
      color: 'from-emerald-400 to-teal-500',
      bgColor: 'from-emerald-50 to-teal-50',
      unit: 'minutes',
      goal: 140,
    },
  ];

  // Load activities on mount
  useEffect(() => {
    loadActivities();
  }, []);

  // Load activities from backend
  const loadActivities = async () => {
    try {
      const userId = localStorage.getItem('user_id');
      const response = await fetch(`http://localhost:5000/api/activity/${userId}`);
      const data = await response.json();
      
      setActivities(data);
      calculateWeeklyStats(data);
    } catch (error) {
      console.error('Error loading activities:', error);
    }
  };

  // Calculate weekly statistics
  const calculateWeeklyStats = (data) => {
    // Get current week start date (Monday)
    const now = new Date();
    const dayOfWeek = now.getDay();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    weekStart.setHours(0, 0, 0, 0);

    // Filter activities from this week
    const weekActivities = data.filter(activity => {
      const activityDate = new Date(activity.date);
      return activityDate >= weekStart;
    });

    // Calculate totals
    const exerciseTotal = weekActivities
      .filter(a => a.activity === 'Exercise')
      .reduce((sum, a) => sum + a.duration, 0);
    
    const sleepTotal = weekActivities
      .filter(a => a.activity === 'Sleep')
      .reduce((sum, a) => sum + a.duration, 0);
    
    const meditationTotal = weekActivities
      .filter(a => a.activity === 'Meditation')
      .reduce((sum, a) => sum + a.duration, 0);

    // Calculate streaks (days with activity)
    const exerciseStreak = calculateStreak(data, 'Exercise');
    const sleepStreak = calculateStreak(data, 'Sleep');
    const meditationStreak = calculateStreak(data, 'Meditation');

    setWeeklyStats({
      exercise: { current: exerciseTotal, goal: 300, streak: exerciseStreak },
      sleep: { current: sleepTotal, goal: 56, streak: sleepStreak },
      meditation: { current: meditationTotal, goal: 140, streak: meditationStreak },
    });
  };

  // Calculate consecutive days streak
  const calculateStreak = (data, activityType) => {
    const activityDates = data
      .filter(a => a.activity === activityType)
      .map(a => new Date(a.date).toDateString())
      .filter((date, index, self) => self.indexOf(date) === index)
      .sort((a, b) => new Date(b) - new Date(a));

    let streak = 0;
    let currentDate = new Date();

    for (let i = 0; i < activityDates.length; i++) {
      const activityDate = new Date(activityDates[i]);
      const daysDiff = Math.floor((currentDate - activityDate) / (1000 * 60 * 60 * 24));

      if (daysDiff === streak) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  // Open log modal
  const openLogModal = (activity) => {
    setSelectedActivity(activity);
    setDuration('');
    setShowLogModal(true);
  };

  // Save activity
  const handleSaveActivity = async () => {
    if (!duration || duration <= 0) {
      alert('Please enter a valid duration');
      return;
    }

    setIsLoading(true);

    try {
      const userId = localStorage.getItem('user_id');
      
      const response = await fetch('http://localhost:5000/api/activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: parseInt(userId),
          activity: selectedActivity.id,
          duration: parseInt(duration),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowLogModal(false);
        setDuration('');
        await loadActivities();
        alert(`${selectedActivity.label} logged successfully!`);
      } else {
        alert('Failed to save activity');
      }
    } catch (error) {
      console.error('Error saving activity:', error);
      alert('Failed to save activity');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
          Activity Tracker 🎯
        </h1>
        <p className="text-slate-600 text-lg">
          Monitor your physical and mental wellness activities
        </p>
      </div>

      {/* Weekly Summary Card */}
      <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl p-8 shadow-2xl text-white">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">This Week's Progress</h2>
            <p className="text-white/90 text-lg">
              {weeklyStats.exercise.current + weeklyStats.meditation.current > 0 
                ? "Great job! Keep it up!" 
                : "Start logging your activities to track progress!"}
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
            <TrendingUp className="w-8 h-8" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-white/80 text-sm mb-1">Total Exercise</p>
            <p className="text-3xl font-bold">{weeklyStats.exercise.current} min</p>
            <p className="text-white/70 text-sm mt-1">
              {Math.round((weeklyStats.exercise.current / weeklyStats.exercise.goal) * 100)}% of weekly goal
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-white/80 text-sm mb-1">Total Sleep</p>
            <p className="text-3xl font-bold">{weeklyStats.sleep.current} hrs</p>
            <p className="text-white/70 text-sm mt-1">
              {Math.round((weeklyStats.sleep.current / weeklyStats.sleep.goal) * 100)}% of weekly goal
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <p className="text-white/80 text-sm mb-1">Total Meditation</p>
            <p className="text-3xl font-bold">{weeklyStats.meditation.current} min</p>
            <p className="text-white/70 text-sm mt-1">
              {Math.round((weeklyStats.meditation.current / weeklyStats.meditation.goal) * 100)}% of weekly goal
            </p>
          </div>
        </div>
      </div>

      {/* Activity Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {activityTypes.map((activity) => {
          const Icon = activity.icon;
          const stats = weeklyStats[activity.id.toLowerCase()];
          const percentage = Math.round((stats.current / stats.goal) * 100);
          
          return (
            <div
              key={activity.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-slate-200/60 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`bg-gradient-to-br ${activity.color} rounded-xl p-3 shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 bg-orange-50 px-3 py-1 rounded-full">
                  <span className="text-orange-600 font-bold text-sm">{stats.streak}</span>
                  <span className="text-orange-600 text-sm">🔥</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-800 mb-1">{activity.label}</h3>
              <p className="text-slate-600 text-sm mb-4">Weekly goal tracking</p>

              {/* Progress Stats */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-slate-700">
                    {stats.current} {activity.unit}
                  </span>
                  <span className="font-semibold text-slate-500">
                    {stats.goal} {activity.unit}
                  </span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${activity.color} rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                <p className="text-right text-sm font-bold text-slate-700 mt-2">{percentage}%</p>
              </div>

              {/* Remaining Stats */}
              <div className={`bg-gradient-to-br ${activity.bgColor} rounded-xl p-3 border border-slate-100 mb-4`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Remaining</span>
                  <span className="font-bold text-slate-800">
                    {Math.max(0, stats.goal - stats.current)} {activity.unit}
                  </span>
                </div>
              </div>

              {/* Log Button */}
              <button
                onClick={() => openLogModal(activity)}
                className={`w-full bg-gradient-to-r ${activity.color} text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2`}
              >
                <Plus className="w-5 h-5" />
                Log {activity.label}
              </button>
            </div>
          );
        })}
      </div>

      {/* Recent Activities */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-slate-200/60">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Recent Activities</h2>
        
        {activities.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">No activities logged yet</p>
            <p className="text-slate-400">Start tracking your wellness journey!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.slice(0, 10).reverse().map((activity, index) => {
              const activityConfig = activityTypes.find(a => a.id === activity.activity);
              const Icon = activityConfig?.icon || Dumbbell;
              
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className={`bg-gradient-to-br ${activityConfig?.color} rounded-lg p-2`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{activity.activity}</p>
                      <p className="text-sm text-slate-500">
                        {new Date(activity.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-800">
                      {activity.duration} {activityConfig?.unit}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Log Activity Modal */}
      {showLogModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-800">
                Log {selectedActivity?.label}
              </h3>
              <button
                onClick={() => setShowLogModal(false)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-all"
              >
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-3">
                Duration ({selectedActivity?.unit})
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder={`Enter ${selectedActivity?.unit}`}
                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white transition-all duration-300 text-slate-800 placeholder-slate-400 text-lg"
                autoFocus
              />
              <p className="text-xs text-slate-500 mt-2">
                {selectedActivity?.id === 'Sleep' 
                  ? 'Enter total hours of sleep' 
                  : 'Enter duration in minutes'}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSaveActivity}
                disabled={isLoading}
                className={`flex-1 bg-gradient-to-r ${selectedActivity?.color} text-white font-bold py-4 px-6 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
              >
                {isLoading ? 'Saving...' : 'Save Activity'}
              </button>
              <button
                onClick={() => setShowLogModal(false)}
                className="px-6 py-4 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityTracker;
