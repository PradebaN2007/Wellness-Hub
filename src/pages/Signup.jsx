import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Sparkles, User, Phone, Building, CheckCircle } from 'lucide-react';

const Signup = ({ onSignup, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Name must be at least 3 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Phone validation (optional but if provided, must be valid)
    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Terms agreement
    if (!agreeToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  setIsLoading(true);

  try {
    const res = await fetch("http://127.0.0.1:5000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: formData.fullName,
        email: formData.email,
        password: formData.password
      })
    });

    const data = await res.json();
    setIsLoading(false);

    if (res.ok) {
      alert("Account created!");

      // auto login after signup
      onSignup({
        email: formData.email,
        name: formData.fullName
      });

    } else {
      alert(data.message || "Signup failed");
    }

  } catch (error) {
    console.error(error);
    setIsLoading(false);
    alert("Signup error");
  }
};

  const passwordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, text: '', color: '' };
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return { strength, text: 'Weak', color: 'bg-red-500' };
    if (strength <= 3) return { strength, text: 'Fair', color: 'bg-yellow-500' };
    if (strength <= 4) return { strength, text: 'Good', color: 'bg-blue-500' };
    return { strength, text: 'Strong', color: 'bg-green-500' };
  };

  const pwdStrength = passwordStrength();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 flex items-center justify-center p-4">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-300/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
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
              Start Your
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                Wellness Journey
              </span>
            </h2>

            <p className="text-xl text-slate-600 leading-relaxed">
              Join thousands of employees taking control of their mental health and well-being.
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-slate-700">
              <CheckCircle className="w-6 h-6 text-emerald-500" />
              <span className="font-medium">Free access to wellness resources</span>
            </div>
            <div className="flex items-center gap-3 text-slate-700">
              <CheckCircle className="w-6 h-6 text-emerald-500" />
              <span className="font-medium">24/7 AI wellness companion</span>
            </div>
            <div className="flex items-center gap-3 text-slate-700">
              <CheckCircle className="w-6 h-6 text-emerald-500" />
              <span className="font-medium">Track your mood and activities</span>
            </div>
            <div className="flex items-center gap-3 text-slate-700">
              <CheckCircle className="w-6 h-6 text-emerald-500" />
              <span className="font-medium">Anonymous and confidential</span>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/60 p-8 lg:p-10 max-h-[90vh] overflow-y-auto">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800"></h1>
              <p className="text-sm text-slate-600">Employee Wellness</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Create Account 🎉</h2>
            <p className="text-slate-600">Sign up to start your wellness journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`w-full pl-12 pr-4 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none focus:bg-white transition-all duration-300 text-slate-800 placeholder-slate-400 ${
                    errors.fullName ? 'border-red-400' : 'border-slate-200 focus:border-blue-400'
                  }`}
                />
              </div>
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john.doe@company.com"
                  className={`w-full pl-12 pr-4 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none focus:bg-white transition-all duration-300 text-slate-800 placeholder-slate-400 ${
                    errors.email ? 'border-red-400' : 'border-slate-200 focus:border-blue-400'
                  }`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Phone (Optional) */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Phone Number <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(555) 123-4567"
                  className={`w-full pl-12 pr-4 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none focus:bg-white transition-all duration-300 text-slate-800 placeholder-slate-400 ${
                    errors.phone ? 'border-red-400' : 'border-slate-200 focus:border-blue-400'
                  }`}
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            {/* Company (Optional) */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Company <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <Building className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Acme Corporation"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white transition-all duration-300 text-slate-800 placeholder-slate-400"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className={`w-full pl-12 pr-12 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none focus:bg-white transition-all duration-300 text-slate-800 placeholder-slate-400 ${
                    errors.password ? 'border-red-400' : 'border-slate-200 focus:border-blue-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-600">Password Strength:</span>
                    <span className={`text-xs font-semibold ${
                      pwdStrength.strength <= 2 ? 'text-red-600' : 
                      pwdStrength.strength <= 3 ? 'text-yellow-600' : 
                      pwdStrength.strength <= 4 ? 'text-blue-600' : 'text-green-600'
                    }`}>
                      {pwdStrength.text}
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${pwdStrength.color} transition-all duration-300`}
                      style={{ width: `${(pwdStrength.strength / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={`w-full pl-12 pr-12 py-3 bg-slate-50 border-2 rounded-xl focus:outline-none focus:bg-white transition-all duration-300 text-slate-800 placeholder-slate-400 ${
                    errors.confirmPassword ? 'border-red-400' : 'border-slate-200 focus:border-blue-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Terms Agreement */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-600">
                  I agree to the{' '}
                  <button type="button" className="text-blue-600 hover:underline font-semibold">
                    Terms of Service
                  </button>
                  {' '}and{' '}
                  <button type="button" className="text-blue-600 hover:underline font-semibold">
                    Privacy Policy
                  </button>
                </span>
              </label>
              {errors.terms && <p className="text-red-500 text-xs mt-1">{errors.terms}</p>}
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-400 to-blue-500 text-white font-bold py-4 px-6 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-slate-600">
              Already have an account?{' '}
              <button 
                onClick={onSwitchToLogin}
                className="font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
