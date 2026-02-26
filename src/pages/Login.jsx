import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Sparkles, Heart, Brain, Shield } from 'lucide-react';

const Login = ({ onLogin, onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 🔥 BACKEND LOGIN (ur original logic kept)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await res.json();
      setIsLoading(false);

      if (res.ok) {
        // store user id
        localStorage.setItem("user_id", data.user_id);

        onLogin({
  email: data.email,
  name: data.name,
  user_id: data.user_id
});

      } else {
        alert(data.message);
      }

    } catch (error) {
      console.error(error);
      setIsLoading(false);
      alert("Login error");
    }
  };

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 flex items-center justify-center p-4">

      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

        {/* LEFT BRANDING */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                   Wellness Hub
                </h1>
                <p className="text-slate-600 font-medium"></p>
              </div>
            </div>

            <h2 className="text-5xl font-bold text-slate-800 leading-tight">
              Your Mental Health
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                Matters
              </span>
            </h2>
          </div>
        </div>

        {/* RIGHT LOGIN FORM */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/60 p-8 lg:p-12">

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">
              Welcome Back 👋
            </h2>
            <p className="text-slate-600">
              Sign in to continue your wellness journey
            </p>
          </div>

         

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />

                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-12 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* LOGIN BTN */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-400 to-blue-500 text-white font-bold py-4 rounded-xl"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* 🔥 SIGNUP SWITCH */}
          <div className="mt-6 text-center">
            <p className="text-slate-600">
              Don't have an account?{" "}
              <button
                onClick={onSwitchToSignup}
                className="font-bold text-blue-600"
              >
                Sign up
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
