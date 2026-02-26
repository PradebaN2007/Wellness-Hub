import React, { useState, useRef } from 'react';
import { MessageSquare, Send, Shield, ThumbsUp, Star } from 'lucide-react';

const Feedback = () => {
  const [feedback, setFeedback] = useState('');
  const [category, setCategory] = useState('');
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const user_id = localStorage.getItem('user_id');

  // Ref to scroll to the form
  const formRef = useRef(null);

  const categories = [
    'App Experience',
    'Wellness Resources',
    'Support Services',
    'Feature Request',
    'Bug Report',
    'Other',
  ];

  // Called by tile buttons — sets category AND scrolls down to form
  const handleTileClick = (cat) => {
    setCategory(cat);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim() || !category || rating === 0) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user_id,
          category: category,
          rating: rating,
          message: feedback,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setFeedback('');
          setCategory('');
          setRating(0);
          setSubmitted(false);
        }, 3000);
      } else {
        setError('Failed to submit. Please try again.');
      }
    } catch (err) {
      setError('Server error. Make sure Flask is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
          Feedback 💬
        </h1>
        <p className="text-slate-600 text-lg">
          Your voice matters. Help us improve your wellness experience
        </p>
      </div>

      {/* Privacy Notice */}
      <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-2xl p-6 border border-blue-100">
        <div className="flex items-start gap-4">
          <div className="bg-gradient-to-br from-blue-400 to-emerald-500 rounded-xl p-3 shadow-lg">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">100% Anonymous & Confidential</h3>
            <p className="text-slate-600 leading-relaxed">
              Your feedback is completely anonymous. We don't collect any identifying information.
              Your honest thoughts help us create a better wellness experience for everyone.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Feedback Tiles — clicking these pre-fills category and scrolls to form */}
      {!submitted && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 shadow-xl text-white">
            <h3 className="text-xl font-bold mb-2">💡 Suggestions</h3>
            <p className="text-white/90 mb-4">
              Have an idea for a new feature? We'd love to hear it!
            </p>
            <button
              onClick={() => handleTileClick('Feature Request')}
              className="bg-white text-purple-600 font-semibold px-5 py-2.5 rounded-lg hover:shadow-lg transition-all duration-300 text-sm"
            >
              Share Idea
            </button>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 shadow-xl text-white">
            <h3 className="text-xl font-bold mb-2">🐛 Report Issue</h3>
            <p className="text-white/90 mb-4">
              Encountered a bug? Let us know so we can fix it!
            </p>
            <button
              onClick={() => handleTileClick('Bug Report')}
              className="bg-white text-blue-600 font-semibold px-5 py-2.5 rounded-lg hover:shadow-lg transition-all duration-300 text-sm"
            >
              Report Bug
            </button>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl p-6 shadow-xl text-white">
            <h3 className="text-xl font-bold mb-2">⭐ Review</h3>
            <p className="text-white/90 mb-4">
              Share your overall experience with the app!
            </p>
            <button
              onClick={() => handleTileClick('App Experience')}
              className="bg-white text-emerald-600 font-semibold px-5 py-2.5 rounded-lg hover:shadow-lg transition-all duration-300 text-sm"
            >
              Write Review
            </button>
          </div>
        </div>
      )}

      {/* Feedback Form */}
      <div ref={formRef} className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-slate-200/60">
        {submitted ? (
          <div className="text-center py-12 animate-fadeIn">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <ThumbsUp className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Thank You! 🎉</h3>
            <p className="text-slate-600 text-lg">
              Your feedback has been submitted successfully. We appreciate your input!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Banner showing which category was pre-selected from tile */}
            {category && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-center justify-between">
                <p className="text-blue-700 font-semibold text-sm">
                  📝 Category selected: <span className="text-blue-900">{category}</span>
                </p>
                <button
                  type="button"
                  onClick={() => setCategory('')}
                  className="text-blue-400 hover:text-blue-700 font-bold text-sm"
                >
                  ✕ change
                </button>
              </div>
            )}

            {/* Rating Section */}
            <div>
              <label className="block text-lg font-bold text-slate-800 mb-3">
                How would you rate your experience?
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="group transition-all duration-300 hover:scale-110"
                  >
                    <Star
                      className={`w-12 h-12 transition-all duration-300 ${
                        star <= rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-slate-300 group-hover:text-yellow-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-slate-600 mt-2 font-medium">
                  {rating === 5 && '⭐ Excellent!'}
                  {rating === 4 && '👍 Very Good!'}
                  {rating === 3 && '😊 Good'}
                  {rating === 2 && '🤔 Could be better'}
                  {rating === 1 && '😕 Needs improvement'}
                </p>
              )}
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-lg font-bold text-slate-800 mb-3">
                What is your feedback about?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`
                      px-4 py-3 rounded-xl font-semibold transition-all duration-300
                      ${category === cat
                        ? 'bg-gradient-to-r from-emerald-400 to-blue-500 text-white shadow-lg scale-105'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                      }
                    `}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback Text Area */}
            <div>
              <label className="block text-lg font-bold text-slate-800 mb-3">
                Share your thoughts
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us what's on your mind. We value your honest feedback and suggestions..."
                rows={8}
                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-400 focus:bg-white transition-all duration-300 text-slate-800 placeholder-slate-400 resize-none"
              />
              <p className="text-slate-500 text-sm mt-2">
                {feedback.length} characters
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-red-500 text-sm font-medium bg-red-50 px-4 py-3 rounded-xl border border-red-200">
                ⚠️ {error}
              </p>
            )}

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={!feedback.trim() || !category || rating === 0 || loading}
                className="flex-1 bg-gradient-to-r from-emerald-400 to-blue-500 text-white font-bold py-4 px-6 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                {loading ? 'Submitting...' : 'Submit Feedback'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setFeedback('');
                  setCategory('');
                  setRating(0);
                  setError('');
                }}
                className="px-6 py-4 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-all duration-300"
              >
                Clear
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Recent Improvements */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-slate-200/60">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-2.5">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">What We've Improved</h2>
            <p className="text-slate-600">Based on your valuable feedback</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
            <div className="flex items-start gap-3">
              <div className="bg-emerald-500 text-white rounded-lg px-2 py-1 text-xs font-bold">NEW</div>
              <div>
                <h4 className="font-bold text-slate-800 mb-1">Enhanced Mood Tracking</h4>
                <p className="text-slate-600 text-sm">
                  Added more granular mood options and emotion tags based on user requests
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-start gap-3">
              <div className="bg-blue-500 text-white rounded-lg px-2 py-1 text-xs font-bold">FIXED</div>
              <div>
                <h4 className="font-bold text-slate-800 mb-1">Improved Navigation</h4>
                <p className="text-slate-600 text-sm">
                  Streamlined menu structure for easier access to wellness resources
                </p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
            <div className="flex items-start gap-3">
              <div className="bg-purple-500 text-white rounded-lg px-2 py-1 text-xs font-bold">ADDED</div>
              <div>
                <h4 className="font-bold text-slate-800 mb-1">More Meditation Content</h4>
                <p className="text-slate-600 text-sm">
                  Expanded library with 20+ new guided meditation sessions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
