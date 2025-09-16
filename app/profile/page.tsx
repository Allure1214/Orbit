'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface UserProfile {
  id: string
  name: string | null
  email: string
  image: string | null
  emailVerified: Date | null
  createdAt: Date
  updatedAt: Date
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    email: ''
  })
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user) {
        try {
          const response = await fetch('/api/profile')
          if (response.ok) {
            const profileData = await response.json()
            setProfile(profileData)
            setEditForm({
              name: profileData.name || '',
              email: profileData.email || ''
            })
          } else {
            // Fallback to session data
            setProfile({
              id: '',
              name: session.user.name || null,
              email: session.user.email || '',
              image: session.user.image || null,
              emailVerified: null,
              createdAt: new Date(),
              updatedAt: new Date()
            })
            setEditForm({
              name: session.user.name || '',
              email: session.user.email || ''
            })
          }
        } catch (error) {
          console.error('Error fetching profile:', error)
          // Fallback to session data
          setProfile({
            id: '',
            name: session.user.name || null,
            email: session.user.email || '',
            image: session.user.image || null,
            emailVerified: null,
            createdAt: new Date(),
            updatedAt: new Date()
          })
          setEditForm({
            name: session.user.name || '',
            email: session.user.email || ''
          })
        } finally {
          setLoading(false)
        }
      }
    }

    fetchProfile()
  }, [session])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditForm({
      name: profile?.name || '',
      email: profile?.email || ''
    })
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update profile')
      }

      const updatedProfile = await response.json()
      setProfile(updatedProfile)
      setIsEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
      console.error('Error updating profile:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB')
      return
    }

    try {
      setIsUploadingImage(true)
      setError(null)

      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/profile/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to upload image')
      }

      const updatedProfile = await response.json()
      setProfile(updatedProfile)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image')
      console.error('Error uploading image:', err)
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmEmail !== profile?.email) {
      setError('Email confirmation does not match')
      return
    }

    try {
      setIsDeleting(true)
      setError(null)
      
      const response = await fetch('/api/profile/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ confirmEmail: deleteConfirmEmail }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete account')
      }

      // Sign out and redirect
      await signOut({ callbackUrl: '/' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete account')
      console.error('Error deleting account:', err)
    } finally {
      setIsDeleting(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded-lg w-48 mb-8"></div>
            <div className="bg-white/10 rounded-2xl p-6">
              <div className="h-32 bg-white/10 rounded-lg mb-6"></div>
              <div className="space-y-4">
                <div className="h-4 bg-white/10 rounded w-3/4"></div>
                <div className="h-4 bg-white/10 rounded w-1/2"></div>
                <div className="h-4 bg-white/10 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
            <p className="text-white/70">Manage your account information and preferences</p>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Profile Information</h2>
                {!isEditing && (
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative group">
                      <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                        {profile?.image ? (
                          <img
                            src={profile.image}
                            alt={profile.name || 'Profile'}
                            className="w-20 h-20 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-white font-bold text-2xl">
                            {profile?.name?.charAt(0) || 'U'}
                          </span>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={isUploadingImage}
                            className="hidden"
                          />
                          {isUploadingImage ? (
                            <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full"></div>
                          ) : (
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          )}
                        </label>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {profile?.name || 'No name set'}
                      </h3>
                      <p className="text-white/70">{profile?.email}</p>
                      <p className="text-white/50 text-sm">Click on image to upload new photo</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/70 text-sm font-medium mb-1">
                        Member Since
                      </label>
                      <p className="text-white">
                        {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-white/70 text-sm font-medium mb-1">
                        Last Updated
                      </label>
                      <p className="text-white">
                        {profile?.updatedAt ? new Date(profile.updatedAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-6">
            {/* Account Actions */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Account Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/preferences"
                  className="flex items-center space-x-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-white/70">Preferences</span>
                </Link>
                
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-red-400 mb-4">Danger Zone</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center space-x-3 p-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors w-full"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Delete Account</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-red-400 mb-4">Delete Account</h3>
            <p className="text-white/70 mb-4">
              This action cannot be undone. This will permanently delete your account and all associated data.
            </p>
            <div className="mb-4">
              <label className="block text-white/70 text-sm font-medium mb-2">
                Type your email to confirm: <span className="text-white font-medium">{profile?.email}</span>
              </label>
              <input
                type="email"
                value={deleteConfirmEmail}
                onChange={(e) => setDeleteConfirmEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                placeholder="Enter your email address"
              />
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting || deleteConfirmEmail !== profile?.email}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Deleting...' : 'Delete Account'}
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteConfirmEmail('')
                  setError(null)
                }}
                className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
