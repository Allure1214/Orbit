'use client'

import { useState } from 'react'

interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export default function NotesWidget() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Project Ideas',
      content: 'Brainstorming new features for the dashboard. Consider adding dark mode toggle and customizable widgets.',
      tags: ['work', 'ideas'],
      createdAt: '2024-01-12T10:00:00Z',
      updatedAt: '2024-01-12T10:00:00Z'
    },
    {
      id: '2',
      title: 'Meeting Notes',
      content: 'Team standup: Discussed quarterly goals, budget allocation, and upcoming deadlines.',
      tags: ['meeting', 'work'],
      createdAt: '2024-01-11T14:30:00Z',
      updatedAt: '2024-01-11T14:30:00Z'
    },
    {
      id: '3',
      title: 'Personal Goals',
      content: 'Learn TypeScript, read 2 books this month, exercise 3 times a week.',
      tags: ['personal', 'goals'],
      createdAt: '2024-01-10T09:15:00Z',
      updatedAt: '2024-01-10T09:15:00Z'
    }
  ])

  const [newNote, setNewNote] = useState({ title: '', content: '', tags: '' })
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)

  const addNote = () => {
    if (newNote.title.trim() && newNote.content.trim()) {
      const note: Note = {
        id: Date.now().toString(),
        title: newNote.title,
        content: newNote.content,
        tags: newNote.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setNotes([note, ...notes])
      setNewNote({ title: '', content: '', tags: '' })
      setShowAddForm(false)
    }
  }

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id))
    if (selectedNote?.id === id) {
      setSelectedNote(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTagColor = (tag: string) => {
    const colors = [
      'bg-blue-500/20 text-blue-400',
      'bg-green-500/20 text-green-400',
      'bg-purple-500/20 text-purple-400',
      'bg-orange-500/20 text-orange-400',
      'bg-red-500/20 text-red-400',
      'bg-yellow-500/20 text-yellow-400'
    ]
    const index = tag.length % colors.length
    return colors[index]
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Notes</h3>
          <p className="text-white/70 text-sm">Rich text notes and journal</p>
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

      {/* Add Note Form */}
      {showAddForm && (
        <div className="mb-4 p-4 bg-white/5 rounded-lg">
          <input
            type="text"
            placeholder="Note title..."
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            className="w-full bg-transparent text-white placeholder-white/50 border border-white/20 rounded px-3 py-2 text-sm mb-3"
          />
          <textarea
            placeholder="Note content..."
            value={newNote.content}
            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            rows={3}
            className="w-full bg-transparent text-white placeholder-white/50 border border-white/20 rounded px-3 py-2 text-sm mb-3"
          />
          <input
            type="text"
            placeholder="Tags (comma separated)..."
            value={newNote.tags}
            onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
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
              onClick={addNote}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
            >
              Add Note
            </button>
          </div>
        </div>
      )}

      {/* Notes List */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {notes.map((note) => (
          <div
            key={note.id}
            className={`p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer ${
              selectedNote?.id === note.id ? 'ring-2 ring-blue-500/50' : ''
            }`}
            onClick={() => setSelectedNote(selectedNote?.id === note.id ? null : note)}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-white font-medium text-sm line-clamp-1">
                {note.title}
              </h4>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  deleteNote(note.id)
                }}
                className="p-1 text-white/50 hover:text-red-400 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            
            <p className="text-white/70 text-xs line-clamp-2 mb-3">
              {note.content}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {note.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getTagColor(tag)}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <span className="text-white/50 text-xs">
                {formatDate(note.updatedAt)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {notes.length === 0 && (
        <div className="text-center py-8">
          <p className="text-white/50">No notes yet. Create your first note!</p>
        </div>
      )}

      {/* Note Detail Modal */}
      {selectedNote && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">{selectedNote.title}</h3>
              <button
                onClick={() => setSelectedNote(null)}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="text-white/70 text-sm mb-4 whitespace-pre-wrap">
              {selectedNote.content}
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedNote.tags.map((tag, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getTagColor(tag)}`}
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="text-white/50 text-xs">
              Created: {formatDate(selectedNote.createdAt)} • 
              Updated: {formatDate(selectedNote.updatedAt)}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
