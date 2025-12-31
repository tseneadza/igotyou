'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, Mail, Loader2, AlertCircle } from 'lucide-react'
import { Button, Input } from '@/components/ui'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  
  const handleDemoLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    setIsLoading(true)
    
    await signIn('credentials', {
      email,
      callbackUrl,
    })
  }
  
  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    await signIn('google', { callbackUrl })
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full">
        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to home</span>
        </Link>
        
        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-medium">Sign in failed</p>
              <p className="text-sm">
                {error === 'OAuthCallback' && 'There was a problem with the OAuth callback. Please try again.'}
                {error === 'OAuthSignin' && 'Could not start the sign in process. Please try again.'}
                {error === 'Callback' && 'There was a problem during sign in. Please try again.'}
                {!['OAuthCallback', 'OAuthSignin', 'Callback'].includes(error) && error}
              </p>
            </div>
          </div>
        )}
        
        {/* Card */}
        <div className="card p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <span className="text-4xl">✊</span>
            <h1 className="font-display text-2xl font-bold text-gray-900 mt-2">
              Sign in to IGotYou
            </h1>
            <p className="text-gray-600 mt-2">
              Join the movement for workplace change
            </p>
          </div>
          
          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            {isGoogleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            <span className="font-medium text-gray-700">
              {isGoogleLoading ? 'Signing in...' : 'Continue with Google'}
            </span>
          </button>
          
          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">or use demo account</span>
            </div>
          </div>
          
          {/* Demo Email Login (development only) */}
          <form onSubmit={handleDemoLogin}>
            <Input
              type="email"
              label="Email address"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-4"
              isLoading={isLoading}
              leftIcon={!isLoading ? <Mail className="w-5 h-5" /> : undefined}
            >
              {isLoading ? 'Signing in...' : 'Continue with Demo'}
            </Button>
            
            <p className="text-xs text-center text-amber-600 mt-3">
              ⚠️ Demo login is for development only. Use Google for production.
            </p>
          </form>
          
          {/* Terms */}
          <p className="text-xs text-gray-500 text-center mt-6">
            By continuing, you agree to our{' '}
            <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
          </p>
        </div>
        
        {/* Privacy note */}
        <p className="text-center text-sm text-gray-500 mt-6">
          🔒 Your email is never shared publicly.
        </p>
      </div>
    </div>
  )
}
