'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, MessageSquare, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function RecentReviews() {
  // Mock data - replace with real data from API
  const recentReviews = [
    {
      id: '1',
      authorName: 'Sarah Johnson',
      rating: 5,
      text: 'Amazing service! The team was incredibly helpful and professional throughout the entire process.',
      publishedAt: '2024-01-15T10:30:00Z',
      location: 'Downtown Office',
      hasReply: true
    },
    {
      id: '2',
      authorName: 'Mike Wilson',
      rating: 4,
      text: 'Great experience overall. The staff was friendly and the service was efficient.',
      publishedAt: '2024-01-14T14:20:00Z',
      location: 'Downtown Office',
      hasReply: false
    },
    {
      id: '3',
      authorName: 'Emily Davis',
      rating: 5,
      text: 'Exceptional quality and attention to detail. Highly recommend!',
      publishedAt: '2024-01-13T09:15:00Z',
      location: 'Downtown Office',
      hasReply: true
    },
    {
      id: '4',
      authorName: 'David Brown',
      rating: 3,
      text: 'Good service but could be improved in some areas. Overall satisfied.',
      publishedAt: '2024-01-12T16:45:00Z',
      location: 'Downtown Office',
      hasReply: false
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

  return (
    <Card className="glass card-hover">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
          Recent Reviews
        </CardTitle>
        <Button asChild variant="outline" size="sm" className="h-9">
          <Link href="/reviews">
            View All
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentReviews.map((review) => (
            <div
              key={review.id}
              className="flex items-start space-x-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
            >
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
                  </div>
                  <div className="flex items-center space-x-2">
                    {review.hasReply && (
                      <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs">
                        Replied
                      </Badge>
                    )}
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(review.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 line-clamp-2">
                  {review.text}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {review.location}
                  </span>
                  
                  <div className="flex space-x-2">
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
          ))}
        </div>
      </CardContent>
    </Card>
  )
}