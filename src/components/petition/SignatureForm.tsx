'use client'

import { useState, FormEvent } from 'react'
import { Button, Textarea } from '@/components/ui'
import { CheckCircle2, Shield, Eye, EyeOff } from 'lucide-react'

interface SignatureFormProps {
  petitionId: string
  petitionTitle: string
  onSuccess?: () => void
  isSignedIn?: boolean
  userVerificationTier?: string
}

export function SignatureForm({
  petitionId,
  petitionTitle,
  onSuccess,
  isSignedIn = false,
  userVerificationTier = 'BASIC',
}: SignatureFormProps) {
  const [comment, setComment] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    
    try {
      const response = await fetch('/api/signatures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          petitionId,
          comment: comment.trim() || null,
          isAnonymous,
        }),
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to sign petition')
      }
      
      setSuccess(true)
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  if (success) {
    return (
      <div className="card p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
        <h3 className="font-display text-xl font-semibold text-gray-900 mb-2">
          Thank You for Signing!
        </h3>
        <p className="text-gray-600 mb-6">
          You&apos;ve added your voice to &quot;{petitionTitle}&quot;. Together, we can make a difference.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-emerald-600">
          <Shield className="w-4 h-4" />
          <span>Your signature has been recorded</span>
        </div>
      </div>
    )
  }
  
  if (!isSignedIn) {
    return (
      <div className="card p-6">
        <h3 className="font-display text-lg font-semibold text-gray-900 mb-4">
          Sign This Petition
        </h3>
        <p className="text-gray-600 mb-6">
          Sign in to add your signature and show your support.
        </p>
        <Button variant="primary" className="w-full" onClick={() => window.location.href = '/login'}>
          Sign In to Sign Petition
        </Button>
        <p className="text-xs text-gray-500 text-center mt-4">
          Your signature will be verified via email.
        </p>
      </div>
    )
  }
  
  return (
    <form onSubmit={handleSubmit} className="card p-6">
      <h3 className="font-display text-lg font-semibold text-gray-900 mb-4">
        Sign This Petition
      </h3>
      
      {/* Verification badge */}
      <div className="flex items-center gap-2 mb-6 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
        <Shield className="w-5 h-5 text-emerald-600" />
        <div>
          <span className="text-sm font-medium text-emerald-700">
            {userVerificationTier === 'VERIFIED_EMPLOYEE' && 'Verified Employee'}
            {userVerificationTier === 'VERIFIED_EMAIL' && 'Verified Email'}
            {userVerificationTier === 'ANONYMIZED_VERIFIED' && 'Anonymous Verified'}
            {userVerificationTier === 'BASIC' && 'Email Verified'}
          </span>
        </div>
      </div>
      
      {/* Optional comment */}
      <Textarea
        label="Why are you signing? (optional)"
        placeholder="Share why this matters to you..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        helperText="Your comment may be displayed publicly with your signature."
        className="mb-4"
      />
      
      {/* Anonymous toggle */}
      <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer mb-6 hover:bg-gray-100 transition-colors">
        <input
          type="checkbox"
          checked={isAnonymous}
          onChange={(e) => setIsAnonymous(e.target.checked)}
          className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {isAnonymous ? (
              <EyeOff className="w-4 h-4 text-gray-500" />
            ) : (
              <Eye className="w-4 h-4 text-gray-500" />
            )}
            <span className="font-medium text-gray-700">Sign anonymously</span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Your name won&apos;t be shown publicly, but your signature still counts.
          </p>
        </div>
      </label>
      
      {/* Error message */}
      {error && (
        <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}
      
      {/* Submit button */}
      <Button
        type="submit"
        variant="success"
        size="lg"
        className="w-full"
        isLoading={isSubmitting}
      >
        ✊ I Got You - Sign This Petition
      </Button>
      
      <p className="text-xs text-gray-500 text-center mt-4">
        By signing, you agree to our terms of service and privacy policy.
      </p>
    </form>
  )
}
