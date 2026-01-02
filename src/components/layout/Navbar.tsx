'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { LogOut, User, Menu, X, Loader2 } from 'lucide-react'

export function Navbar() {
  const { data: session, status } = useSession()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isLoading = status === 'loading'
  const isSignedIn = status === 'authenticated'

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: '/',
      redirect: true
    })
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b-[5px] border-primary">
      <div className="container-app flex items-center justify-between h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="text-3xl transition-transform group-hover:scale-110">✊</div>
          <span className="font-display text-2xl font-bold text-primary">IGotYou</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/explore"
            className="font-display font-bold text-primary hover:text-accent transition-colors uppercase text-sm tracking-wide"
          >
            Explore
          </Link>

          {isLoading ? (
            <div className="w-10 h-10 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-accent" />
            </div>
          ) : isSignedIn ? (
            /* User Menu - Signed In */
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 px-4 py-2 border-[3px] border-primary hover:bg-bg-dark transition-all hover:-translate-y-0.5"
              >
                {/* Avatar */}
                <div className="w-10 h-10 border-[3px] border-primary bg-accent flex items-center justify-center text-white font-display font-bold text-sm">
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    session.user?.name?.[0]?.toUpperCase() || <User className="w-5 h-5" />
                  )}
                </div>
                <span className="hidden lg:block font-display font-bold text-primary uppercase text-sm max-w-[120px] truncate">
                  {session.user?.name || session.user?.email?.split('@')[0]}
                </span>
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
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white border-brutal z-20">
                    {/* User Info */}
                    <div className="px-6 py-4 border-b-[3px] border-primary bg-bg-dark">
                      <p className="font-display font-bold text-primary truncate uppercase text-sm mb-1">
                        {session.user?.name || 'User'}
                      </p>
                      <p className="text-xs text-text-muted truncate">
                        {session.user?.email}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        href="/my-petitions"
                        className="flex items-center gap-3 px-6 py-3 text-primary font-display font-bold uppercase text-sm hover:bg-secondary/20 transition-colors border-l-[5px] border-transparent hover:border-accent"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <User className="w-5 h-5" />
                        My Petitions
                      </Link>
                    </div>

                    {/* Sign Out */}
                    <div className="border-t-[3px] border-primary pt-2">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-6 py-3 text-accent font-display font-bold uppercase text-sm hover:bg-accent/10 transition-colors"
                      >
                        <LogOut className="w-5 h-5" />
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
              className="font-display font-bold text-primary hover:text-accent transition-colors uppercase text-sm tracking-wide px-4 py-2 border-[3px] border-primary hover:bg-bg-dark"
            >
              Sign In
            </Link>
          )}

          {/* Create Petition Button */}
          <Link
            href="/create"
            className="btn btn-primary"
          >
            Start Petition
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden w-12 h-12 flex items-center justify-center border-[3px] border-primary hover:bg-bg-dark transition-colors"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-primary" />
          ) : (
            <Menu className="w-6 h-6 text-primary" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t-[3px] border-primary">
          <div className="container-app py-6 space-y-4">
            <Link
              href="/explore"
              className="block font-display font-bold text-primary hover:text-accent transition-colors uppercase text-sm tracking-wide py-3 border-b-[3px] border-bg-dark"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Explore
            </Link>

            {isSignedIn ? (
              <>
                <Link
                  href="/my-petitions"
                  className="block font-display font-bold text-primary hover:text-accent transition-colors uppercase text-sm tracking-wide py-3 border-b-[3px] border-bg-dark"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Petitions
                </Link>
                <button
                  onClick={() => {
                    handleSignOut()
                    setIsMobileMenuOpen(false)
                  }}
                  className="block w-full text-left font-display font-bold text-accent uppercase text-sm tracking-wide py-3 border-b-[3px] border-bg-dark"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block font-display font-bold text-primary hover:text-accent transition-colors uppercase text-sm tracking-wide py-3 border-b-[3px] border-bg-dark"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            )}

            <Link
              href="/create"
              className="btn btn-primary w-full justify-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Start Petition
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
