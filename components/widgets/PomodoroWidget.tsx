'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, Square, RotateCcw, Settings, Clock } from 'lucide-react'

interface PomodoroSettings {
  workDuration: number // in minutes
  shortBreakDuration: number // in minutes
  longBreakDuration: number // in minutes
  longBreakInterval: number // after how many work sessions
  autoStartBreaks: boolean
  autoStartPomodoros: boolean
}

type PomodoroPhase = 'work' | 'shortBreak' | 'longBreak'

export default function PomodoroWidget() {
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [phase, setPhase] = useState<PomodoroPhase>('work')
  const [completedPomodoros, setCompletedPomodoros] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState<PomodoroSettings>({
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4,
    autoStartBreaks: false,
    autoStartPomodoros: false
  })

  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio()
    // You can add a notification sound here
  }, [])

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Timer finished
            handleTimerComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft])

  const handleTimerComplete = () => {
    setIsRunning(false)
    
    // Play notification sound
    if (audioRef.current) {
      audioRef.current.play().catch(console.error)
    }

    if (phase === 'work') {
      setCompletedPomodoros(prev => prev + 1)
      
      // Check if it's time for a long break
      const shouldTakeLongBreak = (completedPomodoros + 1) % settings.longBreakInterval === 0
      
      if (shouldTakeLongBreak) {
        setPhase('longBreak')
        setTimeLeft(settings.longBreakDuration * 60)
      } else {
        setPhase('shortBreak')
        setTimeLeft(settings.shortBreakDuration * 60)
      }
    } else {
      // Break finished, start work
      setPhase('work')
      setTimeLeft(settings.workDuration * 60)
    }

    // Auto-start if enabled
    if ((phase === 'work' && settings.autoStartBreaks) || 
        (phase !== 'work' && settings.autoStartPomodoros)) {
      setTimeout(() => setIsRunning(true), 1000)
    }
  }

  const startTimer = () => {
    setIsRunning(true)
  }

  const pauseTimer = () => {
    setIsRunning(false)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(settings.workDuration * 60)
    setPhase('work')
  }

  const skipPhase = () => {
    setIsRunning(false)
    if (phase === 'work') {
      setCompletedPomodoros(prev => prev + 1)
      const shouldTakeLongBreak = (completedPomodoros + 1) % settings.longBreakInterval === 0
      if (shouldTakeLongBreak) {
        setPhase('longBreak')
        setTimeLeft(settings.longBreakDuration * 60)
      } else {
        setPhase('shortBreak')
        setTimeLeft(settings.shortBreakDuration * 60)
      }
    } else {
      setPhase('work')
      setTimeLeft(settings.workDuration * 60)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getPhaseColor = () => {
    switch (phase) {
      case 'work': return 'text-red-400'
      case 'shortBreak': return 'text-green-400'
      case 'longBreak': return 'text-blue-400'
      default: return 'text-white'
    }
  }

  const getPhaseBgColor = () => {
    switch (phase) {
      case 'work': return 'bg-red-500/20'
      case 'shortBreak': return 'bg-green-500/20'
      case 'longBreak': return 'bg-blue-500/20'
      default: return 'bg-white/10'
    }
  }

  const getPhaseLabel = () => {
    switch (phase) {
      case 'work': return 'Focus Time'
      case 'shortBreak': return 'Short Break'
      case 'longBreak': return 'Long Break'
      default: return 'Pomodoro'
    }
  }

  const progress = (() => {
    const totalTime = phase === 'work' ? settings.workDuration * 60 :
                     phase === 'shortBreak' ? settings.shortBreakDuration * 60 :
                     settings.longBreakDuration * 60
    return ((totalTime - timeLeft) / totalTime) * 100
  })()

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Pomodoro Timer</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
          <h4 className="text-sm font-medium text-white mb-3">Timer Settings</h4>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-white/70 mb-1">Work (min)</label>
                <input
                  type="number"
                  value={settings.workDuration}
                  onChange={(e) => setSettings(prev => ({ ...prev, workDuration: parseInt(e.target.value) || 25 }))}
                  className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                  min="1"
                  max="60"
                />
              </div>
              <div>
                <label className="block text-xs text-white/70 mb-1">Short Break (min)</label>
                <input
                  type="number"
                  value={settings.shortBreakDuration}
                  onChange={(e) => setSettings(prev => ({ ...prev, shortBreakDuration: parseInt(e.target.value) || 5 }))}
                  className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                  min="1"
                  max="30"
                />
              </div>
              <div>
                <label className="block text-xs text-white/70 mb-1">Long Break (min)</label>
                <input
                  type="number"
                  value={settings.longBreakDuration}
                  onChange={(e) => setSettings(prev => ({ ...prev, longBreakDuration: parseInt(e.target.value) || 15 }))}
                  className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                  min="1"
                  max="60"
                />
              </div>
              <div>
                <label className="block text-xs text-white/70 mb-1">Long Break Interval</label>
                <input
                  type="number"
                  value={settings.longBreakInterval}
                  onChange={(e) => setSettings(prev => ({ ...prev, longBreakInterval: parseInt(e.target.value) || 4 }))}
                  className="w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                  min="2"
                  max="10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-white/70 text-sm">
                <input
                  type="checkbox"
                  checked={settings.autoStartBreaks}
                  onChange={(e) => setSettings(prev => ({ ...prev, autoStartBreaks: e.target.checked }))}
                  className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500/50"
                />
                <span>Auto-start breaks</span>
              </label>
              <label className="flex items-center space-x-2 text-white/70 text-sm">
                <input
                  type="checkbox"
                  checked={settings.autoStartPomodoros}
                  onChange={(e) => setSettings(prev => ({ ...prev, autoStartPomodoros: e.target.checked }))}
                  className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500/50"
                />
                <span>Auto-start pomodoros</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Timer Display */}
      <div className="text-center mb-6">
        <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-4 ${getPhaseBgColor()}`}>
          <Clock className="w-4 h-4 mr-2" />
          <span className={getPhaseColor()}>{getPhaseLabel()}</span>
        </div>
        
        <div className="text-6xl font-mono font-bold text-white mb-4">
          {formatTime(timeLeft)}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/10 rounded-full h-2 mb-4">
          <div 
            className={`h-2 rounded-full transition-all duration-1000 ${
              phase === 'work' ? 'bg-red-500' : 
              phase === 'shortBreak' ? 'bg-green-500' : 'bg-blue-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Completed Pomodoros */}
        <div className="text-white/70 text-sm mb-4">
          Completed: {completedPomodoros} pomodoros
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4">
        {!isRunning ? (
          <button
            onClick={startTimer}
            className="flex items-center space-x-2 px-6 py-3 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors font-medium"
          >
            <Play className="w-5 h-5" />
            <span>Start</span>
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="flex items-center space-x-2 px-6 py-3 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors font-medium"
          >
            <Pause className="w-5 h-5" />
            <span>Pause</span>
          </button>
        )}

        <button
          onClick={resetTimer}
          className="flex items-center space-x-2 px-4 py-3 bg-white/10 text-white/70 rounded-lg hover:bg-white/20 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>

        <button
          onClick={skipPhase}
          className="flex items-center space-x-2 px-4 py-3 bg-white/10 text-white/70 rounded-lg hover:bg-white/20 transition-colors"
        >
          <Square className="w-4 h-4" />
          <span>Skip</span>
        </button>
      </div>

      {/* Tips */}
      <div className="mt-6 p-3 bg-white/5 rounded-lg">
        <p className="text-white/60 text-xs text-center">
          💡 Focus for {settings.workDuration} minutes, then take a {settings.shortBreakDuration}-minute break. 
          After {settings.longBreakInterval} cycles, take a {settings.longBreakDuration}-minute long break.
        </p>
      </div>
    </div>
  )
}
