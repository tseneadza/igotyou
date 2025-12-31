'use client'

import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { Users, ArrowRight, CheckCircle2, Clock } from 'lucide-react'
import { clsx } from 'clsx'
import type { Petition, PetitionCategory, PetitionStatus } from '@/types'
import { CATEGORY_LABELS, STATUS_LABELS } from '@/types'

interface PetitionCardProps {
  petition: Petition & {
    _count?: { signatures: number }
    creator?: { name: string | null }
  }
}

export function PetitionCard({ petition }: PetitionCardProps) {
  const signatureCount = petition._count?.signatures || 0
  const percentage = Math.min((signatureCount / petition.goal) * 100, 100)
  const isVictory = petition.status === 'VICTORY'
  
  return (
    <Link 
      href={`/p/${petition.slug}`}
      className="block card p-6 hover:shadow-lg transition-all hover:-translate-y-1 group"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          {/* Category badge */}
          <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 mb-2">
            {CATEGORY_LABELS[petition.category as PetitionCategory]}
          </span>
          
          {/* Title */}
          <h3 className="font-display text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {petition.title}
          </h3>
        </div>
        
        {/* Status indicator */}
        {isVictory && (
          <div className="flex-shrink-0 p-2 bg-emerald-100 rounded-full">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
        )}
      </div>
      
      {/* Description preview */}
      <p className="text-gray-600 text-sm line-clamp-2 mb-4">
        {petition.description}
      </p>
      
      {/* Company/target */}
      {petition.company && (
        <p className="text-sm text-gray-500 mb-4">
          Target: <span className="font-medium">{petition.target}</span> at {petition.company}
        </p>
      )}
      
      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-1.5">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-gray-900">
              {signatureCount.toLocaleString()}
            </span>
            <span className="text-gray-500">signatures</span>
          </div>
          <span className="text-gray-500">Goal: {petition.goal.toLocaleString()}</span>
        </div>
        
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={clsx(
              'h-full rounded-full transition-all',
              isVictory
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                : 'bg-gradient-to-r from-blue-600 to-blue-400'
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      
      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>
            {formatDistanceToNow(new Date(petition.createdAt), { addSuffix: true })}
          </span>
        </div>
        
        <span className={clsx(
          'flex items-center gap-1 text-sm font-medium transition-colors',
          isVictory ? 'text-emerald-600' : 'text-blue-600 group-hover:text-blue-700'
        )}>
          {isVictory ? STATUS_LABELS[petition.status as PetitionStatus] : 'View & Sign'}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </Link>
  )
}
