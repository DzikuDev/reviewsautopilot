'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageSquare, FileText, RefreshCw, Settings } from 'lucide-react'
import Link from 'next/link'

export function QuickActions() {
  const actions = [
    {
      title: 'View All Reviews',
      description: 'See all your business reviews in one place',
      icon: MessageSquare,
      href: '/reviews',
      variant: 'default' as const,
      color: 'from-blue-600 to-indigo-600'
    },
    {
      title: 'View Drafts',
      description: 'Review and approve AI-generated responses',
      icon: FileText,
      href: '/drafts',
      variant: 'outline' as const,
      color: 'from-green-600 to-emerald-600'
    },
    {
      title: 'Sync Reviews',
      description: 'Pull latest reviews from integrations',
      icon: RefreshCw,
      href: '/reviews',
      variant: 'outline' as const,
      color: 'from-purple-600 to-pink-600'
    },
    {
      title: 'Manage Templates',
      description: 'Create and edit response templates',
      icon: Settings,
      href: '/templates',
      variant: 'outline' as const,
      color: 'from-orange-600 to-red-600'
    }
  ]

  return (
    <Card className="glass card-hover">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.title} href={action.href}>
                <Button
                  variant={action.variant}
                  className={`w-full h-20 p-4 flex flex-col items-center justify-center space-y-2 transition-all duration-200 ${
                    action.variant === 'default'
                      ? `bg-gradient-to-r ${action.color} hover:shadow-lg hover:scale-105 text-white`
                      : 'hover:shadow-md hover:scale-105 border-2 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <div className="text-center">
                    <div className="font-semibold text-sm">{action.title}</div>
                    <div className="text-xs opacity-80 mt-1">{action.description}</div>
                  </div>
                </Button>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
