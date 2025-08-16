'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface StatCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon?: React.ReactNode
}

function StatCard({ title, value, change, changeType = 'neutral', icon }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardTitle>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className={`text-xs ${
            changeType === 'positive' ? 'text-green-600' : 
            changeType === 'negative' ? 'text-red-600' : 
            'text-gray-600'
          }`}>
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export function DashboardStats() {
  // Mock data - in real app, fetch from API
  const stats = [
    {
      title: 'Total Reviews',
      value: '1,234',
      change: '+12% from last month',
      changeType: 'positive' as const,
    },
    {
      title: 'Average Rating',
      value: '4.2',
      change: '+0.1 from last month',
      changeType: 'positive' as const,
    },
    {
      title: 'Response Rate',
      value: '87%',
      change: '+5% from last month',
      changeType: 'positive' as const,
    },
    {
      title: 'Pending Replies',
      value: '23',
      change: '3 need approval',
      changeType: 'neutral' as const,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  )
}
