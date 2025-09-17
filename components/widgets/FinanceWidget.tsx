'use client'

import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import * as XLSX from 'xlsx'

interface Expense {
  id: string
  amount: number
  description: string
  category: 'FOOD' | 'TRANSPORTATION' | 'ENTERTAINMENT' | 'SHOPPING' | 'BILLS' | 'HEALTHCARE' | 'EDUCATION' | 'OTHER'
  date: string
  createdAt: string
  updatedAt: string
}

export default function FinanceWidget() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newExpense, setNewExpense] = useState({ amount: '', description: '', category: 'FOOD' as const, date: '' })
  const [showAddForm, setShowAddForm] = useState(false)
  const [showChart, setShowChart] = useState(false)

  const categories = [
    { value: 'FOOD', label: 'Food' },
    { value: 'TRANSPORTATION', label: 'Transport' },
    { value: 'ENTERTAINMENT', label: 'Entertainment' },
    { value: 'SHOPPING', label: 'Shopping' },
    { value: 'BILLS', label: 'Bills' },
    { value: 'HEALTHCARE', label: 'Healthcare' },
    { value: 'EDUCATION', label: 'Education' },
    { value: 'OTHER', label: 'Other' }
  ]

  const [monthlyBudget, setMonthlyBudget] = useState(2000)
  const [currency, setCurrency] = useState('USD')
  
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const remainingBudget = monthlyBudget - totalExpenses

  // Fetch user preferences for budget
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await fetch('/api/preferences')
        if (response.ok) {
          const prefs = await response.json()
          setMonthlyBudget(prefs.monthlyBudget || 2000)
          setCurrency(prefs.currency || 'USD')
        }
      } catch (err) {
        console.error('Error fetching preferences:', err)
      }
    }
    fetchPreferences()
  }, [])

  // Fetch expenses from API
  const fetchExpenses = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/expenses')
      if (!response.ok) {
        throw new Error('Failed to fetch expenses')
      }
      const data = await response.json()
      setExpenses(data)
    } catch (err) {
      setError('Failed to load expenses')
      console.error('Error fetching expenses:', err)
    } finally {
      setLoading(false)
    }
  }

  // Load expenses on component mount
  useEffect(() => {
    fetchExpenses()
  }, [])

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'FOOD': 'bg-red-500',
      'TRANSPORTATION': 'bg-blue-500',
      'ENTERTAINMENT': 'bg-purple-500',
      'SHOPPING': 'bg-green-500',
      'BILLS': 'bg-yellow-500',
      'HEALTHCARE': 'bg-pink-500',
      'EDUCATION': 'bg-indigo-500',
      'OTHER': 'bg-gray-500'
    }
    return colors[category] || 'bg-gray-500'
  }

  const getCategoryLabel = (category: string) => {
    const categoryObj = categories.find(cat => cat.value === category)
    return categoryObj ? categoryObj.label : category
  }

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

  // Prepare data for Excel export
  const exportToExcel = () => {
    const exportData = expenses.map(expense => ({
      'Date': new Date(expense.date).toLocaleDateString(),
      'Description': expense.description,
      'Category': getCategoryLabel(expense.category),
      'Amount': expense.amount,
      'Currency': currency
    }))

    // Add summary row
    const summaryData = [
      { 'Date': '', 'Description': 'TOTAL EXPENSES', 'Category': '', 'Amount': totalExpenses, 'Currency': currency },
      { 'Date': '', 'Description': 'MONTHLY BUDGET', 'Category': '', 'Amount': monthlyBudget, 'Currency': currency },
      { 'Date': '', 'Description': 'REMAINING BUDGET', 'Category': '', 'Amount': remainingBudget, 'Currency': currency }
    ]

    const allData = [...exportData, ...summaryData]
    
    const ws = XLSX.utils.json_to_sheet(allData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Expenses')
    
    const fileName = `expenses_${new Date().toISOString().split('T')[0]}.xlsx`
    XLSX.writeFile(wb, fileName)
  }

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316']

  const addExpense = async () => {
    if (!newExpense.amount || !newExpense.description) return

    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: newExpense.amount,
          description: newExpense.description,
          category: newExpense.category,
          date: newExpense.date || new Date().toISOString().split('T')[0],
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create expense')
      }

      const expense = await response.json()
      setExpenses([expense, ...expenses])
      setNewExpense({ amount: '', description: '', category: 'FOOD', date: '' })
      setShowAddForm(false)
    } catch (err) {
      setError('Failed to create expense')
      console.error('Error creating expense:', err)
    }
  }

  const deleteExpense = async (id: string) => {
    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete expense')
      }

      setExpenses(expenses.filter(expense => expense.id !== id))
    } catch (err) {
      setError('Failed to delete expense')
      console.error('Error deleting expense:', err)
    }
  }

  // Calculate category totals
  const categoryTotals = categories.map(category => ({
    category: category.value,
    label: category.label,
    total: expenses.filter(e => e.category === category.value).reduce((sum, e) => sum + e.amount, 0)
  })).filter(cat => cat.total > 0)

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Finance</h3>
            <p className="text-white/70 text-sm">Loading expenses...</p>
          </div>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="h-20 bg-white/10 rounded-lg"></div>
            <div className="h-20 bg-white/10 rounded-lg"></div>
          </div>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-white/10 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Prepare data for pie chart
  const chartData = categoryTotals.map(cat => ({
    name: cat.label,
    value: cat.total,
    color: getCategoryColor(cat.category).replace('bg-', '')
  }))

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Finance</h3>
          <p className="text-white/70 text-sm">Track your expenses</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={exportToExcel}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Export to Excel"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
          <button
            onClick={() => setShowChart(!showChart)}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Toggle Chart View"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Add Expense"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/5 rounded-lg p-4">
          <div className="text-white/70 text-sm mb-1">Total Spent</div>
          <div className="text-2xl font-bold text-white">{getCurrencySymbol(currency)}{totalExpenses.toFixed(2)}</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4">
          <div className="text-white/70 text-sm mb-1">Remaining</div>
          <div className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {getCurrencySymbol(currency)}{remainingBudget.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-300 text-xs mt-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Add Expense Form */}
      {showAddForm && (
        <div className="mb-4 p-4 bg-white/5 rounded-lg">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              type="number"
              placeholder="Amount"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              className="bg-transparent text-white placeholder-white/50 border border-white/20 rounded px-3 py-2 text-sm"
              step="0.01"
              min="0"
            />
            <select
              value={newExpense.category}
              onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value as any })}
              className="bg-white/10 text-white border border-white/20 rounded px-3 py-2 text-sm"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value} className="bg-gray-800">{cat.label}</option>
              ))}
            </select>
          </div>
          <input
            type="text"
            placeholder="Description"
            value={newExpense.description}
            onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
            className="w-full bg-transparent text-white placeholder-white/50 border border-white/20 rounded px-3 py-2 text-sm mb-3"
          />
          <input
            type="date"
            value={newExpense.date}
            onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
            className="w-full bg-transparent text-white border border-white/20 rounded px-3 py-2 text-sm mb-3"
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1 text-white/70 hover:text-white text-sm"
            >
              Cancel
            </button>
            <button
              onClick={addExpense}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
            >
              Add Expense
            </button>
          </div>
        </div>
      )}

      {/* Pie Chart */}
      {showChart && chartData.length > 0 && (
        <div className="mb-6">
          <h4 className="text-white/70 text-sm font-medium mb-3">Spending by Category</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${getCurrencySymbol(currency)}${value.toFixed(2)}`, 'Amount']}
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Legend 
                  wrapperStyle={{ color: 'white', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      <div className="mb-6">
        <h4 className="text-white/70 text-sm font-medium mb-3">Spending by Category</h4>
        <div className="space-y-2">
          {categoryTotals.map((cat, index) => (
            <div key={cat.category} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${getCategoryColor(cat.category)}`}></div>
                <span className="text-white text-sm">{cat.label}</span>
              </div>
              <span className="text-white font-medium">{getCurrencySymbol(currency)}{cat.total.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Expenses */}
      <div>
        <h4 className="text-white/70 text-sm font-medium mb-3">Recent Expenses</h4>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {expenses.slice(0, 5).map((expense) => (
            <div key={expense.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${getCategoryColor(expense.category)}`}></div>
                <div>
                  <div className="text-white text-sm">{expense.description}</div>
                  <div className="text-white/50 text-xs">{getCategoryLabel(expense.category)}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-white font-medium">{getCurrencySymbol(currency)}{expense.amount.toFixed(2)}</span>
                <button
                  onClick={() => deleteExpense(expense.id)}
                  className="p-1 text-white/50 hover:text-red-400 transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

