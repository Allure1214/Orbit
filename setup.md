# Orbit Dashboard Setup Guide

## 🚀 Quick Start

Your Orbit Smart Personal Dashboard is now set up! Here's how to get it running:

### 1. Environment Setup
1. Copy the environment file:
   ```bash
   copy env.example .env.local
   ```

2. Edit `.env.local` and add your API keys:
   - Get OpenWeather API key: https://openweathermap.org/api
   - Get News API key: https://newsapi.org/
   - Get OpenAI API key: https://platform.openai.com/
   - Get Google OAuth credentials: https://console.developers.google.com/

### 2. Database Setup
1. Set up a PostgreSQL database (local or cloud)
2. Update the `DATABASE_URL` in `.env.local`
3. Run database commands:
   ```bash
   npm run db:generate
   npm run db:push
   ```

### 3. Start Development
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your dashboard!

## 📁 Project Structure

```
orbit-dashboard/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── providers.tsx      # Context providers
├── components/            # Reusable components
├── lib/                  # Utility functions
│   ├── auth.ts           # Authentication config
│   ├── db.ts             # Database connection
│   └── api.ts            # API utilities
├── prisma/               # Database schema
├── types/                # TypeScript types
└── public/               # Static assets
```

## 🎯 Next Steps

1. **Set up authentication** - Configure Google OAuth
2. **Add database** - Set up PostgreSQL and run migrations
3. **Configure APIs** - Add your API keys
4. **Build widgets** - Create individual dashboard components
5. **Add AI features** - Implement OpenAI integration
6. **Deploy** - Deploy to Vercel or your preferred platform

## 🛠 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

## 🔧 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma, PostgreSQL
- **Authentication**: NextAuth.js with Google OAuth
- **APIs**: OpenWeather, NewsAPI, Ergast F1 API, OpenAI
- **State Management**: Zustand
- **Charts**: Recharts

Your Orbit dashboard is ready to go! 🚀
