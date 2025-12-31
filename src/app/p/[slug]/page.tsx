'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { 
  ArrowLeft, 
  Share2, 
  Flag, 
  Calendar,
  Building2,
  Target,
  Users,
  CheckCircle2,
  Shield,
  Loader2
} from 'lucide-react'
import { ProgressMeter, QRCodePanel, SignatureForm } from '@/components/petition'
import { Button } from '@/components/ui'
import { CATEGORY_LABELS, STATUS_LABELS } from '@/types'
import type { PetitionWithDetails, PetitionCategory, PetitionStatus } from '@/types'
import { clsx } from 'clsx'

export default function PetitionPage() {
  const params = useParams()
  const slug = params.slug as string
  const { data: session, status: sessionStatus } = useSession()
  
  const [petition, setPetition] = useState<PetitionWithDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const isSignedIn = sessionStatus === 'authenticated'
  const userVerificationTier = (session?.user as { verificationTier?: string })?.verificationTier || 'BASIC'
  
  useEffect(() => {
    const fetchPetition = async () => {
      try {
        // Include ref param if present in URL
        const url = new URL(window.location.href)
        const ref = url.searchParams.get('ref')
        const apiUrl = ref 
          ? `/api/petitions/${slug}?ref=${ref}`
          : `/api/petitions/${slug}`
        
        const response = await fetch(apiUrl)
        
        if (!response.ok) {
          throw new Error('Petition not found')
        }
        
        const { data } = await response.json()
        setPetition(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load petition')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchPetition()
  }, [slug])
  
  const handleSignSuccess = () => {
    // Refresh petition data to update signature count
    setPetition((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        _count: {
          ...prev._count,
          signatures: (prev._count?.signatures || 0) + 1,
        },
      }
    })
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }
  
  if (error || !petition) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Petition Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'This petition may have been removed.'}</p>
          <Link href="/explore">
            <Button variant="primary">Browse Petitions</Button>
          </Link>
        </div>
      </div>
    )
  }
  
  const signatureCount = petition._count?.signatures || 0
  const isVictory = petition.status === 'VICTORY'
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container-app flex items-center justify-between h-16">
          <Link href="/explore" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
            <span>All Petitions</span>
          </Link>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Button variant="ghost" size="sm">
              <Flag className="w-4 h-4" />
              Report
            </Button>
          </div>
        </div>
      </header>
      
      {/* Victory Banner */}
      {isVictory && (
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-4">
          <div className="container-app flex items-center justify-center gap-3">
            <CheckCircle2 className="w-6 h-6" />
            <span className="font-semibold text-lg">
              Victory! This petition achieved its goal.
            </span>
          </div>
        </div>
      )}
      
      <main className="container-app py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Category & Status */}
            <div className="flex items-center gap-3">
              <span className="badge badge-info">
                {CATEGORY_LABELS[petition.category as PetitionCategory]}
              </span>
              <span className={clsx(
                'badge',
                isVictory ? 'badge-success' : 'badge-warning'
              )}>
                {STATUS_LABELS[petition.status as PetitionStatus]}
              </span>
            </div>
            
            {/* Title */}
            <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900">
              {petition.title}
            </h1>
            
            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>Started {formatDistanceToNow(new Date(petition.createdAt), { addSuffix: true })}</span>
              </div>
              
              {petition.company && (
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" />
                  <span>{petition.company}</span>
                </div>
              )}
              
              <div className="flex items-center gap-1.5">
                <Target className="w-4 h-4" />
                <span>Target: {petition.target}</span>
              </div>
            </div>
            
            {/* Progress */}
            <div className="card p-6">
              <ProgressMeter
                current={signatureCount}
                goal={petition.goal}
                size="lg"
              />
            </div>
            
            {/* Description */}
            <div className="card p-6">
              <h2 className="font-display text-lg font-semibold text-gray-900 mb-4">
                About This Petition
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {petition.description}
                </p>
              </div>
            </div>
            
            {/* Updates */}
            {petition.updates && petition.updates.length > 0 && (
              <div className="card p-6">
                <h2 className="font-display text-lg font-semibold text-gray-900 mb-4">
                  Updates
                </h2>
                <div className="space-y-4">
                  {petition.updates.map((update) => (
                    <div key={update.id} className="border-l-4 border-blue-400 pl-4">
                      <h3 className="font-medium text-gray-900">{update.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {formatDistanceToNow(new Date(update.createdAt), { addSuffix: true })}
                      </p>
                      <p className="text-gray-700">{update.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Recent Signatures */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-semibold text-gray-900">
                  Recent Supporters
                </h2>
                <span className="text-sm text-gray-500">
                  <Users className="w-4 h-4 inline mr-1" />
                  {signatureCount} total
                </span>
              </div>
              
              <div className="space-y-3">
                {petition.signatures.slice(0, 10).map((signature) => (
                  <div key={signature.id} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                      {signature.isAnonymous ? '?' : signature.user?.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {signature.isAnonymous ? 'Anonymous' : signature.user?.name || 'Supporter'}
                        </span>
                        {signature.verifiedEmployee && (
                          <span className="badge badge-verified text-xs">
                            <Shield className="w-3 h-3 mr-1" />
                            Verified
                          </span>
                        )}
                      </div>
                      {signature.comment && (
                        <p className="text-sm text-gray-600 mt-1">&ldquo;{signature.comment}&rdquo;</p>
                      )}
                      <span className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(signature.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Sign Form */}
            {petition.status === 'ACTIVE' && (
              <SignatureForm
                petitionId={petition.id}
                petitionTitle={petition.title}
                onSuccess={handleSignSuccess}
                isSignedIn={isSignedIn}
                userVerificationTier={userVerificationTier}
              />
            )}
            
            {/* QR Code Panel */}
            <QRCodePanel
              petitionSlug={petition.slug}
              petitionTitle={petition.title}
            />
            
            {/* Creator Info */}
            <div className="card p-6">
              <h3 className="font-display text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Created By
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-lg">
                  {petition.creator.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{petition.creator.name || 'Anonymous'}</p>
                  <p className="text-sm text-gray-500">Petition Creator</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
