import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Mail, Phone, MessageCircle, ChevronLeft, CheckCircle, AlertCircle } from 'lucide-react';

const Appointment = ({ counselorId, onBack }) => {
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    reason: '',
    notes: ''
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Counselors data (same as Support page)
  const counselors = [
    {
      id: 1,
      name: 'Dr. Priya Sharma',
      qualification: 'PhD in Clinical Psychology',
      specialization: 'Anxiety, Depression, Stress Management',
      consultationFee: '₹1,500',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop',
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    {
      id: 2,
      name: 'Dr. Rajesh Kumar',
      qualification: 'MD Psychiatry',
      specialization: 'Work Stress, Burnout, Career Counseling',
      consultationFee: '₹2,000',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
      availability: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    },
    {
      id: 3,
      name: 'Dr. Ananya Iyer',
      qualification: 'M.Phil Clinical Psychology',
      specialization: 'Relationship Issues, Family Therapy',
      consultationFee: '₹1,200',
      image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop',
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    },
    {
      id: 4,
      name: 'Dr. Amit Verma',
      qualification: 'PhD Psychology, RCI Licensed',
      specialization: 'Trauma, PTSD, Mindfulness Therapy',
      consultationFee: '₹1,800',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop',
      availability: ['Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
  ];

  // Time slots
  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
    '06:00 PM', '07:00 PM'
  ];

  // Reasons for appointment
  const appointmentReasons = [
    'Initial Consultation',
    'Follow-up Session',
    'Stress Management',
    'Anxiety/Depression',
    'Relationship Issues',
    'Work-related Stress',
    'Other'
  ];

  // Get counselor from prop
  useEffect(() => {
    if (counselorId) {
      const counselor = counselors.find(c => c.id === counselorId);
      setSelectedCounselor(counselor || counselors[0]);
    } else {
      setSelectedCounselor(counselors[0]); // Default to first counselor
    }
  }, [counselorId]);

  // Generate next 14 days
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const formatDate = (date) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const getDayName = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the appointment data to your backend
    console.log('Appointment Data:', {
      counselor: selectedCounselor?.name,
      date: selectedDate,
      time: selectedTime,
      ...formData
    });
    setShowConfirmation(true);
  };

  const isFormValid = () => {
    return selectedDate && selectedTime && formData.name && formData.email && formData.phone && formData.reason;
  };

  if (!selectedCounselor) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (showConfirmation) {
    return (
      <div className="max-w-2xl mx-auto p-6 animate-fadeIn">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          <div className="bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-4">Appointment Confirmed! 🎉</h1>
          <p className="text-slate-600 text-lg mb-8">
            Your appointment has been successfully booked.
          </p>

          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 mb-8 border border-emerald-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Counselor:</span>
                <span className="font-bold text-slate-800">{selectedCounselor.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Date:</span>
                <span className="font-bold text-slate-800">{selectedDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Time:</span>
                <span className="font-bold text-slate-800">{selectedTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Consultation Fee:</span>
                <span className="font-bold text-emerald-600 text-xl">{selectedCounselor.consultationFee}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
            <p className="text-sm text-slate-700">
              📧 A confirmation email has been sent to <strong>{formData.email}</strong>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                // Reset form and return to appointment booking
                setShowConfirmation(false);
                setSelectedDate('');
                setSelectedTime('');
                setFormData({ name: '', email: '', phone: '', reason: '', notes: '' });
                // Keeps the same counselor selected for convenience
              }}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              📅 Book Another Appointment
            </button>
            <button
              onClick={() => {
                if (onBack) {
                  onBack();
                }
              }}
              className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 px-6 rounded-xl hover:bg-slate-200 transition-all duration-300 hover:scale-105"
            >
              ← Back to Support
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => {
            if (onBack) {
              onBack();
            }
          }}
          className="bg-slate-100 hover:bg-slate-200 p-3 rounded-xl transition-all duration-300"
        >
          <ChevronLeft className="w-6 h-6 text-slate-700" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Book Appointment</h1>
          <p className="text-slate-600">Schedule your consultation session</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Counselor Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 sticky top-6">
            <img
              src={selectedCounselor.image}
              alt={selectedCounselor.name}
              className="w-full h-48 object-cover rounded-xl mb-4"
            />
            <h3 className="text-xl font-bold text-slate-800 mb-2">{selectedCounselor.name}</h3>
            <p className="text-slate-600 text-sm mb-3">{selectedCounselor.qualification}</p>
            <div className="bg-emerald-50 rounded-lg p-3 mb-4 border border-emerald-200">
              <p className="text-sm font-semibold text-emerald-700">{selectedCounselor.specialization}</p>
            </div>
            <div className="flex items-center justify-between bg-slate-50 rounded-lg p-3">
              <span className="text-slate-600 text-sm">Consultation Fee</span>
              <span className="text-2xl font-bold text-emerald-600">{selectedCounselor.consultationFee}</span>
            </div>
          </div>
        </div>

        {/* Right Column - Booking Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 space-y-6">
            
            {/* Select Date */}
            <div>
              <label className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-4">
                <Calendar className="w-5 h-5 text-emerald-600" />
                Select Date
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {getAvailableDates().map((date, index) => {
                  const dateStr = formatDate(date);
                  const dayName = getDayName(date);
                  const isAvailable = selectedCounselor.availability.includes(dayName);
                  
                  return (
                    <button
                      key={index}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`p-3 rounded-xl font-semibold transition-all duration-300 text-sm
                        ${!isAvailable 
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-50'
                          : selectedDate === dateStr
                            ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-lg scale-105'
                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                        }`}
                    >
                      {dateStr}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Select Time */}
            <div>
              <label className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-4">
                <Clock className="w-5 h-5 text-emerald-600" />
                Select Time Slot
              </label>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`p-3 rounded-xl font-semibold transition-all duration-300 text-sm
                      ${selectedTime === time
                        ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-lg scale-105'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200 pt-6" />

            {/* Personal Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                  <User className="w-4 h-4 text-emerald-600" />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-400 focus:bg-white transition-all duration-300"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 XXXXX XXXXX"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-400 focus:bg-white transition-all duration-300"
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                  <Mail className="w-4 h-4 text-emerald-600" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-400 focus:bg-white transition-all duration-300"
                />
              </div>
            </div>

            {/* Reason for Appointment */}
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                Reason for Appointment *
              </label>
              <select
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-400 focus:bg-white transition-all duration-300"
              >
                <option value="">Select a reason</option>
                {appointmentReasons.map((reason) => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </select>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="text-sm font-bold text-slate-700 mb-2 block">
                Additional Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Share any specific concerns or topics you'd like to discuss..."
                rows={4}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-400 focus:bg-white transition-all duration-300 resize-none"
              />
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-slate-700">
                  <p className="font-semibold mb-1">Important Information:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Please arrive 5 minutes before your scheduled time</li>
                    <li>Cancellations must be made 24 hours in advance</li>
                    <li>Payment can be made online or at the clinic</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid()}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-4 px-6 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Confirm Appointment
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Appointment;