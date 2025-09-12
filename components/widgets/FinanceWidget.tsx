'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, TrendingUp, TrendingDown, PieChart } from 'lucide-react'

interface Expense {
  id: string
  amount: number
  description: string
  category: string
  date: string
}

const categories = {
  FOOD: { name: 'Food', color: 'bg-red-500', icon: '🍔' },
  TRANSPORTATION: { name: 'Transport', color: 'bg-blue-500', icon: '🚗' },
  ENTERTAINMENT: { name: 'Entertainment', color: 'bg-purple-500', icon: '🎬' },
  SHOPPING: { name: 'Shopping', color: 'bg-pink-500', icon: '🛍️' },
  BILLS: { name: 'Bills', color: 'bg-yellow-500', icon: '📄' },
  HEALTHCARE: { name: 'Healthcare', color: 'bg-green-500', icon: '🏥' },
  EDUCATION: { name: 'Education', color: 'bg-indigo-500', icon: '📚' },
  OTHER: { name: 'Other', color: 'bg-gray-500', icon: '📦' }
}

export default function FinanceWidget() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading expenses
    setTimeout(() => {
      setExpenses([
        { id: '1', amount: 25.50, description: 'Lunch', category: 'FOOD', date: '2024-01-12' },
        { id: '2', amount: 15.00, description: 'Bus fare', category: 'TRANSPORTATION', date: '2024-01-12' },
        { id: '3', amount: 120.00, description: 'Netflix subscription', category: 'ENTERTAINMENT', date: '2024-01-11' },
        { id: '4', amount: 45.80, description: 'Groceries', category: 'FOOD', date: '2024-01-11' },
        { id: '5', amount: 200.00, description: 'Electricity bill', category: 'BILLS', date: '2024-01-10' },
        { id: '6', amount: 80.00, description: 'Medicine', category: 'HEALTHCARE', date: '2024-01-10' }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount
    return acc
  }, {} as Record<string, number>)

  const topCategories = Object.entries(categoryTotals)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)

  if (loading) {
    return (
      <Card className="widget">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Finance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="widget">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Finance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Total Expenses */}
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">
              RM {totalExpenses.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">Total Expenses</div>
          </div>

          {/* Top Categories */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Top Categories
            </h4>
            <div className="space-y-1">
              {topCategories.map(([category, amount]) => {
                const categoryInfo = categories[category as keyof typeof categories]
                const percentage = ((amount / totalExpenses) * 100).toFixed(1)
                return (
                  <div key={category} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span>{categoryInfo.icon}</span>
                      <span>{categoryInfo.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{percentage}%</span>
                      <span className="font-medium">RM {amount.toFixed(2)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recent Expenses */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Recent Expenses</h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {expenses.slice(0, 4).map((expense) => {
                const categoryInfo = categories[expense.category as keyof typeof categories]
                return (
                  <div key={expense.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span>{categoryInfo.icon}</span>
                      <span className="truncate">{expense.description}</span>
                    </div>
                    <span className="font-medium">RM {expense.amount.toFixed(2)}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Budget Progress (Mock) */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Monthly Budget</span>
              <span>RM 1,500</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((totalExpenses / 1500) * 100, 100)}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground text-center">
              {totalExpenses > 1500 ? 'Over budget!' : `${((totalExpenses / 1500) * 100).toFixed(1)}% used`}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
