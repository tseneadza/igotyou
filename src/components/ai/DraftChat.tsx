'use client'

import { useState, useRef, useEffect, FormEvent } from 'react'
import { Send, Sparkles, User, Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui'
import { clsx } from 'clsx'
import type { AIDraftMessage, PetitionCategory } from '@/types'
import { CATEGORY_LABELS } from '@/types'

interface DraftChatProps {
  onDraftComplete: (draft: {
    title?: string
    description?: string
    target?: string
    category?: PetitionCategory
  }) => void
}

export function DraftChat({ onDraftComplete }: DraftChatProps) {
  const [messages, setMessages] = useState<AIDraftMessage[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your AI petition assistant. I'll help you create a compelling workplace petition.\n\nTell me: What change would you like to see at your workplace? What's the issue you're facing?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [draft, setDraft] = useState<{
    title?: string
    description?: string
    target?: string
    category?: PetitionCategory
  }>({})
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  
  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  
  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    
    const userMessage: AIDraftMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }
    
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/ai/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages.map(m => ({ role: m.role, content: m.content })),
        }),
      })
      
      if (!response.ok) throw new Error('Failed to get AI response')
      
      const data = await response.json()
      
      const assistantMessage: AIDraftMessage = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      }
      
      setMessages((prev) => [...prev, assistantMessage])
      
      // Update draft if AI provided suggestions
      if (data.suggestedDraft) {
        setDraft((prev) => ({ ...prev, ...data.suggestedDraft }))
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "I'm sorry, I encountered an error. Please try again.",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleUseDraft = () => {
    // Allow using partial drafts - user can fill in missing fields in the form
    onDraftComplete({
      title: draft.title,
      description: draft.description,
      target: draft.target,
      category: draft.category,
    })
  }
  
  const hasDraftContent = draft.title || draft.description || draft.target
  const isDraftComplete = draft.title && draft.description && draft.target && draft.category
  const missingFields = [
    !draft.title && 'title',
    !draft.description && 'description', 
    !draft.target && 'target',
    !draft.category && 'category'
  ].filter(Boolean)
  
  return (
    <div className="flex flex-col h-[600px] card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-emerald-50">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-gray-900">AI Drafting Assistant</h3>
          <p className="text-sm text-gray-500">Let&apos;s create your petition together</p>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={clsx(
              'flex gap-3',
              message.role === 'user' ? 'flex-row-reverse' : ''
            )}
          >
            <div
              className={clsx(
                'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                message.role === 'user' ? 'bg-blue-600' : 'bg-gray-100'
              )}
            >
              {message.role === 'user' ? (
                <User className="w-4 h-4 text-white" />
              ) : (
                <Sparkles className="w-4 h-4 text-blue-600" />
              )}
            </div>
            <div
              className={clsx(
                'max-w-[80%] rounded-2xl px-4 py-3',
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              )}
            >
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {message.content}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-blue-600" />
            </div>
            <div className="bg-gray-100 rounded-2xl px-4 py-3">
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Draft preview */}
      {hasDraftContent && (
        <div className="p-4 border-t border-gray-200 bg-emerald-50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className={clsx(
                "w-4 h-4",
                isDraftComplete ? "text-emerald-600" : "text-amber-500"
              )} />
              <span className={clsx(
                "text-sm font-medium",
                isDraftComplete ? "text-emerald-700" : "text-amber-700"
              )}>
                {isDraftComplete ? 'Draft Ready!' : 'Draft Preview'}
              </span>
            </div>
            {!isDraftComplete && missingFields.length > 0 && (
              <span className="text-xs text-amber-600">
                Missing: {missingFields.join(', ')}
              </span>
            )}
          </div>
          <div className="space-y-1 text-sm mb-3">
            {draft.title && (
              <p><span className="text-gray-500">Title:</span> {draft.title}</p>
            )}
            {draft.target && (
              <p><span className="text-gray-500">Target:</span> {draft.target}</p>
            )}
            {draft.category && (
              <p><span className="text-gray-500">Category:</span> {CATEGORY_LABELS[draft.category]}</p>
            )}
            {draft.description && (
              <p className="text-gray-500 text-xs mt-1">Description: {draft.description.substring(0, 80)}...</p>
            )}
          </div>
          <Button
            variant={isDraftComplete ? "success" : "primary"}
            size="sm"
            onClick={handleUseDraft}
          >
            {isDraftComplete ? '✓ Use This Draft' : 'Use Draft & Complete in Form'}
          </Button>
        </div>
      )}
      
      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <Button
            type="submit"
            variant="primary"
            disabled={!input.trim() || isLoading}
            className="px-4"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </div>
  )
}
