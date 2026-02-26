import React, { useState } from 'react';
import { Sparkles, LogOut, User, MessageCircle } from 'lucide-react';

const Sidebar = ({ navItems, currentPage, setCurrentPage, user, onLogout, onOpenChat, onOpenProfile }) => {
  return (
    <aside className="w-72 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 shadow-xl flex flex-col">
      {/* Header */}
      <div className="p-8 border-b border-slate-200/60">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Wellness Hub
            </h1>
            <p className="text-xs text-slate-500 font-medium"></p>
          </div>
        </div>
      </div>

      {/* User Profile — clickable to edit */}
      {user && (
        <div className="px-6 py-4 border-b border-slate-200/60">
          <button
            onClick={onOpenProfile}
            className="w-full flex items-center gap-3 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl p-3 border border-blue-100 hover:border-blue-300 hover:shadow-md transition-all duration-300 group"
            title="Edit Profile"
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
                <User className="w-5 h-5 text-white" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 11l6-6 3 3-6 6H9v-3z" />
                </svg>
              </span>
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="font-bold text-slate-800 text-sm truncate">{user.name || 'User'}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
            <span className="text-xs text-slate-400 group-hover:text-emerald-500 transition-colors duration-200 font-medium">
              Edit
            </span>
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3.5 rounded-xl
                transition-all duration-300 group relative overflow-hidden
                ${isActive
                  ? 'bg-gradient-to-r from-emerald-400 to-blue-500 text-white shadow-lg shadow-emerald-500/25'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                }
              `}
            >
              {isActive && <div className="absolute inset-0 bg-white/20 animate-pulse" />}
              <Icon className={`w-5 h-5 relative z-10 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
              <span className={`font-medium relative z-10 ${isActive ? 'font-semibold' : ''}`}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* AI Chatbot Button */}
      <div className="px-4 pb-3">
        <button
          onClick={onOpenChat}
          className="relative w-full flex items-center gap-3 px-4 py-3.5 rounded-xl overflow-hidden group"
          style={{
            background: 'linear-gradient(135deg, #10b981, #3b82f6, #8b5cf6)',
            backgroundSize: '200% 200%',
            animation: 'gradientShift 3s ease infinite',
          }}
        >
          <span className="absolute inset-0 rounded-xl opacity-60 blur-sm"
            style={{ background: 'linear-gradient(135deg, #10b981, #3b82f6, #8b5cf6)', animation: 'pulse 2s ease-in-out infinite' }} />
          <span className="absolute inset-0 rounded-xl overflow-hidden">
            <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </span>
          <MessageCircle className="w-5 h-5 text-white relative z-10 drop-shadow" />
          <span className="font-bold text-white relative z-10 text-sm tracking-wide drop-shadow">AI Wellness Chat</span>
          <span className="ml-auto relative z-10 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-white animate-ping absolute" />
            <span className="w-2 h-2 rounded-full bg-white relative" />
          </span>
        </button>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-slate-200/60">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all duration-300 group"
        >
          <LogOut className="w-5 h-5 transition-transform duration-300 group-hover:scale-105" />
          <span className="font-medium">Logout</span>
        </button>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-slate-200/60">
        <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl p-4 border border-emerald-100">
          <p className="text-sm font-semibold text-slate-800 mb-1">Need Help?</p>
          <p className="text-xs text-slate-600 mb-3">We're here 24/7 for you</p>
          {/* ✅ Now navigates to Support page */}
          <button
            onClick={() => setCurrentPage('support')}
            className="w-full bg-gradient-to-r from-emerald-400 to-blue-500 text-white text-sm font-semibold py-2.5 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            Contact Support
          </button>
        </div>
      </div>

      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
