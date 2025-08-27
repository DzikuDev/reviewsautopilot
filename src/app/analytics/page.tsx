'use client'

import { Navigation } from '@/components/layout/Navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart3, TrendingUp, Users, MessageSquare, Star, Clock } from 'lucide-react'

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800/30">
      <Navigation />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Analytics Dashboard
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Deep insights into your review performance and customer satisfaction metrics
            </p>
          </div>

          {/* Coming Soon Message */}
          <Card className="glass card-hover">
            <CardContent className="text-center py-16">
              <BarChart3 className="w-20 h-20 text-blue-500 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Analytics Dashboard Coming Soon
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                We're building comprehensive analytics features including trend analysis, 
                performance metrics, and detailed insights to help you optimize your review management.
              </p>
              <div className="flex items-center justify-center space-x-4">
                <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Trend Analysis
                </Badge>
                <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                  <Users className="w-3 h-3 mr-1" />
                  Customer Insights
                </Badge>
                <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                  <MessageSquare className="w-3 h-3 mr-1" />
                  Response Metrics
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

