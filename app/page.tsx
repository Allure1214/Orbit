import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  
  if (session) {
    redirect('/dashboard')
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
              <span className="text-sm font-medium text-white/90">✨ Now Available</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight">
              Orbit
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 mb-4 max-w-3xl mx-auto leading-relaxed">
              Your Smart Personal Dashboard
            </p>
            
            <p className="text-lg text-white/70 mb-12 max-w-2xl mx-auto">
              Your one-stop hub for productivity, insights, and personal management. 
              Stay organized, track goals, and make informed decisions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/api/auth/signin"
                className="inline-flex items-center px-8 py-4 bg-white text-slate-900 font-semibold rounded-xl hover:bg-white/90 transition-all duration-200 transform hover:scale-105 shadow-2xl"
              >
                Get Started Today
              </a>
              <a
                href="#features"
                className="inline-flex items-center px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-200 backdrop-blur-sm"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-20 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Everything you need to stay organized
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Powerful features designed to boost your productivity and help you achieve your goals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Task Management */}
            <div className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500/30 transition-colors">
                <div className="text-2xl">📋</div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Task Management</h3>
              <p className="text-white/70 leading-relaxed">
                Create, edit, and track tasks with deadlines and priorities. Never miss an important deadline again.
              </p>
            </div>

            {/* Finance Tracking */}
            <div className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-500/30 transition-colors">
                <div className="text-2xl">💰</div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Finance Tracking</h3>
              <p className="text-white/70 leading-relaxed">
                Track your income, budget, and expenses with category-based analytics and insights.
              </p>
            </div>

            {/* Weather Widget */}
            <div className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-yellow-500/30 transition-colors">
                <div className="text-2xl">🌤️</div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Weather Widget</h3>
              <p className="text-white/70 leading-relaxed">
                Real-time local weather forecast with 7-day predictions to plan your activities.
              </p>
            </div>

            {/* AI Insights */}
            <div className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-500/30 transition-colors">
                <div className="text-2xl">⚡</div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">AI Insights</h3>
              <p className="text-white/70 leading-relaxed">
                Get daily summaries and intelligent insights powered by AI to optimize your productivity.
              </p>
            </div>

            {/* News & Trends */}
            <div className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-red-500/30 transition-colors">
                <div className="text-2xl">📰</div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">News & Trends</h3>
              <p className="text-white/70 leading-relaxed">
                Customizable news feed with AI-powered summarization to stay informed.
              </p>
            </div>

            {/* Notes & Journal */}
            <div className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-500/30 transition-colors">
                <div className="text-2xl">📝</div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Notes & Journal</h3>
              <p className="text-white/70 leading-relaxed">
                Rich text notes with tags and a searchable archive for all your thoughts and ideas.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to get organized?
          </h2>
          <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
            Join thousands of users who are transforming their productivity with Orbit.
          </p>
          <a
            href="/api/auth/signin"
            className="inline-flex items-center px-12 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-2xl"
          >
            Sign Up Now
          </a>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-white/50">© 2024 Orbit Dashboard. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
