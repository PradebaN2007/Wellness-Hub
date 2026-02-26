import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Bot, User, Loader2 } from 'lucide-react';

const ChatbotDrawer = ({ isOpen, onClose, user }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hey there 👋 I'm your AI Wellness Companion. How are you feeling today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 400);
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.content, history }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm here for you — could you try again in a moment?" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Centered floating modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="pointer-events-auto flex flex-col w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-white/30 animate-fadeIn"
          style={{
            height: '82vh',
            maxHeight: '820px',
            minHeight: '520px',
            background: 'rgba(255,255,255,0.98)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #10b981, #3b82f6, #8b5cf6)' }}
          >
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-white text-base tracking-wide">AI Wellness Companion</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                <span className="text-white/70 text-sm">Online & ready to listen</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5 shadow">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] px-5 py-3 rounded-2xl text-base leading-relaxed shadow-sm
                    ${msg.role === 'user'
                      ? 'bg-gradient-to-br from-emerald-400 to-blue-500 text-white rounded-tr-sm'
                      : 'bg-slate-100 text-slate-800 rounded-tl-sm'
                    }`}
                >
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center flex-shrink-0 mt-0.5 shadow">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center flex-shrink-0 shadow">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-slate-100 bg-white flex-shrink-0">
            <div className="flex items-end gap-2 bg-slate-50 rounded-xl border border-slate-200 px-3 py-2 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                rows={1}
                className="flex-1 bg-transparent resize-none outline-none text-base text-slate-800 placeholder-slate-400 max-h-28"
                placeholder="Share what's on your mind..."
                style={{ lineHeight: '1.6rem' }}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="p-2.5 rounded-lg bg-gradient-to-br from-emerald-400 to-blue-500 text-white disabled:opacity-40 hover:opacity-90 transition-all duration-200 hover:scale-105 flex-shrink-0 shadow"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-center text-sm text-slate-400 mt-2">Press Enter to send · Shift+Enter for new line</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatbotDrawer;
