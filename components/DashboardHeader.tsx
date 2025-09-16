'use client'

import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect, useRef } from 'react'
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

export default function DashboardHeader() {
  const { data: session } = useSession()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fetch profile data to get updated image
  useEffect(() => {
    const fetchProfile = async () => {
      if (session?.user) {
        try {
          const response = await fetch('/api/profile')
          if (response.ok) {
            const profileData = await response.json()
            setProfile(profileData)
          }
        } catch (error) {
          console.error('Error fetching profile:', error)
        }
      }
    }

    fetchProfile()
  }, [session])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isProfileOpen])

  return (
    <header className="bg-white/10 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/20">
              <img 
                src="/logo.png" 
                alt="Orbit Logo" 
                className="w-8 h-8 object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Orbit Dashboard</h1>
              <p className="text-white/70 text-sm">Welcome back, {session?.user?.name}</p>
            </div>
          </div>

          {/* Navigation and Profile */}
          <div className="flex items-center space-x-4">
            {/* Quick Actions */}
            <div className="hidden md:flex items-center space-x-2">
              <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 1 0-15 0v5h5l-5 5-5-5h5V7a7.5 7.5 0 1 1 15 0v10z" />
                </svg>
              </button>
              <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 1 0-15 0v5h5l-5 5-5-5h5V7a7.5 7.5 0 1 1 15 0v10z" />
                </svg>
              </button>
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                  {profile?.image ? (
                    <img
                      src={profile.image}
                      alt={profile.name || 'Profile'}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-semibold text-sm">
                      {session?.user?.name?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>
                <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-md border border-white/30 rounded-xl py-2 shadow-2xl z-50">
                  <div className="px-4 py-3 border-b border-gray-200/20">
                    <p className="text-gray-900 font-semibold text-sm">{profile?.name || session?.user?.name}</p>
                    <p className="text-gray-600 text-xs">{profile?.email || session?.user?.email}</p>
                  </div>
                  <Link
                    href="/profile"
                    className="flex items-center w-full px-4 py-3 text-left text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile Settings
                  </Link>
                  <Link
                    href="/preferences"
                    className="flex items-center w-full px-4 py-3 text-left text-gray-700 hover:text-gray-900 hover:bg-gray-100/80 transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Preferences
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="flex items-center w-full px-4 py-3 text-left text-red-600 hover:text-red-700 hover:bg-red-50/80 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
