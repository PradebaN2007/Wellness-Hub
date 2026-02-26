# MURUGA Wellness Platform - Complete Documentation

## Executive Summary

The MURUGA Wellness Platform is a comprehensive Employee Mental Health and Wellness Dashboard that prioritizes emotional balance and workplace well-being. Built with React 18 and Tailwind CSS, it provides a modern, responsive interface designed specifically for corporate wellness programs.

## Design Principles

### Visual Identity
The platform embodies a **corporate wellness aesthetic** through:

**Color Psychology**
- **Soft Blue (#3b82f6)**: Represents trust, calm, and professional reliability
- **Light Green/Emerald (#10b981)**: Symbolizes growth, balance, and renewal
- **White (#ffffff)**: Conveys clarity, openness, and cleanliness
- **Pastel Gray (#f1f5f9)**: Provides subtle elegance and visual rest

**Layout Architecture**
- Fixed left sidebar (280px width) ensures consistent navigation
- Main content area uses max-width container (1280px) for optimal readability
- Card-based component system creates visual hierarchy and organization
- Responsive grid layouts adapt seamlessly across devices

### User Experience Strategy

**Accessibility**
- High color contrast ratios (WCAG AA compliant)
- Clear typography hierarchy with Inter font family
- Keyboard navigation support
- Screen reader friendly semantic HTML

**Interaction Design**
- Gentle hover effects and transitions (300ms duration)
- Glass-morphism with backdrop blur for modern aesthetic
- Micro-animations provide feedback without distraction
- Progressive disclosure prevents information overload

## Technical Architecture

### Component Structure

```
App.jsx (Root)
├── Sidebar.jsx (Persistent Navigation)
└── Page Router
    ├── Dashboard.jsx
    ├── MoodTracker.jsx
    ├── WellnessResources.jsx
    ├── ActivityTracker.jsx
    ├── Feedback.jsx
    ├── AIChatbot.jsx
    └── Support.jsx
```

### State Management
- React Hooks (useState) for local component state
- Props drilling for sidebar navigation state
- No global state management (Redux/Context) - keeps it simple
- Future: Consider Zustand or Redux for user authentication

### Data Flow
```
User Interaction → Component State Update → UI Re-render → Visual Feedback
```

## Feature Specifications

### 1. Dashboard (Landing Page)

**Purpose**: Provide at-a-glance wellness overview

**Components**:
- Welcome header with personalized greeting
- Motivational wellness card (gradient background)
- Four statistics cards:
  1. Mood Score (7.8/10 with +12% trend)
  2. Stress Level (Low with -8% trend)
  3. Mental Wellness (82% with +15% trend)
  4. Activity Score (68% with +5% trend)
- Dual-line area chart (Recharts) showing stress vs wellness trends

**Data Visualization**:
- 7-day stress trend line (rose color)
- 7-day wellness trend line (emerald color)
- Interactive tooltips on hover
- Responsive chart sizing

### 2. Mood Tracker

**Purpose**: Enable emotional awareness through daily logging

**Mood Options**:
1. **Happy** 😊 - Emerald gradient
2. **Neutral** 😐 - Blue gradient
3. **Stressed** 😰 - Orange gradient
4. **Burnout** 😞 - Rose gradient

**Visualization**:
- Stacked bar chart showing mood distribution
- Monthly statistics breakdown
- Trend insights and suggestions

**Interaction Flow**:
```
Select Mood → Confirmation Message → Save Prompt → Optional Notes
```

### 3. Wellness Resources

**Purpose**: Provide mental health education and support materials

**Resource Types**:
- Articles (5-10 min reads)
- Meditation guides (10-25 min sessions)
- Videos (15-30 min educational content)
- Breathing exercises (quick techniques)

**Features**:
- Real-time search filtering
- Category tags (Mental Health, Mindfulness, Growth, Balance)
- Featured content spotlight section
- Resource cards with duration and type indicators

**Content Organization**:
```
All Resources (Default)
├── Mental Health
├── Mindfulness
├── Wellbeing
├── Growth
└── Balance
```

### 4. Activity Tracker

**Purpose**: Monitor healthy habits and lifestyle balance

**Tracked Activities**:
1. **Exercise** - Weekly goal: 300 minutes
2. **Sleep** - Weekly goal: 56 hours (8hrs/night)
3. **Meditation** - Weekly goal: 140 minutes (20min/day)

**Visual Elements**:
- Progress bars with percentage completion
- Streak counters (🔥 icon)
- 7-day calendar with daily activity breakdown
- Achievement badges (unlockable milestones)

**Gamification**:
- 7-Day Streak badge
- Early Bird achievement
- Workout Warrior challenge
- Zen Master milestone

### 5. Feedback System

**Purpose**: Collect anonymous employee input safely

**Rating System**:
- 5-star rating (required)
- Emotional feedback indicators (Excellent → Needs improvement)

**Feedback Categories**:
- App Experience
- Wellness Resources
- Support Services
- Feature Request
- Bug Report
- Other

**Privacy Assurance**:
- 100% anonymous submission
- No identifying information collected
- Shield icon and privacy notice prominent

**Transparency Feature**:
- "What We've Improved" section
- Shows implemented feedback
- Builds trust and engagement

### 6. AI Chatbot (Core Innovation)

**Purpose**: Provide intelligent, 24/7 mental wellness support

**Conversation Engine**:
The chatbot uses keyword-based response matching for:
- Stress management
- Anxiety support
- Burnout recognition
- Sleep improvement
- Depression detection
- Crisis intervention

**Response Categories**:

1. **Stress Relief**
   - Deep breathing exercises
   - Mindfulness techniques
   - Physical activity suggestions
   - Boundary-setting advice

2. **Anxiety Management**
   - 5-4-3-2-1 grounding technique
   - Present-moment awareness
   - Cognitive reframing
   - Professional resource referrals

3. **Crisis Intervention**
   - Automatic detection of suicide keywords
   - Immediate emergency resource provision
   - National Crisis Hotline: 988
   - Crisis Text Line: HOME to 741741
   - 911 for immediate emergencies

4. **Sleep Optimization**
   - Sleep hygiene education
   - Bedtime routine creation
   - Environmental optimization
   - Caffeine timing guidance

5. **Work-Life Balance**
   - Boundary establishment
   - Time management strategies
   - Technology-free periods
   - Hobby engagement encouragement

**UI Features**:
- Message bubbles (user: blue, bot: emerald)
- Typing indicator with animated dots
- Timestamp display
- Quick action buttons
- Scroll-to-bottom automation
- Emergency banner always visible

**Safety Mechanisms**:
```
Crisis Keywords Detected → Immediate Emergency Resources → Professional Referral
```

### 7. Support Hub

**Purpose**: Connect users to professional help and emergency services

**Emergency Contacts**:
1. National Crisis Hotline: 988
2. Mental Health Support: 1-800-662-4357 (SAMHSA)
3. Crisis Text Line: Text HOME to 741741

**Support Channels**:
1. **Live Chat** - Instant connection (Available now)
2. **Video Consultation** - Scheduled therapy (24hr booking)
3. **Email Support** - Secure messaging (48hr response)
4. **Peer Support Groups** - Community sessions

**Support Request Form**:
- Request type selection
- Urgency level (Low, Medium, High)
- Optional detailed message
- Confidential submission

## Installation & Setup

### Prerequisites
```bash
Node.js v16 or higher
npm or yarn package manager
```

### Installation Steps

1. **Navigate to project directory**
```bash
cd MURUGA/muruga-app
```

2. **Install dependencies**
```bash
npm install
```
*Note: Use `--legacy-peer-deps` if version conflicts occur*

3. **Start development server**
```bash
npm run dev
```

4. **Access application**
```
http://localhost:5173
```

### Build for Production

```bash
npm run build
```

Output directory: `dist/`

### Environment Configuration

No environment variables required for frontend-only version.

Future backend integration will require:
```
VITE_API_URL=
VITE_AUTH_DOMAIN=
VITE_ANALYTICS_ID=
```

## Dependencies

### Core Dependencies
```json
{
  "react": "^18.3.1",           // UI framework
  "react-dom": "^18.3.1",       // DOM rendering
  "lucide-react": "^0.263.1",   // Icon library
  "recharts": "^2.10.3"         // Chart visualization
}
```

### Development Dependencies
```json
{
  "vite": "^5.0.8",             // Build tool
  "tailwindcss": "^3.4.0",      // Utility CSS
  "autoprefixer": "^10.4.16",   // CSS compatibility
  "postcss": "^8.4.32"          // CSS processing
}
```

## Performance Optimization

### Current Optimizations
- Code splitting via Vite
- Lazy loading for large components
- CSS purging via Tailwind
- Asset optimization in production builds

### Recommended Enhancements
- React.lazy() for route-based code splitting
- Image optimization with next-gen formats
- Service worker for offline capability
- CDN integration for static assets

## Security Considerations

### Current Implementation
- Frontend-only (no sensitive data storage)
- Anonymous feedback (no PII collection)
- Emergency resources (public information)

### Future Requirements
- HTTPS enforcement
- Content Security Policy headers
- OWASP security best practices
- HIPAA compliance for health data
- End-to-end encryption for chat
- Regular security audits

## Accessibility Features

### WCAG 2.1 Level AA Compliance
✅ Color contrast ratios exceed 4.5:1
✅ Keyboard navigation support
✅ Semantic HTML structure
✅ ARIA labels where appropriate
✅ Focus indicators visible
✅ Responsive text sizing

### Screen Reader Support
- Proper heading hierarchy (h1 → h6)
- Alt text for decorative icons
- Form labels associated with inputs
- Skip navigation links (future)

## Browser Support

### Tested Browsers
- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅

### Mobile Browsers
- iOS Safari 14+ ✅
- Chrome Mobile 90+ ✅
- Samsung Internet 14+ ✅

## Deployment Options

### Static Hosting (Recommended)
- Vercel (auto-deploys from Git)
- Netlify (CI/CD integration)
- GitHub Pages (free hosting)
- AWS S3 + CloudFront
- Azure Static Web Apps

### Build Command
```bash
npm run build
```

### Deploy Directory
```
dist/
```

## Troubleshooting

### Common Issues

**Issue**: `npm install` fails with peer dependency errors
**Solution**: 
```bash
npm install --legacy-peer-deps
```

**Issue**: Charts not rendering
**Solution**: Ensure Recharts is properly installed and imported

**Issue**: Tailwind styles not applying
**Solution**: Verify tailwind.config.js includes all source paths

## Contributing Guidelines

### Code Style
- Use functional components with hooks
- Follow Airbnb React style guide
- Prettier for code formatting
- ESLint for code quality

### Commit Message Format
```
feat: Add new feature
fix: Bug fix
docs: Documentation update
style: Code style change
refactor: Code refactoring
test: Test addition/update
chore: Build/tooling change
```

## License

This project is created for educational and demonstration purposes.

## Support & Contact

For questions or issues:
- GitHub Issues: [Repository Link]
- Email: support@muruga-wellness.com
- Documentation: This file

---

**Version**: 1.0.0  
**Last Updated**: February 2026  
**Platform**: MURUGA Wellness Platform  
**Built with**: React + Tailwind CSS + ❤️
