'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/layout/Navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MessageSquare, FileText, Clock, CheckCircle, XCircle, Eye } from 'lucide-react'
import Link from 'next/link'

interface Draft {
  id: string
  content: string
  status: string
  createdAt: string
  updatedAt: string
  violations: any
  review: {
    id: string
    rating: number
    text: string
    authorName?: string | null
    publishedAt: string
    location: {
      name: string
    }
  }
  toneProfile?: {
    name: string
  } | null
  createdBy: {
    name: string
    email: string
  }
}

interface DraftsResponse {
  drafts: Draft[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: 'all',
    page: 1
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  })

  useEffect(() => {
    fetchDrafts()
  }, [filters])

  const fetchDrafts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: filters.page.toString(),
        limit: '20'
      })

      if (filters.status && filters.status !== 'all') params.append('status', filters.status)

      const response = await fetch(`/api/drafts?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch drafts')

      const data: DraftsResponse = await response.json()
      setDrafts(data.drafts)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching drafts:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'DRAFT': { variant: 'outline' as const, icon: FileText, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
      'NEEDS_REVIEW': { variant: 'secondary' as const, icon: Clock, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
      'APPROVED': { variant: 'default' as const, icon: CheckCircle, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' },
      'REJECTED': { variant: 'destructive' as const, icon: XCircle, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['DRAFT']
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className={`${config.bg} ${config.color} border-0`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.replace('_', ' ')}
      </Badge>
    )
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600 dark:text-green-400'
    if (rating >= 3) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800/30 transition-colors duration-200">
      <Navigation />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                Response Drafts
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Review and manage AI-generated response drafts before publishing
              </p>
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-8 glass card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <FileText className="w-5 h-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value, page: 1 }))}>
                  <SelectTrigger className="input-focus">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="NEEDS_REVIEW">Needs Review</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>

                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Filter drafts by their current status to focus on what needs attention
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Drafts List */}
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600 dark:text-gray-300">Loading drafts...</p>
            </div>
          ) : drafts.length === 0 ? (
            <Card className="glass card-hover">
              <CardContent className="text-center py-16">
                <FileText className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">No drafts found</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                  {filters.status !== 'all'
                    ? 'Try adjusting your filters or generate some drafts from reviews.'
                    : 'Generate response drafts from your reviews to get started.'
                  }
                </p>
                <Button asChild className="h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                  <Link href="/reviews">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Go to Reviews
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {drafts.map((draft) => (
                <Card key={draft.id} className="glass card-hover">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Review Info */}
                      <div className="lg:col-span-1">
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                              Review by {draft.review.authorName || 'Anonymous'}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {draft.review.location.name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-500">
                              {new Date(draft.review.publishedAt).toLocaleDateString()}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${getRatingColor(draft.review.rating)}`}>
                              {draft.review.rating} / 5
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {draft.review.text.length > 100 ? `${draft.review.text.substring(0, 100)}...` : draft.review.text}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Draft Content */}
                      <div className="lg:col-span-2">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {getStatusBadge(draft.status)}
                              {draft.toneProfile && (
                                <Badge variant="outline" className="border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300">
                                  {draft.toneProfile.name}
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Created {new Date(draft.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                              {draft.content.length > 300 ? `${draft.content.substring(0, 300)}...` : draft.content}
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              By {draft.createdBy.name}
                            </div>
                            
                            <div className="flex gap-2">
                              <Button asChild variant="outline" size="sm" className="h-9">
                                <Link href={`/reviews/${draft.review.id}/reply`}>
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Link>
                              </Button>
                              
                              {draft.status === 'NEEDS_REVIEW' && (
                                <Button asChild size="sm" className="h-9 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                                  <Link href={`/reviews/${draft.review.id}/reply`}>
                                    <MessageSquare className="w-4 h-4 mr-1" />
                                    Review
                                  </Link>
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
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
