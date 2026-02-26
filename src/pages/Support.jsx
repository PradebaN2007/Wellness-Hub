import React, { useState } from 'react';
import { Phone, MessageCircle, Mail, Clock, AlertCircle, Heart, Users, Video, Calendar, Award, X } from 'lucide-react';

const Support = ({ onNavigateToAppointment }) => {
  const [requestType, setRequestType] = useState('');
  const [urgency, setUrgency] = useState('');
  const [showCounselors, setShowCounselors] = useState(false);
  const [selectedCounselor, setSelectedCounselor] = useState(null);

  // Indian helplines
  const emergencyContacts = [
    {
      id: 1,
      title: 'National Mental Health Helpline',
      number: '08046110007',
      description: 'NIMHANS 24/7 helpline (Toll-free)',
      icon: Phone,
      color: 'from-rose-500 to-red-600',
      urgent: true,
    },
    {
      id: 2,
      title: 'Vandrevala Foundation',
      number: '1860-2662-345',
      description: '24x7 mental health support',
      icon: Heart,
      color: 'from-purple-500 to-pink-600',
      urgent: true,
    },
    {
      id: 3,
      title: 'iCall Helpline',
      number: '9152987821',
      description: 'Mon-Sat, 8 AM - 10 PM',
      icon: MessageCircle,
      color: 'from-blue-500 to-cyan-600',
      urgent: false,
    },
  ];

  // Counselors data with realistic profile images
  const counselors = [
    {
      id: 1,
      name: 'Dr. Priya Sharma',
      qualification: 'PhD in Clinical Psychology, 12 years experience',
      specialization: 'Anxiety, Depression, Stress Management',
      languages: 'English, Hindi, Tamil',
      rating: 4.8,
      consultationFee: '₹1,500',
      availability: 'Available Mon-Fri',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop',
      bio: 'Dr. Priya specializes in cognitive behavioral therapy and has helped over 500 clients overcome anxiety and depression. She uses evidence-based approaches tailored to individual needs.',
      experience: '12+ years',
      patientsHelped: '500+',
      responseTime: 'Within 2 hours',
    },
    {
      id: 2,
      name: 'Dr. Rajesh Kumar',
      qualification: 'MD Psychiatry, 15 years experience',
      specialization: 'Work Stress, Burnout, Career Counseling',
      languages: 'English, Hindi, Telugu',
      rating: 4.9,
      consultationFee: '₹2,000',
      availability: 'Available Tue-Sat',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
      bio: 'Dr. Rajesh has extensive experience in corporate mental health and burnout prevention. He has worked with numerous Fortune 500 companies to improve employee wellbeing.',
      experience: '15+ years',
      patientsHelped: '800+',
      responseTime: 'Within 3 hours',
    },
    {
      id: 3,
      name: 'Dr. Ananya Iyer',
      qualification: 'M.Phil Clinical Psychology, 8 years experience',
      specialization: 'Relationship Issues, Family Therapy',
      languages: 'English, Hindi, Malayalam',
      rating: 4.7,
      consultationFee: '₹1,200',
      availability: 'Available Mon-Sat',
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop',
      bio: 'Dr. Ananya focuses on building stronger relationships and family dynamics. Her empathetic approach has helped countless couples and families find harmony.',
      experience: '8+ years',
      patientsHelped: '350+',
      responseTime: 'Within 1 hour',
    },
    {
      id: 4,
      name: 'Dr. Amit Verma',
      qualification: 'PhD Psychology, RCI Licensed, 10 years experience',
      specialization: 'Trauma, PTSD, Mindfulness Therapy',
      languages: 'English, Hindi, Punjabi',
      rating: 4.8,
      consultationFee: '₹1,800',
      availability: 'Available Wed-Sun',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop',
      bio: 'Dr. Amit is a trauma specialist who combines traditional therapy with mindfulness practices. He has trained with international experts in PTSD treatment.',
      experience: '10+ years',
      patientsHelped: '600+',
      responseTime: 'Within 4 hours',
    },
  ];

  const requestTypes = [
    'Mental Health Concern',
    'Stress Management',
    'Work-Life Balance',
    'Anxiety Support',
    'General Wellness',
    'Other',
  ];

  const urgencyLevels = [
    { value: 'low', label: 'Low - General inquiry', color: 'emerald' },
    { value: 'medium', label: 'Medium - Need support soon', color: 'yellow' },
    { value: 'high', label: 'High - Urgent support needed', color: 'rose' },
  ];

  // Floating Modal Component
  const CounselorModal = ({ counselor, onClose, onNavigateToAppointment }) => {
    if (!counselor) return null;

    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
        <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp">
          {/* Header with close button */}
          <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6 rounded-t-3xl">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-all duration-300"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-6">
              <img
                src={counselor.image}
                alt={counselor.name}
                className="w-32 h-32 rounded-2xl object-cover border-4 border-white/30 shadow-xl"
              />
              <div>
                <h2 className="text-3xl font-bold mb-2">{counselor.name}</h2>
                <p className="text-white/90 text-sm mb-2">{counselor.qualification}</p>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 w-fit">
                  <span className="text-amber-300 text-lg">⭐</span>
                  <span className="font-bold">{counselor.rating}</span>
                  <span className="text-white/80 text-sm">(120+ reviews)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-8 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-emerald-50 rounded-xl p-4 text-center border border-emerald-200">
                <p className="text-2xl font-bold text-emerald-600">{counselor.experience}</p>
                <p className="text-xs text-slate-600 mt-1">Experience</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-200">
                <p className="text-2xl font-bold text-blue-600">{counselor.patientsHelped}</p>
                <p className="text-xs text-slate-600 mt-1">Clients Helped</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 text-center border border-purple-200">
                <p className="text-2xl font-bold text-purple-600">{counselor.responseTime}</p>
                <p className="text-xs text-slate-600 mt-1">Response Time</p>
              </div>
            </div>

            {/* About */}
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">About</h3>
              <p className="text-slate-600 leading-relaxed">{counselor.bio}</p>
            </div>

            {/* Specialization */}
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Specialization</h3>
              <div className="flex items-center gap-2 bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                <Award className="w-5 h-5 text-emerald-600" />
                <span className="text-slate-700 font-semibold">{counselor.specialization}</span>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <p className="text-xs text-slate-500 mb-2 uppercase tracking-wide">Languages</p>
                <p className="text-slate-700 font-semibold">{counselor.languages}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <p className="text-xs text-slate-500 mb-2 uppercase tracking-wide">Consultation Fee</p>
                <p className="text-2xl font-bold text-emerald-600">{counselor.consultationFee}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 md:col-span-2">
                <p className="text-xs text-slate-500 mb-2 uppercase tracking-wide">Availability</p>
                <p className="text-slate-700 font-semibold">{counselor.availability}</p>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4">
              <button 
                onClick={() => {
                  console.log('Book Appointment clicked in modal!');
                  console.log('Counselor ID:', counselor.id);
                  console.log('onNavigateToAppointment function exists?', !!onNavigateToAppointment);
                  onClose();
                  // Navigate to appointment page with counselor info
                  if (onNavigateToAppointment) {
                    console.log('Calling onNavigateToAppointment...');
                    onNavigateToAppointment(counselor.id);
                  } else {
                    console.error('onNavigateToAppointment is not defined!');
                  }
                }}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Book Appointment Now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
          Support & Counseling 🤝
        </h1>
        <p className="text-slate-600 text-lg">
          Professional help is just a call away. We're here for you 24/7
        </p>
      </div>

      {/* Crisis Alert Banner */}
      <div className="bg-gradient-to-r from-rose-500 to-red-600 rounded-3xl p-8 shadow-2xl text-white">
        <div className="flex items-start gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-3">In Crisis? Get Immediate Help</h2>
            <p className="text-white/90 text-lg mb-4">
              If you're experiencing a mental health emergency, please reach out immediately. 
              Help is available, and you don't have to face this alone.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="tel:08046110007" className="bg-white text-rose-600 font-bold px-6 py-3 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105">
                Call NIMHANS Helpline
              </a>
              <a href="tel:9152987821" className="bg-white/20 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/30 transition-all duration-300">
                Call iCall
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contacts */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">24/7 Mental Health Helplines (India)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {emergencyContacts.map((contact) => {
            const Icon = contact.icon;
            return (
              <div
                key={contact.id}
                className={`bg-gradient-to-br ${contact.color} rounded-2xl p-6 shadow-xl text-white hover:shadow-2xl transition-all duration-300 hover:scale-105`}
              >
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 w-fit mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">{contact.title}</h3>
                <a href={`tel:${contact.number}`} className="text-3xl font-bold mb-2 block hover:underline">
                  {contact.number}
                </a>
                <p className="text-white/90 text-sm">{contact.description}</p>
                {contact.urgent && (
                  <div className="mt-4 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5 inline-block">
                    <span className="text-xs font-bold">24/7 AVAILABLE</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Book Counselor Section */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 border border-emerald-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Book a Professional Counselor</h2>
            <p className="text-slate-600">Connect with licensed psychologists and therapists</p>
          </div>
          <button
            onClick={() => setShowCounselors(!showCounselors)}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold px-8 py-4 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
          >
            <Calendar className="w-5 h-5" />
            {showCounselors ? 'Hide Counselors' : 'View Counselors'}
          </button>
        </div>

        {showCounselors && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {counselors.map((counselor) => (
              <div
                key={counselor.id}
                onClick={() => setSelectedCounselor(counselor)}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 cursor-pointer hover:scale-105 group"
              >
                <div className="flex gap-4">
                  {/* Counselor Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={counselor.image}
                      alt={counselor.name}
                      className="w-24 h-24 rounded-xl object-cover shadow-md group-hover:shadow-lg transition-all duration-300"
                    />
                  </div>

                  {/* Counselor Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-slate-800 mb-1 truncate">{counselor.name}</h3>
                        <p className="text-slate-600 text-xs mb-2 line-clamp-1">{counselor.qualification}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full flex-shrink-0 ml-2">
                        <span className="text-amber-600">⭐</span>
                        <span className="font-bold text-amber-700 text-sm">{counselor.rating}</span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Award className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span className="text-slate-700 line-clamp-1">{counselor.specialization}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Fee:</span>
                        <span className="font-bold text-emerald-600">{counselor.consultationFee}</span>
                      </div>
                    </div>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Book Appointment clicked on card!');
                        console.log('Counselor ID:', counselor.id);
                        console.log('onNavigateToAppointment function exists?', !!onNavigateToAppointment);
                        if (onNavigateToAppointment) {
                          console.log('Calling onNavigateToAppointment...');
                          onNavigateToAppointment(counselor.id);
                        } else {
                          console.error('onNavigateToAppointment is not defined!');
                        }
                      }}
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold py-2 px-4 rounded-lg hover:shadow-md transition-all duration-300 text-sm"
                    >
                      Book Appointment →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Support Request Form */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-slate-200/60">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Request Support</h2>

        <div className="space-y-6">
          {/* Request Type */}
          <div>
            <label className="block text-lg font-bold text-slate-800 mb-3">
              What do you need help with?
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {requestTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setRequestType(type)}
                  className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300
                    ${requestType === type
                      ? 'bg-gradient-to-r from-emerald-400 to-blue-500 text-white shadow-lg scale-105'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Urgency Level */}
          <div>
            <label className="block text-lg font-bold text-slate-800 mb-3">
              How urgent is this?
            </label>
            <div className="space-y-3">
              {urgencyLevels.map((level) => (
                <button
                  key={level.value}
                  onClick={() => setUrgency(level.value)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl font-semibold transition-all duration-300
                    ${urgency === level.value
                      ? `bg-${level.color}-100 border-2 border-${level.color}-400 shadow-lg`
                      : 'bg-slate-50 border-2 border-slate-200 hover:bg-slate-100'
                    }`}
                >
                  <span className={urgency === level.value ? `text-${level.color}-700` : 'text-slate-700'}>
                    {level.label}
                  </span>
                  {urgency === level.value && (
                    <div className={`w-6 h-6 bg-${level.color}-500 rounded-full flex items-center justify-center`}>
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-lg font-bold text-slate-800 mb-3">
              Tell us more (optional)
            </label>
            <textarea
              placeholder="Share any additional details that might help us support you better..."
              rows={6}
              className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white transition-all duration-300 text-slate-800 placeholder-slate-400 resize-none"
            />
          </div>

          {/* Submit */}
          <button
            disabled={!requestType || !urgency}
            className="w-full bg-gradient-to-r from-emerald-400 to-blue-500 text-white font-bold py-4 px-6 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Submit Support Request
          </button>
        </div>
      </div>

      {/* Additional Resources */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
        <h3 className="text-xl font-bold text-slate-800 mb-4">Self-Help Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4">
            <h4 className="font-bold text-slate-800 mb-2">📚 Wellness Library</h4>
            <p className="text-slate-600 text-sm mb-3">
              Access articles and guides on mental health
            </p>
            <button className="text-blue-600 font-semibold text-sm hover:underline">
              Browse Resources →
            </button>
          </div>
          <div className="bg-white rounded-xl p-4">
            <h4 className="font-bold text-slate-800 mb-2">🧘 Meditation & Yoga</h4>
            <p className="text-slate-600 text-sm mb-3">
              Join live sessions on stress management
            </p>
            <button className="text-blue-600 font-semibold text-sm hover:underline">
              View Schedule →
            </button>
          </div>
        </div>
      </div>

      {/* Floating Modal */}
      {selectedCounselor && (
        <CounselorModal
          counselor={selectedCounselor}
          onClose={() => setSelectedCounselor(null)}
          onNavigateToAppointment={onNavigateToAppointment}
        />
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Support;
