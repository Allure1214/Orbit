'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckSquare, Square, Plus, Calendar, Flag } from 'lucide-react'

interface Task {
  id: string
  title: string
  completed: boolean
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  dueDate?: string
}

const priorityColors = {
  LOW: 'text-green-600',
  MEDIUM: 'text-yellow-600',
  HIGH: 'text-orange-600',
  URGENT: 'text-red-600'
}

const priorityIcons = {
  LOW: '🟢',
  MEDIUM: '🟡',
  HIGH: '🟠',
  URGENT: '🔴'
}

export default function TaskWidget() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading tasks
    setTimeout(() => {
      setTasks([
        { id: '1', title: 'Complete project proposal', completed: false, priority: 'HIGH', dueDate: '2024-01-15' },
        { id: '2', title: 'Review team feedback', completed: true, priority: 'MEDIUM', dueDate: '2024-01-14' },
        { id: '3', title: 'Update documentation', completed: false, priority: 'LOW', dueDate: '2024-01-20' },
        { id: '4', title: 'Prepare presentation', completed: false, priority: 'URGENT', dueDate: '2024-01-13' }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask,
        completed: false,
        priority: 'MEDIUM'
      }
      setTasks([...tasks, task])
      setNewTask('')
    }
  }

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const completedTasks = tasks.filter(task => task.completed).length
  const totalTasks = tasks.length

  if (loading) {
    return (
      <Card className="widget">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5" />
            Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="widget">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckSquare className="h-5 w-5" />
          Tasks
          <span className="text-sm font-normal text-muted-foreground">
            ({completedTasks}/{totalTasks})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Add Task */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              placeholder="Add a new task..."
              className="flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addTask}
              className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Task List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                  task.completed ? 'opacity-60' : ''
                }`}
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  className="flex-shrink-0"
                >
                  {task.completed ? (
                    <CheckSquare className="h-4 w-4 text-green-500" />
                  ) : (
                    <Square className="h-4 w-4 text-gray-400" />
                  )}
                </button>
                
                <div className="flex-1 min-w-0">
                  <div className={`text-sm ${task.completed ? 'line-through' : ''}`}>
                    {task.title}
                  </div>
                  {task.dueDate && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-1">
                  <span className="text-xs">{priorityIcons[task.priority]}</span>
                  <Flag className={`h-3 w-3 ${priorityColors[task.priority]}`} />
                </div>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          {totalTasks > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{Math.round((completedTasks / totalTasks) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
