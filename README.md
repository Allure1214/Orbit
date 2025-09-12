# Orbit - Smart Personal Dashboard

A modern, AI-powered personal dashboard for productivity, insights, and personal management.

## 🚀 Features

- **Calendar & Task Management** - Create, edit, and track tasks with deadlines and priorities
- **Notes & Journal** - Rich text notes with tags and searchable archive
- **Weather Widget** - Real-time weather forecasts with 7-day predictions
- **News & Insights** - Customizable news feed with AI-powered summaries
- **Finance Tracker** - Expense logging with category-based analytics
- **F1 Statistics** - Real-time F1 data and statistics
- **AI Integration** - Daily summaries and intelligent insights
- **Gamification** - Achievement system and streak tracking

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Zustand** - State management
- **Recharts** - Data visualization

### Backend
- **Next.js API Routes** - Backend API
- **PostgreSQL** - Database
- **Prisma** - ORM
- **NextAuth.js** - Authentication

### Integrations
- **OpenWeatherMap** - Weather data
- **NewsAPI** - News feed
- **Ergast API** - F1 statistics
- **Google Calendar** - Calendar sync
- **OpenAI** - AI features

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- API keys for external services

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd orbit-dashboard
```

2. Install dependencies
```bash
pnpm install
```

3. Set up environment variables
```bash
cp env.example .env.local
# Edit .env.local with your API keys and database URL
```

4. Set up the database
```bash
pnpm db:generate
pnpm db:push
```

5. Run the development server
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
orbit-dashboard/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   └── widgets/          # Dashboard widgets
├── lib/                  # Utility functions
│   ├── db.ts            # Database connection
│   ├── auth.ts          # Authentication config
│   └── api.ts           # API utilities
├── prisma/              # Database schema
├── public/              # Static assets
└── types/               # TypeScript types
```

## 🔧 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:push` - Push schema to database
- `pnpm db:migrate` - Run database migrations
- `pnpm db:studio` - Open Prisma Studio

## 🌐 API Endpoints

- `/api/auth/*` - Authentication
- `/api/tasks` - Task management
- `/api/notes` - Notes management
- `/api/expenses` - Financial tracking
- `/api/weather` - Weather data
- `/api/news` - News feed
- `/api/f1` - F1 statistics
- `/api/ai` - AI-powered features

## 🎨 Customization

The dashboard is fully customizable with:
- Drag & drop widget layout
- Dark/light mode themes
- Customizable news categories
- Personal achievement system
- Flexible financial categories

## 📝 License

MIT License - see LICENSE file for details
