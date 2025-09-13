'use client'

import { useState } from 'react'

interface Expense {
  id: string
  amount: number
  description: string
  category: string
  date: string
}

export default function FinanceWidget() {
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: '1', amount: 45.50, description: 'Lunch', category: 'Food', date: '2024-01-12' },
    { id: '2', amount: 120.00, description: 'Transportation', category: 'Transport', date: '2024-01-11' },
    { id: '3', amount: 89.99, description: 'Entertainment', category: 'Entertainment', date: '2024-01-10' },
    { id: '4', amount: 200.00, description: 'Groceries', category: 'Food', date: '2024-01-09' },
    { id: '5', amount: 75.00, description: 'Utilities', category: 'Bills', date: '2024-01-08' },
  ])

  const [newExpense, setNewExpense] = useState({ amount: '', description: '', category: 'Food' })
  const [showAddForm, setShowAddForm] = useState(false)

  const categories = ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Other']
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const monthlyBudget = 2000
  const remainingBudget = monthlyBudget - totalExpenses

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Food': 'bg-red-500',
      'Transport': 'bg-blue-500',
      'Entertainment': 'bg-purple-500',
      'Bills': 'bg-yellow-500',
      'Shopping': 'bg-green-500',
      'Other': 'bg-gray-500'
    }
    return colors[category] || 'bg-gray-500'
  }

  const addExpense = () => {
    if (newExpense.amount && newExpense.description) {
      const expense: Expense = {
        id: Date.now().toString(),
        amount: parseFloat(newExpense.amount),
        description: newExpense.description,
        category: newExpense.category,
        date: new Date().toISOString().split('T')[0]
      }
      setExpenses([expense, ...expenses])
      setNewExpense({ amount: '', description: '', category: 'Food' })
      setShowAddForm(false)
    }
  }

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id))
  }

  // Calculate category totals
  const categoryTotals = categories.map(category => ({
    category,
    total: expenses.filter(e => e.category === category).reduce((sum, e) => sum + e.amount, 0)
  })).filter(cat => cat.total > 0)

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Finance</h3>
          <p className="text-white/70 text-sm">Track your expenses</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/5 rounded-lg p-4">
          <div className="text-white/70 text-sm mb-1">Total Spent</div>
          <div className="text-2xl font-bold text-white">${totalExpenses.toFixed(2)}</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4">
          <div className="text-white/70 text-sm mb-1">Remaining</div>
          <div className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            ${remainingBudget.toFixed(2)}
          </div>
        </div>
      </div>

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
            />
            <select
              value={newExpense.category}
              onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
              className="bg-white/10 text-white border border-white/20 rounded px-3 py-2 text-sm"
            >
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-gray-800">{cat}</option>
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
              Add
            </button>
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
                <span className="text-white text-sm">{cat.category}</span>
              </div>
              <span className="text-white font-medium">${cat.total.toFixed(2)}</span>
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
                  <div className="text-white/50 text-xs">{expense.category}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-white font-medium">${expense.amount.toFixed(2)}</span>
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
