import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import DashboardHeader from '@/components/DashboardHeader'
import QuickStats from '@/components/QuickStats'
import TaskWidget from '@/components/widgets/TaskWidget'
import WeatherWidget from '@/components/widgets/WeatherWidget'
import FinanceWidget from '@/components/widgets/FinanceWidget'
import NewsWidget from '@/components/widgets/NewsWidget'
import F1Widget from '@/components/widgets/F1Widget'
import NotesWidget from '@/components/widgets/NotesWidget'
import CurrencyWidget from '@/components/widgets/CurrencyWidget'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/')
  }

  // Fetch user preferences
  let user = await prisma.user.findUnique({
    where: { email: session.user?.email! },
    include: { preferences: true }
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: session.user?.email!,
        name: session.user?.name || null,
        image: session.user?.image || null,
      },
      include: { preferences: true }
    })
  }

  // Create default preferences if they don't exist
  if (!user.preferences) {
    await prisma.userPreferences.create({
      data: {
        userId: user.id,
        theme: 'dark',
        monthlyBudget: 2000.0,
        currency: 'USD',
        newsCategories: ['technology', 'business', 'health'],
        enabledWidgets: {
          tasks: true,
          weather: true,
          finance: true,
          news: true,
          f1: true,
          notes: true,
          currency: true
        } as any
      }
    })
  }

  // Get enabled widgets (default to all enabled if not set)
  const enabledWidgets = (user.preferences as any)?.enabledWidgets || {
    tasks: true,
    weather: true,
    finance: true,
    news: true,
    f1: true,
    notes: true,
    currency: true
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <DashboardHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <QuickStats />
        
        {/* Main Widgets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {enabledWidgets.tasks && <TaskWidget />}
          {enabledWidgets.weather && <WeatherWidget />}
          {enabledWidgets.finance && <FinanceWidget />}
          {enabledWidgets.news && <NewsWidget />}
          {enabledWidgets.f1 && <F1Widget />}
          {enabledWidgets.notes && <NotesWidget />}
          {enabledWidgets.currency && <CurrencyWidget />}
        </div>
      </div>
    </div>
  )
}
