'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, AlertCircle, CheckCircle2, Lightbulb, Loader2 } from 'lucide-react'
import { clsx } from 'clsx'
import type { AIStrategyTip, PetitionCategory } from '@/types'

interface SuccessPredictorProps {
  title: string
  description: string
  target: string
  category: PetitionCategory
  company?: string
}

export function SuccessPredictor({
  title,
  description,
  target,
  category,
  company,
}: SuccessPredictorProps) {
  const [prediction, setPrediction] = useState<{
    score: number
    reasoning: string
    tips: AIStrategyTip[]
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    // Only fetch if we have required fields
    if (!title || !description || !target) return
    
    const fetchPrediction = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const response = await fetch('/api/ai/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description, target, category, company }),
        })
        
        if (!response.ok) throw new Error('Failed to get prediction')
        
        const data = await response.json()
        setPrediction(data)
      } catch (err) {
        setError('Unable to generate prediction')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    
    // Debounce the request
    const timer = setTimeout(fetchPrediction, 1000)
    return () => clearTimeout(timer)
  }, [title, description, target, category, company])
  
  if (!title || !description || !target) {
    return null
  }
  
  if (isLoading) {
    return (
      <div className="card p-6">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
          <span className="text-gray-600">Analyzing your petition...</span>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="card p-6 bg-red-50 border-red-200">
        <div className="flex items-center gap-3 text-red-600">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      </div>
    )
  }
  
  if (!prediction) return null
  
  const scoreColor = 
    prediction.score >= 0.7 ? 'text-emerald-600' :
    prediction.score >= 0.4 ? 'text-amber-600' :
    'text-red-600'
  
  const scoreBg = 
    prediction.score >= 0.7 ? 'bg-emerald-100' :
    prediction.score >= 0.4 ? 'bg-amber-100' :
    'bg-red-100'
  
  return (
    <div className="card p-6 space-y-6">
      {/* Score */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="font-display font-semibold text-gray-900">Success Prediction</h3>
        </div>
        
        <div className="flex items-center gap-4">
          <div className={clsx('text-4xl font-bold', scoreColor)}>
            {Math.round(prediction.score * 100)}%
          </div>
          <div className="flex-1">
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={clsx('h-full rounded-full transition-all', scoreBg)}
                style={{ width: `${prediction.score * 100}%` }}
              />
            </div>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mt-2">{prediction.reasoning}</p>
      </div>
      
      {/* Tips */}
      {prediction.tips.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <h4 className="font-medium text-gray-900">Tips to Improve</h4>
          </div>
          
          <div className="space-y-3">
            {prediction.tips.map((tip, index) => (
              <div
                key={index}
                className={clsx(
                  'p-3 rounded-lg border-l-4',
                  tip.priority === 'high' ? 'bg-red-50 border-red-400' :
                  tip.priority === 'medium' ? 'bg-amber-50 border-amber-400' :
                  'bg-blue-50 border-blue-400'
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium uppercase text-gray-500">
                    {tip.type}
                  </span>
                  {tip.priority === 'high' && (
                    <span className="text-xs px-1.5 py-0.5 bg-red-100 text-red-700 rounded">
                      High Priority
                    </span>
                  )}
                </div>
                <p className="font-medium text-gray-900">{tip.title}</p>
                <p className="text-sm text-gray-600 mt-1">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {prediction.score >= 0.7 && (
        <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg text-emerald-700">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-medium">
            Your petition has strong potential for success!
          </span>
        </div>
      )}
    </div>
  )
}
