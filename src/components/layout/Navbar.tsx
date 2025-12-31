'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { LogOut, User, ChevronDown, Loader2 } from 'lucide-react'

export function Navbar() {
  const { data: session, status } = useSession()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  
  const isLoading = status === 'loading'
  const isSignedIn = status === 'authenticated'
  
  const handleSignOut = async () => {
    // Clear session and redirect to home
    await signOut({ 
      callbackUrl: '/',
      redirect: true 
    })
  }
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container-app flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">✊</span>
          <span className="font-display text-xl font-bold text-gray-900">IGotYou</span>
        </Link>
        
        {/* Navigation Items */}
        <div className="flex items-center gap-4">
          <Link 
            href="/explore" 
            className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            Explore
          </Link>
          
          {isLoading ? (
            <div className="w-8 h-8 flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            </div>
          ) : isSignedIn ? (
            /* User Menu - Signed In */
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium text-sm">
                  {session.user?.image ? (
                    <img 
                      src={session.user.image} 
                      alt={session.user.name || 'User'} 
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    session.user?.name?.[0]?.toUpperCase() || <User className="w-4 h-4" />
                  )}
                </div>
                <span className="hidden sm:block text-gray-700 font-medium max-w-[120px] truncate">
                  {session.user?.name || session.user?.email?.split('@')[0]}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  
                  {/* Menu */}
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-medium text-gray-900 truncate">
                        {session.user?.name || 'User'}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {session.user?.email}
                      </p>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="py-1">
                      <Link
                        href="/my-petitions"
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        My Petitions
                      </Link>
                    </div>
                    
                    {/* Sign Out */}
                    <div className="border-t border-gray-100 pt-1">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Sign In - Not Signed In */
            <Link 
              href="/login" 
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Sign In
            </Link>
          )}
          
          {/* Create Petition Button */}
          <Link 
            href="/create" 
            className="btn btn-primary"
          >
            Start a Petition
          </Link>
        </div>
      </div>
    </nav>
  )
}
