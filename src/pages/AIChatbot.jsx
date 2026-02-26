import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, AlertCircle, Phone, Sparkles, Heart } from 'lucide-react';

const AIChatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: "Hey there! 👋 How's it going?",
      timestamp: new Date().toISOString(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = async (userMessage) => {
    try {
      const history = messages
        .filter(msg => msg.type !== 'bot' || msg.id !== 1)
        .map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.text
        }));

      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, history }),
      });

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error calling chat API:', error);
      return "I'm having trouble connecting right now. Please try again in a moment. If you need immediate help, please call NIMHANS at 080-46110007.";
    }
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, userMessage]);
    const currentInput = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    const botText = await getBotResponse(currentInput);

    const botResponse = {
      id: messages.length + 2,
      type: 'bot',
      text: botText,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, botResponse]);
    setIsTyping(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { label: 'Feeling Stressed', icon: '😰' },
    { label: 'Need Relaxation Tips', icon: '🧘' },
    { label: 'Sleep Problems', icon: '😴' },
    { label: 'Work-Life Balance', icon: '⚖️' },
    { label: 'Feeling Anxious', icon: '😟' },
    { label: 'Need Emergency Support', icon: '🆘' },
  ];

  const handleQuickAction = (label) => {
    setInputMessage(label);
  };

  return (
    <div className="space-y-6 animate-fadeIn h-full flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
            AI Wellness Companion 🤖
          </h1>
          <p className="text-slate-600 text-lg">
            24/7 emotional support and mental wellness guidance
          </p>
        </div>
        <div className="bg-gradient-to-br from-emerald-400 to-blue-500 rounded-2xl p-4 shadow-lg">
          <Bot className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* ── Emergency Banner — matches screenshot style ── */}
      <div className="bg-gradient-to-r from-rose-500 to-red-500 rounded-2xl p-5 shadow-lg text-white flex items-start gap-4">
        {/* Icon */}
        <div className="bg-white/20 rounded-full p-2.5 flex-shrink-0 mt-0.5">
          <AlertCircle className="w-5 h-5 text-white" />
        </div>

        {/* Text + Buttons */}
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-1">In Crisis? Get Immediate Help</h3>
          <p className="text-white/85 text-sm mb-4 leading-relaxed">
            If you're experiencing a mental health emergency, please reach out immediately.
            Help is available, and you don't have to face this alone.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="tel:08046110007"
              className="bg-white text-rose-600 font-bold text-sm px-5 py-2.5 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Call NIMHANS Helpline
            </a>
            <a
              href="tel:09152987821"
              className="bg-white/25 backdrop-blur-sm text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-white/35 transition-all duration-300 flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Call iCall
            </a>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-slate-200/60 flex flex-col overflow-hidden">

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`
                flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg
                ${message.type === 'user'
                  ? 'bg-gradient-to-br from-blue-400 to-indigo-500'
                  : 'bg-gradient-to-br from-emerald-400 to-green-500'
                }
              `}>
                {message.type === 'user'
                  ? <User className="w-5 h-5 text-white" />
                  : <Bot className="w-5 h-5 text-white" />
                }
              </div>

              <div className={`
                max-w-2xl rounded-2xl px-5 py-3 shadow-md
                ${message.type === 'user'
                  ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'
                  : 'bg-slate-50 text-slate-800 border border-slate-200'
                }
              `}>
                <p className="whitespace-pre-line leading-relaxed">{message.text}</p>
                <p className={`text-xs mt-2 ${message.type === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-slate-50 rounded-2xl px-5 py-3 border border-slate-200">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/50">
          <p className="text-sm font-semibold text-slate-600 mb-3">Quick actions:</p>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action.label)}
                className="bg-white text-slate-700 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gradient-to-r hover:from-emerald-400 hover:to-blue-500 hover:text-white transition-all duration-300 border border-slate-200 hover:border-transparent hover:scale-105 shadow-sm"
              >
                {action.icon} {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-6 border-t border-slate-200 bg-white">
          <div className="flex gap-3">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here... (Press Enter to send)"
              rows={1}
              className="flex-1 px-5 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white transition-all duration-300 text-slate-800 placeholder-slate-400 resize-none"
            />
            <button
              onClick={handleSendMessage}
              disabled={inputMessage.trim() === ''}
              className="bg-gradient-to-r from-emerald-400 to-blue-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              <span className="font-semibold">Send</span>
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-3 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            This AI provides supportive guidance. For professional help, please consult a licensed therapist.
          </p>
        </div>
      </div>

      {/* Support Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-100">
          <div className="flex items-center gap-3 mb-3">
            <Heart className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-slate-800">24/7 Support</h3>
          </div>
          <p className="text-sm text-slate-600">
            Our AI companion is always available to listen and provide guidance.
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border border-blue-100">
          <div className="flex items-center gap-3 mb-3">
            <Bot className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-800">Evidence-Based</h3>
          </div>
          <p className="text-sm text-slate-600">
            Responses based on proven mental health practices and techniques.
          </p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-5 border border-emerald-100">
          <div className="flex items-center gap-3 mb-3">
            <AlertCircle className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-800">Private & Safe</h3>
          </div>
          <p className="text-sm text-slate-600">
            Your conversations are confidential and secure.
          </p>
        </div>
      </div>

    </div>
  );
};

export default AIChatbot;
