'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Sparkles, PenLine, Loader2 } from 'lucide-react'
import { Button, Input, Textarea, Select } from '@/components/ui'
import { DraftChat } from '@/components/ai'
import { SuccessPredictor } from '@/components/ai'
import { CATEGORY_LABELS } from '@/types'
import type { PetitionCategory } from '@/types'

type Mode = 'choose' | 'ai' | 'manual'

const categoryOptions = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
  value,
  label,
}))

export default function CreatePetitionPage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('choose')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [target, setTarget] = useState('')
  const [company, setCompany] = useState('')
  const [category, setCategory] = useState<PetitionCategory | ''>('')
  const [goal, setGoal] = useState('100')
  
  const handleAIDraftComplete = (draft: {
    title?: string
    description?: string
    target?: string
    category?: PetitionCategory
  }) => {
    // Apply any fields that were extracted (partial drafts are OK)
    if (draft.title) setTitle(draft.title)
    if (draft.description) setDescription(draft.description)
    if (draft.target) setTarget(draft.target)
    if (draft.category) setCategory(draft.category)
    setMode('manual') // Switch to manual mode to review/edit/complete
  }
  
  const handleSubmit = async () => {
    if (!title || !description || !target || !category || !goal) {
      setError('Please fill in all required fields')
      return
    }
    
    setIsSubmitting(true)
    setError(null)
    
    try {
      const response = await fetch('/api/petitions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          target,
          company: company || null,
          category,
          goal: parseInt(goal),
        }),
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create petition')
      }
      
      const { data: petition } = await response.json()
      router.push(`/p/${petition.slug}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container-app flex items-center h-16">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>
          <h1 className="flex-1 text-center font-display text-xl font-semibold text-gray-900">
            Create Your Petition
          </h1>
          <div className="w-20" /> {/* Spacer */}
        </div>
      </header>
      
      <main className="container-app py-8">
        {/* Mode Selection */}
        {mode === 'choose' && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="font-display text-3xl font-bold text-gray-900 mb-3">
                How would you like to start?
              </h2>
              <p className="text-gray-600">
                Choose your preferred way to create a compelling petition.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* AI Assistant Option */}
              <button
                onClick={() => setMode('ai')}
                className="card p-8 text-left hover:shadow-lg hover:border-blue-300 transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center mb-6">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-display text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                  AI-Assisted Draft
                </h3>
                <p className="text-gray-600 mb-4">
                  Chat with our AI assistant to craft the perfect petition. 
                  Get suggestions, tips, and a success prediction.
                </p>
                <span className="inline-flex items-center gap-2 text-blue-600 font-medium">
                  Recommended
                  <span className="px-2 py-0.5 text-xs bg-blue-100 rounded-full">
                    Most effective
                  </span>
                </span>
              </button>
              
              {/* Manual Option */}
              <button
                onClick={() => setMode('manual')}
                className="card p-8 text-left hover:shadow-lg hover:border-gray-300 transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-6">
                  <PenLine className="w-7 h-7 text-gray-600" />
                </div>
                <h3 className="font-display text-xl font-semibold text-gray-900 mb-2 group-hover:text-gray-700">
                  Write It Myself
                </h3>
                <p className="text-gray-600 mb-4">
                  Already know what you want to say? Go straight to the 
                  form and write your petition manually.
                </p>
                <span className="text-gray-500 font-medium">
                  For experienced organizers
                </span>
              </button>
            </div>
          </div>
        )}
        
        {/* AI Chat Mode */}
        {mode === 'ai' && (
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => setMode('choose')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to options</span>
            </button>
            
            <DraftChat onDraftComplete={handleAIDraftComplete} />
          </div>
        )}
        
        {/* Manual Form Mode */}
        {mode === 'manual' && (
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => setMode('choose')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to options</span>
            </button>
            
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Form */}
              <div className="lg:col-span-2 space-y-6">
                <div className="card p-6">
                  <h2 className="font-display text-xl font-semibold text-gray-900 mb-6">
                    Petition Details
                  </h2>
                  
                  <div className="space-y-5">
                    <Input
                      label="Petition Title *"
                      placeholder="e.g., Employees Demand Better Parental Leave"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      helperText="Make it clear and compelling"
                    />
                    
                    <Textarea
                      label="Description *"
                      placeholder="Explain the issue, why it matters, and what change you're asking for..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      helperText="Be specific about the problem and your proposed solution"
                      className="min-h-[200px]"
                    />
                    
                    <div className="grid md:grid-cols-2 gap-5">
                      <Input
                        label="Target (Who should act?) *"
                        placeholder="e.g., CEO John Smith, HR Director"
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                      />
                      
                      <Input
                        label="Company (optional)"
                        placeholder="e.g., Acme Corporation"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-5">
                      <Select
                        label="Category *"
                        options={categoryOptions}
                        placeholder="Select a category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value as PetitionCategory)}
                      />
                      
                      <Input
                        label="Signature Goal *"
                        type="number"
                        min="10"
                        max="100000"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        helperText="Start realistic, you can increase later"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Error message */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                    {error}
                  </div>
                )}
                
                {/* Submit button */}
                <Button
                  variant="success"
                  size="lg"
                  className="w-full"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating Petition...
                    </>
                  ) : (
                    <>✊ Launch Your Petition</>
                  )}
                </Button>
              </div>
              
              {/* Sidebar - Success Prediction */}
              <div className="lg:col-span-1">
                <SuccessPredictor
                  title={title}
                  description={description}
                  target={target}
                  category={category as PetitionCategory}
                  company={company}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
