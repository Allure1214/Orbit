import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import WeatherWidget from '@/components/widgets/WeatherWidget'
import TaskWidget from '@/components/widgets/TaskWidget'
import FinanceWidget from '@/components/widgets/FinanceWidget'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/')
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Orbit Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {session.user?.name}!</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <TaskWidget />
            <FinanceWidget />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <WeatherWidget />
            
            {/* Quick Stats */}
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tasks Completed</span>
                  <span className="font-medium">12/15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">This Week's Expenses</span>
                  <span className="font-medium">RM 245.30</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Productivity Score</span>
                  <span className="font-medium text-green-600">85%</span>
                </div>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium">Team Meeting</div>
                    <div className="text-xs text-muted-foreground">Tomorrow, 2:00 PM</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium">Project Deadline</div>
                    <div className="text-xs text-muted-foreground">Friday, 5:00 PM</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-medium">F1 Race Weekend</div>
                    <div className="text-xs text-muted-foreground">Sunday, 8:00 PM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
