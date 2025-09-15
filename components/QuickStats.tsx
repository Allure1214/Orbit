'use client'

import { useState, useEffect } from 'react'

interface QuickStatsData {
  tasksCompleted: number
  totalTasks: number
  monthlyExpenses: number
  monthlyBudget: number
  currency: string
  notesCount: number
  currentStreak: number
}

export default function QuickStats() {
  const [stats, setStats] = useState<QuickStatsData>({
    tasksCompleted: 0,
    totalTasks: 0,
    monthlyExpenses: 0,
    monthlyBudget: 2000,
    currency: 'USD',
    notesCount: 0,
    currentStreak: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getCurrencySymbol = (currency: string) => {
    const symbols: { [key: string]: string } = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'MYR': 'RM',
      'SGD': 'S$',
      'JPY': '¥',
      'AUD': 'A$',
      'CAD': 'C$'
    }
    return symbols[currency] || '$'
  }

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch tasks
        const tasksResponse = await fetch('/api/tasks')
        const tasks = tasksResponse.ok ? await tasksResponse.json() : []
        const completedTasks = tasks.filter((task: any) => task.completed).length

        // Fetch expenses for current month
        const expensesResponse = await fetch('/api/expenses')
        const expenses = expensesResponse.ok ? await expensesResponse.json() : []
        const currentMonth = new Date().getMonth()
        const currentYear = new Date().getFullYear()
        const monthlyExpenses = expenses
          .filter((expense: any) => {
            const expenseDate = new Date(expense.date)
            return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
          })
          .reduce((sum: number, expense: any) => sum + expense.amount, 0)

        // Fetch user preferences for budget and currency
        const preferencesResponse = await fetch('/api/preferences')
        const preferences = preferencesResponse.ok ? await preferencesResponse.json() : {}
        const monthlyBudget = preferences.monthlyBudget || 2000
        const currency = preferences.currency || 'USD'

        // Fetch notes count
        const notesResponse = await fetch('/api/notes')
        const notes = notesResponse.ok ? await notesResponse.json() : []

        // Calculate current streak (simplified - consecutive days with completed tasks)
        const today = new Date()
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = new Date(today)
          date.setDate(date.getDate() - i)
          return date.toISOString().split('T')[0]
        })

        const tasksByDate = tasks.reduce((acc: any, task: any) => {
          if (task.completed && task.completedAt) {
            const date = new Date(task.completedAt).toISOString().split('T')[0]
            if (last7Days.includes(date)) {
              acc[date] = (acc[date] || 0) + 1
            }
          }
          return acc
        }, {})

        const currentStreak = last7Days.reduce((streak, date) => {
          if (tasksByDate[date] > 0) {
            return streak + 1
          }
          return streak
        }, 0)

        setStats({
          tasksCompleted: completedTasks,
          totalTasks: tasks.length,
          monthlyExpenses,
          monthlyBudget,
          currency,
          notesCount: notes.length,
          currentStreak
        })
      } catch (err) {
        setError('Failed to load stats')
        console.error('Error fetching stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-white/20 rounded w-24 mb-2"></div>
              <div className="h-8 bg-white/20 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="mb-8 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
        <p className="text-red-400 text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {/* Tasks Completed */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm">Tasks Completed</p>
            <p className="text-3xl font-bold text-white">{stats.tasksCompleted}</p>
            <p className="text-white/50 text-xs mt-1">
              of {stats.totalTasks} total
            </p>
          </div>
          <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Monthly Expenses */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm">This Month</p>
            <p className="text-3xl font-bold text-white">{getCurrencySymbol(stats.currency)}{stats.monthlyExpenses.toFixed(0)}</p>
            <p className="text-white/50 text-xs mt-1">
              of {getCurrencySymbol(stats.currency)}{stats.monthlyBudget} budget
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Notes Created */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm">Notes Created</p>
            <p className="text-3xl font-bold text-white">{stats.notesCount}</p>
            <p className="text-white/50 text-xs mt-1">
              total notes
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Current Streak */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm">Current Streak</p>
            <p className="text-3xl font-bold text-white">{stats.currentStreak}</p>
            <p className="text-white/50 text-xs mt-1">
              days active
            </p>
          </div>
          <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
