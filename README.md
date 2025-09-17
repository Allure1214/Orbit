# Orbit - Smart Personal Dashboard

A modern, feature-rich personal dashboard for productivity, insights, and personal management. Built with Next.js 14 and designed for the ultimate user experience.

## ✨ Features

### 🎯 **Core Widgets**
- **📋 Task Management** - Create, edit, and track tasks with deadlines, priorities, and completion tracking
- **📝 Notes & Journal** - Rich text notes with tags, search functionality, and organized archive
- **🌤️ Weather Widget** - Real-time weather forecasts with 7-day predictions and expandable details
- **💰 Finance Tracker** - Expense logging with category analytics, budget tracking, and Excel export
- **📰 News Feed** - Customizable news with category filtering and user preferences
- **🏎️ F1 Statistics** - Real-time F1 data, race schedules, standings, and countdown timers
- **💱 Currency Tracker** - Real-time exchange rates with customizable base currencies
- **📅 Calendar & Events** - Event management with Google Calendar integration
- **⏰ Pomodoro Timer** - Focus sessions with customizable work/break cycles

### 🔐 **Authentication & Security**
- **Google OAuth** - Secure authentication with Google accounts
- **User Profiles** - Profile management with image uploads
- **Session Management** - Secure session handling with NextAuth.js

### 🎨 **User Experience**
- **Modern UI** - Dark theme with glassmorphism effects
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Widget Controls** - Enable/disable widgets based on your preferences
- **Real-time Updates** - Live data refresh across all widgets
- **Interactive Elements** - Smooth animations and hover effects

### 📊 **Data & Analytics**
- **Quick Stats** - Dashboard overview with key metrics
- **Check-in System** - Daily check-in tracking with streak counting
- **Expense Analytics** - Pie charts and category breakdowns
- **Productivity Tracking** - Task completion rates and streaks

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Full type safety
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **Recharts** - Data visualization
- **XLSX** - Excel export functionality

### Backend
- **Next.js API Routes** - Serverless backend
- **PostgreSQL** - Robust database
- **Prisma** - Type-safe ORM
- **NextAuth.js** - Authentication framework

### External APIs
- **Open-Meteo** - Free weather data
- **NewsAPI** - News feed integration
- **Ergast API** - F1 statistics
- **Frankfurter API** - Currency exchange rates
- **Google Calendar API** - Calendar synchronization

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Google OAuth credentials

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Allure1214/Orbit.git
cd Orbit
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp env.example .env.local
# Edit .env.local with your credentials
```

4. **Set up the database**
```bash
npx prisma db push
npx prisma generate
```

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/orbit_dashboard"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Google Calendar (Optional)
GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/google-calendar/callback"

# External APIs (Optional)
NEWS_API_KEY="your-news-api-key"
WEATHER_API_KEY="your-weather-api-key"
```

## 📁 Project Structure

```
Orbit/
├── app/                          # Next.js app directory
│   ├── api/                     # API routes
│   │   ├── auth/                # Authentication endpoints
│   │   ├── calendar/            # Calendar & events
│   │   ├── checkin/             # Check-in system
│   │   ├── currency/            # Currency exchange
│   │   ├── events/              # Event management
│   │   ├── expenses/            # Financial tracking
│   │   ├── f1/                  # F1 statistics
│   │   ├── news/                # News feed
│   │   ├── notes/               # Notes management
│   │   ├── preferences/         # User preferences
│   │   ├── profile/             # Profile management
│   │   └── tasks/               # Task management
│   ├── auth/                    # Authentication pages
│   ├── dashboard/               # Main dashboard
│   ├── preferences/             # User preferences
│   └── profile/                 # Profile settings
├── components/                   # Reusable components
│   ├── widgets/                 # Dashboard widgets
│   │   ├── CalendarWidget.tsx   # Calendar & events
│   │   ├── CurrencyWidget.tsx   # Currency tracker
│   │   ├── FinanceWidget.tsx    # Financial tracking
│   │   ├── F1Widget.tsx         # F1 statistics
│   │   ├── NewsWidget.tsx       # News feed
│   │   ├── NotesWidget.tsx      # Notes management
│   │   ├── PomodoroWidget.tsx   # Pomodoro timer
│   │   ├── TaskWidget.tsx       # Task management
│   │   └── WeatherWidget.tsx    # Weather forecast
│   ├── DashboardHeader.tsx      # Main header
│   └── QuickStats.tsx           # Dashboard stats
├── lib/                         # Utility functions
│   ├── auth.ts                  # Authentication config
│   ├── db.ts                    # Database connection
│   └── google-calendar.ts       # Google Calendar integration
├── prisma/                      # Database schema
│   └── schema.prisma            # Prisma schema
└── public/                      # Static assets
    ├── favicon.ico              # Site favicon
    └── logo.png                 # Dashboard logo
```

## 🌐 API Endpoints

### Authentication
- `GET/POST /api/auth/signin` - Sign in
- `GET /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get session

### Core Features
- `GET/POST /api/tasks` - Task management
- `PUT/DELETE /api/tasks/[id]` - Task operations
- `GET/POST /api/notes` - Notes management
- `DELETE /api/notes/[id]` - Delete notes
- `GET/POST /api/expenses` - Financial tracking
- `DELETE /api/expenses/[id]` - Delete expenses

### External Data
- `GET /api/weather` - Weather data
- `GET /api/news` - News feed
- `GET /api/f1` - F1 statistics
- `GET/POST /api/currency` - Currency exchange

### User Features
- `GET/PUT /api/preferences` - User preferences
- `GET/PUT /api/profile` - Profile management
- `POST /api/profile/upload` - Profile image upload
- `GET/POST /api/checkin` - Check-in system
- `GET/POST /api/events` - Event management

### Google Calendar
- `GET /api/auth/google-calendar` - OAuth initiation
- `GET /api/auth/google-calendar/callback` - OAuth callback
- `GET/POST /api/calendar/google-sync` - Calendar sync

## 🎨 Customization

### Widget Management
- **Enable/Disable Widgets** - Control which widgets appear on your dashboard
- **User Preferences** - Customize settings for each widget
- **Layout Control** - Responsive grid layout that adapts to your screen

### Personalization
- **Profile Management** - Upload profile pictures and manage account settings
- **Theme Consistency** - Dark theme throughout the application
- **Currency Preferences** - Set your preferred currency for financial tracking
- **News Categories** - Choose which news categories to follow

### Productivity Features
- **Check-in System** - Daily check-ins with streak tracking
- **Pomodoro Timer** - Customizable focus sessions
- **Task Priorities** - Organize tasks by importance
- **Event Types** - Categorize events (Personal, Work, Meeting, etc.)

## 📊 Widget Features

### Task Widget
- Create, edit, and delete tasks
- Priority levels (Low, Medium, High, Urgent)
- Due date tracking
- Completion status
- Real-time updates

### Finance Widget
- Expense tracking with categories
- Monthly budget management
- Currency support
- Excel export functionality
- Pie chart analytics
- Category-based spending analysis

### Weather Widget
- Real-time weather data
- 7-day forecast
- Expandable forecast details
- Location-based weather
- Auto-refresh functionality

### Calendar Widget
- Event creation and management
- Google Calendar integration
- Event types and categories
- Date and time management
- Location support

### Pomodoro Timer
- Customizable work/break cycles
- Auto-start options
- Progress tracking
- Session management
- Productivity insights

## 🔄 Data Flow

1. **User Authentication** - Google OAuth for secure access
2. **Data Fetching** - Real-time data from various APIs
3. **State Management** - React hooks for component state
4. **Database Storage** - PostgreSQL with Prisma ORM
5. **Real-time Updates** - Automatic data refresh across widgets

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify** - Static site hosting
- **Railway** - Full-stack deployment
- **DigitalOcean** - VPS deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Open-Meteo** - Free weather data API
- **NewsAPI** - News feed integration
- **Ergast API** - F1 statistics
- **Frankfurter** - Currency exchange rates
- **Google** - OAuth and Calendar APIs
- **Next.js Team** - Amazing React framework
- **Prisma Team** - Excellent database ORM

---

**Orbit Dashboard** - Your personal command center for productivity and insights! 🚀