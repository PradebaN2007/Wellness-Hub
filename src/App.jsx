import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Heart, 
  BookOpen, 
  Activity, 
  MessageSquare, 
  Headphones,
  Bot
} from 'lucide-react';

import Dashboard from './pages/Dashboard';
import MoodTracker from './pages/MoodTracker';
import WellnessResources from './pages/WellnessResources';
import ActivityTracker from './pages/ActivityTracker';
import Feedback from './pages/Feedback';
import Support from './pages/Support';
import AIChatbot from './pages/AIChatbot';
import Appointment from './pages/Appointment';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Sidebar from './components/Sidebar';
import ChatbotDrawer from './components/ChatbotDrawer';
import ProfileEditModal from './components/ProfileEditModal';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const saved = localStorage.getItem('isLoggedIn');
    return saved === 'true';
  });

  const [showSignup, setShowSignup] = useState(false);

  // ✅ merged user persistence
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // ✅ ur features
  const [chatOpen, setChatOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // ✅ teammate appointment feature
  const [appointmentCounselorId, setAppointmentCounselorId] = useState(null);

  // save login + user
  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn.toString());

    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [isLoggedIn, user]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'mood', label: 'Mood Tracker', icon: Heart },
    { id: 'wellness', label: 'Wellness Resources', icon: BookOpen },
    { id: 'activity', label: 'Activity Tracker', icon: Activity },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
    { id: 'chatbot', label: 'AI Chatbot', icon: Bot },
    { id: 'support', label: 'Support', icon: Headphones },
  ];

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    setShowSignup(false);
  };

  const handleSignup = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    setShowSignup(false);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setShowSignup(false);
    setCurrentPage('dashboard');
    setChatOpen(false);
    setProfileOpen(false);

    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
  };

  const switchToSignup = () => setShowSignup(true);
  const switchToLogin = () => setShowSignup(false);

  const navigateToAppointment = (counselorId) => {
    setAppointmentCounselorId(counselorId);
    setCurrentPage('appointment');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard user={user} onNavigate={setCurrentPage} />;
      case 'mood': return <MoodTracker user={user} />;
      case 'wellness': return <WellnessResources user={user} />;
      case 'activity': return <ActivityTracker user={user} />;
      case 'feedback': return <Feedback user={user} />;
      case 'chatbot': return <AIChatbot user={user} />;
      case 'support':
        return (
          <Support
            user={user}
            onNavigateToAppointment={navigateToAppointment}
          />
        );
      case 'appointment':
        return (
          <Appointment
            counselorId={appointmentCounselorId}
            onBack={() => setCurrentPage('support')}
          />
        );
      default:
        return <Dashboard user={user} />;
    }
  };

  if (!isLoggedIn && showSignup) {
    return <Signup onSignup={handleSignup} onSwitchToLogin={switchToLogin} />;
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} onSwitchToSignup={switchToSignup} />;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 overflow-hidden">
      
      <Sidebar 
        navItems={navItems}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        user={user}
        onLogout={handleLogout}
        onOpenChat={() => setChatOpen(true)}
        onOpenProfile={() => setProfileOpen(true)}
      />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          {renderPage()}
        </div>
      </main>

      <ChatbotDrawer
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        user={user}
      />

      {profileOpen && (
        <ProfileEditModal
          user={user}
          onClose={() => setProfileOpen(false)}
          onSave={(updatedUser) => setUser(updatedUser)}
        />
      )}
    </div>
  );
}

export default App;
