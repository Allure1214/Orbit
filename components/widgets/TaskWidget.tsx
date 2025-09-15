'use client'

import { useState, useEffect } from 'react'

interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  dueDate?: string
  createdAt: string
  updatedAt: string
}

export default function TaskWidget() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'MEDIUM' as const, dueDate: '' })
  const [showAddForm, setShowAddForm] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/tasks')
      if (!response.ok) {
        throw new Error('Failed to fetch tasks')
      }
      const data = await response.json()
      setTasks(data)
    } catch (err) {
      setError('Failed to load tasks')
      console.error('Error fetching tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  // Load tasks on component mount
  useEffect(() => {
    fetchTasks()
  }, [])

  const addTask = async () => {
    if (!newTask.title.trim()) return

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTask.title,
          description: newTask.description,
          priority: newTask.priority,
          dueDate: newTask.dueDate || null,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create task')
      }

      const task = await response.json()
      setTasks([task, ...tasks])
      setNewTask({ title: '', description: '', priority: 'MEDIUM', dueDate: '' })
      setShowAddForm(false)
    } catch (err) {
      setError('Failed to create task')
      console.error('Error creating task:', err)
    }
  }

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: !task.completed,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update task')
      }

      const updatedTask = await response.json()
      setTasks(tasks.map(t => t.id === id ? updatedTask : t))
    } catch (err) {
      setError('Failed to update task')
      console.error('Error updating task:', err)
    }
  }

  const deleteTask = async (id: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete task')
      }

      setTasks(tasks.filter(task => task.id !== id))
    } catch (err) {
      setError('Failed to delete task')
      console.error('Error deleting task:', err)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'text-red-400 bg-red-500/20'
      case 'HIGH': return 'text-orange-400 bg-orange-500/20'
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-500/20'
      case 'LOW': return 'text-green-400 bg-green-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  const completedTasks = tasks.filter(task => task.completed).length
  const totalTasks = tasks.length

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">Tasks</h3>
            <p className="text-white/70 text-sm">Loading tasks...</p>
          </div>
        </div>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-white/10 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Tasks</h3>
          <p className="text-white/70 text-sm">
            {completedTasks} of {totalTasks} completed
          </p>
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

      {/* Add Task Form */}
      {showAddForm && (
        <div className="mb-4 p-4 bg-white/5 rounded-lg">
          <input
            type="text"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            placeholder="Task title..."
            className="w-full bg-transparent text-white placeholder-white/50 border border-white/20 rounded px-3 py-2 text-sm mb-3"
            autoFocus
          />
          <textarea
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            placeholder="Description (optional)..."
            rows={2}
            className="w-full bg-transparent text-white placeholder-white/50 border border-white/20 rounded px-3 py-2 text-sm mb-3"
          />
          <div className="grid grid-cols-2 gap-3 mb-3">
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
              className="bg-white/10 text-white border border-white/20 rounded px-3 py-2 text-sm"
            >
              <option value="LOW" className="bg-gray-800">Low Priority</option>
              <option value="MEDIUM" className="bg-gray-800">Medium Priority</option>
              <option value="HIGH" className="bg-gray-800">High Priority</option>
              <option value="URGENT" className="bg-gray-800">Urgent</option>
            </select>
            <input
              type="date"
              value={newTask.dueDate}
              onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              className="bg-white/10 text-white border border-white/20 rounded px-3 py-2 text-sm"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1 text-white/70 hover:text-white text-sm"
            >
              Cancel
            </button>
            <button
              onClick={addTask}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
            >
              Add Task
            </button>
          </div>
        </div>
      )}

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

      {/* Task List */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center space-x-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors ${
              task.completed ? 'opacity-60' : ''
            }`}
          >
            <button
              onClick={() => toggleTask(task.id)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                task.completed
                  ? 'bg-green-500 border-green-500'
                  : 'border-white/30 hover:border-green-500'
              }`}
            >
              {task.completed && (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            
            <div className="flex-1 min-w-0">
              <p className={`text-white font-medium ${task.completed ? 'line-through' : ''}`}>
                {task.title}
              </p>
              {task.description && (
                <p className="text-white/70 text-xs mt-1 line-clamp-1">
                  {task.description}
                </p>
              )}
              {task.dueDate && (
                <p className="text-white/50 text-xs mt-1">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                className="p-1 text-white/50 hover:text-red-400 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-8">
          <p className="text-white/50">No tasks yet. Add one above!</p>
        </div>
      )}
    </div>
  )
}
