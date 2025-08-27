'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, MessageSquare, Star, Users, Eye, Calendar, Target, Zap, BarChart3 } from 'lucide-react'

export function DashboardStats() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')
  const [isLoading, setIsLoading] = useState(false)

  // Enhanced mock data with time-based changes
  const stats = [
    {
      title: 'Total Reviews',
      value: '1,247',
      change: '+12%',
      changeType: 'positive' as const,
      icon: MessageSquare,
      description: 'from last month',
      trend: [1200, 1180, 1220, 1247],
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Average Rating',
      value: '4.6',
      change: '+0.2',
      changeType: 'positive' as const,
      icon: Star,
      description: 'out of 5 stars',
      trend: [4.4, 4.5, 4.5, 4.6],
      color: 'from-yellow-500 to-orange-500'
    },
    {
      title: 'Response Rate',
      value: '89%',
      change: '+5%',
      changeType: 'positive' as const,
      icon: Users,
      description: 'of reviews replied to',
      trend: [84, 86, 87, 89],
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Response Time',
      value: '2.4h',
      change: '-0.8h',
      changeType: 'positive' as const,
      icon: Zap,
      description: 'average response time',
      trend: [3.2, 2.9, 2.6, 2.4],
      color: 'from-purple-500 to-pink-500'
    }
  ]

  const quickMetrics = [
    { label: 'This Week', value: '47', icon: Calendar, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
    { label: 'Pending', value: '12', icon: Target, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
    { label: 'Trending', value: '+18%', icon: BarChart3, color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' }
  ]

  const handleTimeRangeChange = (range: '7d' | '30d' | '90d') => {
    setTimeRange(range)
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => setIsLoading(false), 500)
  }

  return (
    <div className="space-y-6">
      {/* Header with Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Stats</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Time Range:</span>
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "ghost"}
                size="sm"
                onClick={() => handleTimeRangeChange(range)}
                className={`h-8 px-3 text-xs ${
                  timeRange === range 
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="glass card-hover group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color} group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {isLoading ? (
                    <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  ) : (
                    stat.value
                  )}
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
                
                {/* Mini Trend Chart */}
                <div className="mt-3 flex items-end space-x-1 h-12">
                  {stat.trend.map((value, index) => {
                    const maxValue = Math.max(...stat.trend)
                    const height = (value / maxValue) * 100
                    return (
                      <div
                        key={index}
                        className={`flex-1 rounded-t-sm transition-all duration-300 ${
                          index === stat.trend.length - 1 
                            ? 'bg-gradient-to-t from-blue-500 to-blue-400' 
                            : 'bg-gray-200 dark:bg-gray-600'
                        }`}
                        style={{ height: `${height}%` }}
                      />
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickMetrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.label} className="glass card-hover">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{metric.label}</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${metric.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Performance Summary */}
      <Card className="glass card-hover">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Performance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Response Quality</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">5-Star Reviews</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">78%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">4-Star Reviews</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">15%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">3-Star & Below</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '7%' }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">7%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Recent Activity</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">New review from Google Business</span>
                  <Badge variant="secondary" className="text-xs">2m ago</Badge>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">AI response generated</span>
                  <Badge variant="secondary" className="text-xs">15m ago</Badge>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Response published</span>
                  <Badge variant="secondary" className="text-xs">1h ago</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
