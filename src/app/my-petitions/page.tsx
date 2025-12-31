'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { 
  Plus, 
  FileText, 
  PenLine, 
  Users, 
  ArrowRight, 
  Loader2,
  CheckCircle2,
  Clock
} from 'lucide-react'
import { Navbar } from '@/components/layout'
import { Button } from '@/components/ui'
import { CATEGORY_LABELS } from '@/types'
import type { Petition, PetitionCategory } from '@/types'

type PetitionWithCount = Petition & {
  _count?: { signatures: number }
}

export default function MyPetitionsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [createdPetitions, setCreatedPetitions] = useState<PetitionWithCount[]>([])
  const [signedPetitions, setSignedPetitions] = useState<PetitionWithCount[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'created' | 'signed'>('created')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/my-petitions')
    }
  }, [status, router])

  useEffect(() => {
    if (session?.user?.id) {
      fetchPetitions()
    }
  }, [session])

  const fetchPetitions = async () => {
    setIsLoading(true)
    try {
      // Fetch petitions created by user
      const createdRes = await fetch(`/api/petitions?creatorId=${session?.user?.id}`)
      if (createdRes.ok) {
        const data = await createdRes.json()
        setCreatedPetitions(data.data || [])
      }

      // Fetch petitions signed by user
      const signedRes = await fetch(`/api/signatures?userId=${session?.user?.id}`)
      if (signedRes.ok) {
        const data = await signedRes.json()
        // Extract petitions from signatures
        const petitions = data.data?.map((sig: { petition: PetitionWithCount }) => sig.petition) || []
        setSignedPetitions(petitions)
      }
    } catch (error) {
      console.error('Error fetching petitions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-24 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect
  }

  const currentPetitions = activeTab === 'created' ? createdPetitions : signedPetitions

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-24 pb-12">
        <div className="container-app">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-gray-900">
                My Petitions
              </h1>
              <p className="text-gray-600 mt-1">
                Track and manage your advocacy efforts
              </p>
            </div>
            <Link href="/create">
              <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
                New Petition
              </Button>
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('created')}
              className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'created'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              <FileText className="w-4 h-4" />
              Created ({createdPetitions.length})
            </button>
            <button
              onClick={() => setActiveTab('signed')}
              className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === 'signed'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              <PenLine className="w-4 h-4" />
              Signed ({signedPetitions.length})
            </button>
          </div>

          {/* Content */}
          {currentPetitions.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                {activeTab === 'created' ? (
                  <FileText className="w-8 h-8 text-gray-400" />
                ) : (
                  <PenLine className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <h3 className="font-display text-xl font-semibold text-gray-900 mb-2">
                {activeTab === 'created' 
                  ? "You haven't created any petitions yet"
                  : "You haven't signed any petitions yet"
                }
              </h3>
              <p className="text-gray-600 mb-6">
                {activeTab === 'created'
                  ? "Start your first petition and make your voice heard"
                  : "Explore petitions and support causes you believe in"
                }
              </p>
              <Link href={activeTab === 'created' ? '/create' : '/explore'}>
                <Button variant="primary">
                  {activeTab === 'created' ? 'Create Petition' : 'Explore Petitions'}
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {currentPetitions.map((petition) => (
                <PetitionRow key={petition.id} petition={petition} showActions={activeTab === 'created'} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function PetitionRow({ 
  petition, 
  showActions 
}: { 
  petition: PetitionWithCount
  showActions: boolean 
}) {
  const signatureCount = petition._count?.signatures || 0
  const percentage = Math.min((signatureCount / petition.goal) * 100, 100)
  const isVictory = petition.status === 'VICTORY'

  return (
    <div className="card p-6 flex items-center gap-6">
      {/* Status indicator */}
      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
        isVictory ? 'bg-emerald-100' : 'bg-blue-100'
      }`}>
        {isVictory ? (
          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
        ) : (
          <FileText className="w-6 h-6 text-blue-600" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
            {CATEGORY_LABELS[petition.category as PetitionCategory]}
          </span>
          {isVictory && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
              Victory!
            </span>
          )}
        </div>
        <h3 className="font-semibold text-gray-900 truncate">
          {petition.title}
        </h3>
        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {signatureCount} / {petition.goal}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {formatDistanceToNow(new Date(petition.createdAt), { addSuffix: true })}
          </span>
        </div>
        
        {/* Progress bar */}
        <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${isVictory ? 'bg-emerald-500' : 'bg-blue-500'}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Link href={`/p/${petition.slug}`}>
          <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
            View
          </Button>
        </Link>
      </div>
    </div>
  )
}
