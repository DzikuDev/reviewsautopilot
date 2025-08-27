'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, FileText, RefreshCw, Settings, BarChart3, Users, Zap, Target } from 'lucide-react'
import Link from 'next/link'

export function QuickActions() {
  const [activeAction, setActiveAction] = useState<string | null>(null)

  const actions = [
    {
      title: 'View All Reviews',
      description: 'See all your business reviews in one place',
      icon: MessageSquare,
      href: '/reviews',
      variant: 'default' as const,
      color: 'from-blue-600 to-indigo-600',
      count: '1,247',
      trend: '+12%',
      priority: 'high'
    },
    {
      title: 'View Drafts',
      description: 'Review and approve AI-generated responses',
      icon: FileText,
      href: '/drafts',
      variant: 'outline' as const,
      color: 'from-green-600 to-emerald-600',
      count: '23',
      trend: '+5',
      priority: 'medium'
    },
    {
      title: 'Sync Reviews',
      description: 'Pull latest reviews from integrations',
      icon: RefreshCw,
      href: '/reviews',
      variant: 'outline' as const,
      color: 'from-purple-600 to-pink-600',
      count: 'Last: 2h ago',
      trend: 'Auto',
      priority: 'low'
    },
    {
      title: 'Manage Templates',
      description: 'Create and edit response templates',
      icon: Settings,
      href: '/templates',
      variant: 'outline' as const,
      color: 'from-orange-600 to-red-600',
      count: '12',
      trend: '+2',
      priority: 'medium'
    },
    {
      title: 'Analytics',
      description: 'View detailed performance metrics',
      icon: BarChart3,
      href: '/analytics',
      variant: 'outline' as const,
      color: 'from-cyan-600 to-blue-600',
      count: 'Live',
      trend: 'Real-time',
      priority: 'low'
    },
    {
      title: 'Team Management',
      description: 'Manage team members and permissions',
      icon: Users,
      href: '/team',
      variant: 'outline' as const,
      color: 'from-violet-600 to-purple-600',
      count: '5',
      trend: '+1',
      priority: 'low'
    }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    }
  }

  const handleActionClick = (actionTitle: string) => {
    setActiveAction(actionTitle)
    // Reset after animation
    setTimeout(() => setActiveAction(null), 300)
  }

  return (
    <Card className="glass card-hover">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
            Quick Actions
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
              <Zap className="w-3 h-3 mr-1" />
              Quick Access
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {actions.map((action) => {
            const Icon = action.icon
            const isActive = activeAction === action.title
            
            return (
              <Link key={action.title} href={action.href} onClick={() => handleActionClick(action.title)}>
                <div className={`relative group cursor-pointer transition-all duration-200 ${
                  isActive ? 'scale-105' : 'hover:scale-105'
                }`}>
                  <Button
                    variant={action.variant}
                    className={`w-full min-h-[120px] p-6 flex flex-col items-center justify-center space-y-3 transition-all duration-200 ${
                      action.variant === 'default'
                        ? `bg-gradient-to-r ${action.color} hover:shadow-lg hover:scale-105 text-white`
                        : 'hover:shadow-md hover:scale-105 border-2 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className={`p-3 rounded-lg ${
                      action.variant === 'default' 
                        ? 'bg-white/20 backdrop-blur-sm' 
                        : 'bg-gray-100 dark:bg-gray-800'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-center max-w-full px-2">
                      <div className="font-semibold text-base leading-tight break-words">{action.title}</div>
                      <div className="text-sm opacity-80 mt-2 leading-relaxed break-words">{action.description}</div>
                    </div>
                  </Button>
                  
                  {/* Action Stats Overlay */}
                  <div className="absolute -top-2 -right-2 flex items-center space-x-1">
                    <Badge className={`text-xs ${getPriorityColor(action.priority)}`}>
                      {action.priority}
                    </Badge>
                  </div>
                  
                  {/* Count and Trend */}
                  <div className="absolute -bottom-2 -left-2 bg-white dark:bg-gray-800 rounded-lg px-3 py-2 shadow-md border border-gray-200 dark:border-gray-700">
                    <div className="text-xs font-medium text-gray-900 dark:text-white">
                      {action.count}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {action.trend}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Quick Stats Summary */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">89%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Response Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">2.4h</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">4.6</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">23</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Pending Drafts</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
