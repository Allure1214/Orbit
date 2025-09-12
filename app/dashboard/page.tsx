import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/')
  }
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Welcome to Orbit, {session.user?.name}!</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Task Widget */}
          <div className="bg-card p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Tasks</h2>
            <p className="text-muted-foreground">Manage your tasks and deadlines</p>
          </div>
          
          {/* Weather Widget */}
          <div className="bg-card p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Weather</h2>
            <p className="text-muted-foreground">Current weather and forecast</p>
          </div>
          
          {/* Finance Widget */}
          <div className="bg-card p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Finance</h2>
            <p className="text-muted-foreground">Track expenses and budgets</p>
          </div>
          
          {/* News Widget */}
          <div className="bg-card p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">News</h2>
            <p className="text-muted-foreground">Stay updated with latest news</p>
          </div>
          
          {/* F1 Widget */}
          <div className="bg-card p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">F1 Statistics</h2>
            <p className="text-muted-foreground">Formula 1 races and standings</p>
          </div>
          
          {/* Notes Widget */}
          <div className="bg-card p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Notes</h2>
            <p className="text-muted-foreground">Rich text notes and journal</p>
          </div>
        </div>
      </div>
    </div>
  )
}
