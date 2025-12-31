'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, Filter, Loader2 } from 'lucide-react'
import { PetitionCard } from '@/components/petition'
import { Button, Input, Select } from '@/components/ui'
import { Navbar } from '@/components/layout'
import { CATEGORY_LABELS } from '@/types'
import type { Petition, PetitionCategory } from '@/types'

const categoryOptions = [
  { value: '', label: 'All Categories' },
  ...Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
    value,
    label,
  })),
]

export default function ExplorePage() {
  const [petitions, setPetitions] = useState<Petition[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  
  useEffect(() => {
    const fetchPetitions = async () => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams()
        if (selectedCategory) params.set('category', selectedCategory)
        params.set('status', 'ACTIVE')
        
        const response = await fetch(`/api/petitions?${params}`)
        const { data } = await response.json()
        setPetitions(data || [])
      } catch (error) {
        console.error('Failed to fetch petitions:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchPetitions()
  }, [selectedCategory])
  
  const filteredPetitions = petitions.filter((petition) =>
    petition.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    petition.description.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navbar />
      
      {/* Spacer for fixed navbar */}
      <div className="h-16" />
      
      <main className="container-app py-8">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
            Explore Petitions
          </h1>
          <p className="text-gray-600">
            Find petitions that matter to you and add your voice.
          </p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search petitions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <Select
              options={categoryOptions}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as PetitionCategory | '')}
              className="min-w-[200px]"
            />
          </div>
        </div>
        
        {/* Results */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredPetitions.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="font-display text-xl font-semibold text-gray-900 mb-2">
              No petitions found
            </h2>
            <p className="text-gray-600 mb-6">
              {searchQuery || selectedCategory
                ? 'Try adjusting your search or filters.'
                : 'Be the first to start a petition!'}
            </p>
            <Link href="/create">
              <Button variant="primary">Start a Petition</Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPetitions.map((petition) => (
              <PetitionCard key={petition.id} petition={petition} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
