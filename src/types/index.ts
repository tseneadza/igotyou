// IGotYou - Type definitions

// ============================================
// ENUMS (mirroring Prisma enums for client use)
// ============================================

export type VerificationTier = 
  | 'BASIC'
  | 'VERIFIED_EMAIL'
  | 'VERIFIED_EMPLOYEE'
  | 'ANONYMIZED_VERIFIED'

export type PetitionStatus = 
  | 'DRAFT'
  | 'ACTIVE'
  | 'CLOSED'
  | 'VICTORY'
  | 'ARCHIVED'

export type Visibility = 
  | 'PUBLIC'
  | 'PRIVATE'
  | 'INTERNAL'

export type PetitionCategory =
  | 'PAY_EQUITY'
  | 'BENEFITS'
  | 'WORKPLACE_SAFETY'
  | 'REMOTE_WORK'
  | 'LAYOFFS'
  | 'HARASSMENT'
  | 'DISCRIMINATION'
  | 'UNION'
  | 'POLICY_CHANGE'
  | 'ENVIRONMENTAL'
  | 'OTHER'

export type SignatureSource =
  | 'DIRECT'
  | 'QR_CODE'
  | 'SHARE'
  | 'EMAIL'

// ============================================
// USER TYPES
// ============================================

export interface User {
  id: string
  email: string
  name: string | null
  image: string | null
  verificationTier: VerificationTier
  createdAt: Date
}

// ============================================
// PETITION TYPES
// ============================================

export interface Petition {
  id: string
  slug: string
  title: string
  description: string
  target: string
  targetEmail: string | null
  company: string | null
  category: PetitionCategory
  goal: number
  status: PetitionStatus
  visibility: Visibility
  successScore: number | null
  qrScans: number
  creatorId: string
  createdAt: Date
  updatedAt: Date
  closedAt: Date | null
  _count?: {
    signatures: number
  }
}

export interface PetitionWithDetails extends Petition {
  creator: User
  signatures: Signature[]
  updates: PetitionUpdate[]
  responses: TargetResponse[]
}

export interface PetitionUpdate {
  id: string
  petitionId: string
  title: string
  content: string
  createdAt: Date
}

export interface TargetResponse {
  id: string
  petitionId: string
  responder: string
  content: string
  verified: boolean
  createdAt: Date
}

// ============================================
// SIGNATURE TYPES
// ============================================

export interface Signature {
  id: string
  petitionId: string
  userId: string
  comment: string | null
  isAnonymous: boolean
  verifiedEmployee: boolean
  source: SignatureSource
  createdAt: Date
  user?: User
}

// ============================================
// API TYPES
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface CreatePetitionInput {
  title: string
  description: string
  target: string
  targetEmail?: string
  company?: string
  category: PetitionCategory
  goal: number
  visibility?: Visibility
}

export interface SignPetitionInput {
  petitionId: string
  comment?: string
  isAnonymous?: boolean
}

// ============================================
// AI TYPES
// ============================================

export interface AIDraftMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
}

export interface AIDraftSession {
  messages: AIDraftMessage[]
  suggestedTitle?: string
  suggestedDescription?: string
  suggestedTarget?: string
  suggestedCategory?: PetitionCategory
  successPrediction?: number
  tips?: string[]
}

export interface AIStrategyTip {
  type: 'timing' | 'target' | 'content' | 'threshold' | 'escalation'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
}

// ============================================
// CATEGORY LABELS
// ============================================

export const CATEGORY_LABELS: Record<PetitionCategory, string> = {
  PAY_EQUITY: 'Pay Equity',
  BENEFITS: 'Benefits',
  WORKPLACE_SAFETY: 'Workplace Safety',
  REMOTE_WORK: 'Remote Work',
  LAYOFFS: 'Layoffs',
  HARASSMENT: 'Harassment',
  DISCRIMINATION: 'Discrimination',
  UNION: 'Union/Organizing',
  POLICY_CHANGE: 'Policy Change',
  ENVIRONMENTAL: 'Environmental',
  OTHER: 'Other',
}

export const STATUS_LABELS: Record<PetitionStatus, string> = {
  DRAFT: 'Draft',
  ACTIVE: 'Active',
  CLOSED: 'Closed',
  VICTORY: 'Victory!',
  ARCHIVED: 'Archived',
}
