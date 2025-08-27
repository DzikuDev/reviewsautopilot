'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, MessageSquare, ArrowRight, Clock, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export function RecentReviews() {
  const [expandedReview, setExpandedReview] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<'all' | 'replied' | 'pending'>('all')

  // Enhanced mock data
  const recentReviews = [
    {
      id: '1',
      authorName: 'Sarah Johnson',
      rating: 5,
      text: 'Amazing service! The team was incredibly helpful and professional throughout the entire process. They went above and beyond to ensure everything was perfect.',
      publishedAt: '2024-01-15T10:30:00Z',
      location: 'Downtown Office',
      hasReply: true,
      replyTime: '2h ago',
      sentiment: 'positive',
      source: 'Google Business',
      tags: ['customer service', 'professional']
    },
    {
      id: '2',
      authorName: 'Mike Wilson',
      rating: 4,
      text: 'Great experience overall. The staff was friendly and the service was efficient. Would definitely recommend to others.',
      publishedAt: '2024-01-14T14:20:00Z',
      location: 'Downtown Office',
      hasReply: false,
      replyTime: null,
      sentiment: 'positive',
      source: 'Google Business',
      tags: ['friendly', 'efficient']
    },
    {
      id: '3',
      authorName: 'Emily Davis',
      rating: 5,
      text: 'Exceptional quality and attention to detail. Highly recommend! The team was knowledgeable and made the whole process smooth.',
      publishedAt: '2024-01-13T09:15:00Z',
      location: 'Downtown Office',
      hasReply: true,
      replyTime: '1d ago',
      sentiment: 'positive',
      source: 'Google Business',
      tags: ['quality', 'knowledgeable']
    },
    {
      id: '4',
      authorName: 'David Brown',
      rating: 3,
      text: 'Good service but could be improved in some areas. Overall satisfied with the results.',
      publishedAt: '2024-01-12T16:45:00Z',
      location: 'Downtown Office',
      hasReply: false,
      replyTime: null,
      sentiment: 'neutral',
      source: 'Google Business',
      tags: ['satisfied', 'improvement']
    }
  ]

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

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp className="w-3 h-3 text-green-600 dark:text-green-400" />
      case 'neutral': return <Clock className="w-3 h-3 text-yellow-600 dark:text-yellow-400" />
      case 'negative': return <AlertCircle className="w-3 h-3 text-red-600 dark:text-red-400" />
      default: return <Clock className="w-3 h-3 text-gray-600 dark:text-gray-400" />
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      case 'neutral': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
      case 'negative': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    }
  }

  const filteredReviews = recentReviews.filter(review => {
    if (filterStatus === 'replied') return review.hasReply
    if (filterStatus === 'pending') return !review.hasReply
    return true
  })

  const toggleExpanded = (reviewId: string) => {
    setExpandedReview(expandedReview === reviewId ? null : reviewId)
  }

  return (
    <Card className="glass card-hover">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-3">
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Recent Reviews
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
              {recentReviews.length} total
            </Badge>
            <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
              {recentReviews.filter(r => r.hasReply).length} replied
            </Badge>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {(['all', 'replied', 'pending'] as const).map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? "default" : "ghost"}
                size="sm"
                onClick={() => setFilterStatus(status)}
                className={`h-8 px-3 text-xs ${
                  filterStatus === status 
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {status === 'all' ? 'All' : status === 'replied' ? 'Replied' : 'Pending'}
              </Button>
            ))}
          </div>
          <Button asChild variant="outline" size="sm" className="h-9">
            <Link href="/reviews">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="group relative p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 cursor-pointer"
              onClick={() => toggleExpanded(review.id)}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getRatingBackground(review.rating)}`}>
                    <Star className={`w-5 h-5 ${getRatingColor(review.rating)} fill-current`} />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {review.authorName}
                      </p>
                      <span className={`text-sm font-medium ${getRatingColor(review.rating)}`}>
                        {review.rating}/5
                      </span>
                      <Badge className={`text-xs ${getSentimentColor(review.sentiment)}`}>
                        {getSentimentIcon(review.sentiment)}
                        <span className="ml-1">{review.sentiment}</span>
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      {review.hasReply ? (
                        <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Replied {review.replyTime}
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending
                        </Badge>
                      )}
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(review.publishedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <p className={`text-sm text-gray-700 dark:text-gray-300 mb-2 transition-all duration-200 ${
                    expandedReview === review.id ? 'line-clamp-none' : 'line-clamp-2'
                  }`}>
                    {review.text}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap items-center space-x-2 mb-3">
                    {review.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs bg-gray-50 dark:bg-gray-800">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        📍 {review.location}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        🔗 {review.source}
                      </span>
                    </div>
                    
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button asChild variant="ghost" size="sm" className="h-8 px-3 text-xs">
                        <Link href={`/reviews/${review.id}`}>
                          <MessageSquare className="w-3 h-3 mr-1" />
                          View
                        </Link>
                      </Button>
                      
                      {!review.hasReply && (
                        <Button asChild size="sm" className="h-8 px-3 text-xs bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                          <Link href={`/reviews/${review.id}/reply`}>
                            <MessageSquare className="w-3 h-3 mr-1" />
                            Reply
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Expand/Collapse Indicator */}
              <div className="absolute top-4 right-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200">
                <ArrowRight className={`w-4 h-4 transition-transform duration-200 ${
                  expandedReview === review.id ? 'rotate-90' : ''
                }`} />
              </div>
            </div>
          ))}
        </div>
        
        {filteredReviews.length === 0 && (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">
              No {filterStatus === 'all' ? '' : filterStatus} reviews found
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}