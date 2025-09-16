import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import DashboardHeader from '@/components/DashboardHeader'
import QuickStats from '@/components/QuickStats'
import TaskWidget from '@/components/widgets/TaskWidget'
import WeatherWidget from '@/components/widgets/WeatherWidget'
import FinanceWidget from '@/components/widgets/FinanceWidget'
import NewsWidget from '@/components/widgets/NewsWidget'
import F1Widget from '@/components/widgets/F1Widget'
import NotesWidget from '@/components/widgets/NotesWidget'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/')
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <DashboardHeader />
      
      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <QuickStats />
        
        {/* Main Widgets Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <TaskWidget />
          <WeatherWidget />
          <FinanceWidget />
          <NewsWidget />
          <F1Widget />
          <NotesWidget />
        </div>
      </div>
    </div>
  )
}
