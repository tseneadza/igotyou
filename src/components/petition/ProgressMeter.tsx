'use client'

import { useEffect, useState } from 'react'
import { clsx } from 'clsx'
import { Users, Target, TrendingUp } from 'lucide-react'

interface ProgressMeterProps {
  current: number
  goal: number
  showMilestones?: boolean
  size?: 'sm' | 'md' | 'lg'
  animate?: boolean
}

export function ProgressMeter({
  current,
  goal,
  showMilestones = true,
  size = 'md',
  animate = true,
}: ProgressMeterProps) {
  const [displayCount, setDisplayCount] = useState(animate ? 0 : current)
  const percentage = Math.min((current / goal) * 100, 100)
  
  // Animate count on mount
  useEffect(() => {
    if (!animate) return
    
    const duration = 1000
    const steps = 30
    const increment = current / steps
    let step = 0
    
    const timer = setInterval(() => {
      step++
      setDisplayCount(Math.min(Math.round(increment * step), current))
      
      if (step >= steps) {
        clearInterval(timer)
      }
    }, duration / steps)
    
    return () => clearInterval(timer)
  }, [current, animate])
  
  // Calculate milestones
  const milestones = [25, 50, 75, 100]
  const passedMilestones = milestones.filter((m) => percentage >= m)
  
  const sizes = {
    sm: {
      container: 'py-3',
      bar: 'h-2',
      text: 'text-sm',
      icon: 'w-4 h-4',
    },
    md: {
      container: 'py-4',
      bar: 'h-3',
      text: 'text-base',
      icon: 'w-5 h-5',
    },
    lg: {
      container: 'py-6',
      bar: 'h-4',
      text: 'text-lg',
      icon: 'w-6 h-6',
    },
  }
  
  const s = sizes[size]
  
  return (
    <div className={clsx('w-full', s.container)}>
      {/* Stats row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Users className={clsx(s.icon, 'text-blue-600')} />
          <span className={clsx(s.text, 'font-bold text-gray-900')}>
            {displayCount.toLocaleString()}
          </span>
          <span className={clsx(s.text, 'text-gray-500')}>
            signatures
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Target className={clsx(s.icon, 'text-gray-400')} />
          <span className={clsx(s.text, 'text-gray-600')}>
            Goal: {goal.toLocaleString()}
          </span>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className={clsx('w-full bg-gray-100 rounded-full overflow-hidden', s.bar)}>
        <div
          className={clsx(
            'h-full rounded-full transition-all duration-1000 ease-out',
            percentage >= 100
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-400'
              : 'bg-gradient-to-r from-blue-600 to-blue-400'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {/* Percentage and milestones */}
      <div className="flex items-center justify-between mt-2">
        <span className={clsx('font-medium', percentage >= 100 ? 'text-emerald-600' : 'text-blue-600')}>
          {Math.round(percentage)}% complete
        </span>
        
        {showMilestones && passedMilestones.length > 0 && (
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="text-sm text-emerald-600">
              {passedMilestones.length} milestone{passedMilestones.length > 1 ? 's' : ''} reached!
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
