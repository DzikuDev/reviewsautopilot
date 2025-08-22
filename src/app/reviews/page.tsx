'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/layout/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Star, MessageSquare, RefreshCw, Filter } from 'lucide-react'
import Link from 'next/link'

interface Review {
  id: string
  provider: 'GOOGLE' | 'FACEBOOK'
  rating: number
  text: string
  title?: string | null
  authorName?: string | null
  publishedAt: string
  hasOwnerReply: boolean
  location: {
    name: string
  }
  drafts: Array<{
    id: string
    status: string
    content: string
  }>
  replies: Array<{
    id: string
    content: string
    publishedAt: string
  }>
}

interface ReviewsResponse {
  reviews: Review[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [filters, setFilters] = useState({
    provider: 'all',
    status: 'all',
    locationId: '',
    page: 1
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  })

  useEffect(() => {
    fetchReviews()
  }, [filters])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: filters.page.toString(),
        limit: '20'
      })

      if (filters.provider && filters.provider !== 'all') params.append('provider', filters.provider)
      if (filters.status && filters.status !== 'all') params.append('status', filters.status)
      if (filters.locationId) params.append('locationId', filters.locationId)

      const response = await fetch(`/api/reviews?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch reviews')

      const data: ReviewsResponse = await response.json()
      setReviews(data.reviews)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const syncReviews = async () => {
    try {
      setSyncing(true)
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync' })
      })
      if (!response.ok) throw new Error('Failed to sync reviews')

      // Refresh the list
      await fetchReviews()
    } catch (error) {
      console.error('Error syncing reviews:', error)
      alert('Failed to sync reviews')
    } finally {
      setSyncing(false)
    }
  }

  const getProviderIcon = (provider: string) => {
    return provider === 'GOOGLE' ? 'G' : 'F'
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600 dark:text-green-400'
    if (rating >= 3) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getRatingBackground = (rating: number) => {
    if (rating >= 4) return 'bg-green-100 dark:bg-green-900/30'
    if (rating >= 3) return 'bg-yellow-100 dark:bg-yellow-900/30'
    return 'bg-red-100 dark:bg-red-900/30'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800/30 transition-colors duration-200">
      <Navigation />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                  Reviews
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Manage and respond to your business reviews
                </p>
              </div>
              <Button 
                onClick={syncReviews} 
                disabled={syncing}
                className="h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <RefreshCw className={`w-5 h-5 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                {syncing ? 'Syncing...' : 'Sync Reviews'}
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-8 glass card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Filter className="w-5 h-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select value={filters.provider} onValueChange={(value) => setFilters(prev => ({ ...prev, provider: value, page: 1 }))}>
                  <SelectTrigger className="input-focus">
                    <SelectValue placeholder="All Providers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Providers</SelectItem>
                    <SelectItem value="GOOGLE">Google</SelectItem>
                    <SelectItem value="FACEBOOK">Facebook</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value, page: 1 }))}>
                  <SelectTrigger className="input-focus">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="unreplied">Unreplied</SelectItem>
                    <SelectItem value="replied">Replied</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Search reviews..."
                  className="md:col-span-2 input-focus"
                />
              </div>
            </CardContent>
          </Card>

          {/* Reviews List */}
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600 dark:text-gray-300">Loading reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <Card className="glass card-hover">
              <CardContent className="text-center py-16">
                <MessageSquare className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">No reviews found</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                  {filters.provider !== 'all' || filters.status !== 'all'
                    ? 'Try adjusting your filters or sync reviews from your integrations.'
                    : 'Connect your Google Business Profile or Facebook Page to start receiving reviews.'
                  }
                </p>
                <Button 
                  onClick={syncReviews} 
                  disabled={syncing}
                  className="h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <RefreshCw className={`w-5 h-5 mr-2 ${syncing ? 'animate-spin' : ''}`} />
                  Sync Reviews
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <Card key={review.id} className="glass card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium">
                            {getProviderIcon(review.provider)}
                          </div>
                          <div>
                            <div className="flex items-center gap-3">
                              <span className="font-semibold text-gray-900 dark:text-white text-lg">
                                {review.authorName || 'Anonymous'}
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(review.publishedAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{review.location.name}</div>
                          </div>
                        </div>
                        
                        {review.title && (
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg">
                            {review.title}
                          </h3>
                        )}
                        
                        <p className="text-gray-700 dark:text-gray-300 mb-4 text-base leading-relaxed">
                          {review.text}
                        </p>
                        
                        <div className="flex items-center gap-4">
                          <div className={`flex items-center gap-2 px-3 py-2 rounded-full ${getRatingBackground(review.rating)}`}>
                            <Star className={`w-5 h-5 ${getRatingColor(review.rating)} fill-current`} />
                            <span className={`text-sm font-semibold ${getRatingColor(review.rating)}`}>
                              {review.rating} / 5
                            </span>
                          </div>
                          
                          <div className="flex gap-2">
                            {review.hasOwnerReply && (
                              <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                                Replied
                              </Badge>
                            )}
                            {review.drafts.length > 0 && (
                              <Badge variant="outline" className="border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300">
                                {review.drafts.length} Draft{review.drafts.length !== 1 ? 's' : ''}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-6">
                        <Button asChild className="h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200">
                          <Link href={`/reviews/${review.id}/reply`}>
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Reply
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
