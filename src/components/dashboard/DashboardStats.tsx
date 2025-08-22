'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, MessageSquare, Star, Users, Eye } from 'lucide-react'

export function DashboardStats() {
  // Mock data - replace with real data from API
  const stats = [
    {
      title: 'Total Reviews',
      value: '1,247',
      change: '+12%',
      changeType: 'positive' as const,
      icon: MessageSquare,
      description: 'from last month'
    },
    {
      title: 'Average Rating',
      value: '4.6',
      change: '+0.2',
      changeType: 'positive' as const,
      icon: Star,
      description: 'out of 5 stars'
    },
    {
      title: 'Response Rate',
      value: '89%',
      change: '+5%',
      changeType: 'positive' as const,
      icon: Users,
      description: 'of reviews replied to'
    },
    {
      title: 'Page Views',
      value: '45.2K',
      change: '-2%',
      changeType: 'negative' as const,
      icon: Eye,
      description: 'from last month'
    }
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Stats</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="glass card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  {stat.changeType === 'positive' ? (
                    <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600 dark:text-red-400" />
                  )}
                  <span className={`text-xs font-medium ${
                    stat.changeType === 'positive' 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {stat.description}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
