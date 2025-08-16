'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const actions = [
  {
    title: 'Connect Google Business',
    description: 'Link your Google Business Profile to automatically fetch reviews',
    href: '/integrations/google',
    variant: 'default' as const,
  },
  {
    title: 'Create Response Template',
    description: 'Set up templates for common review scenarios',
    href: '/templates/new',
    variant: 'outline' as const,
  },
  {
    title: 'Review Pending Replies',
    description: 'Check and approve responses that need manual review',
    href: '/inbox?filter=pending',
    variant: 'outline' as const,
  },
  {
    title: 'View Weekly Report',
    description: 'See your reputation metrics and trends',
    href: '/reports/weekly',
    variant: 'outline' as const,
  },
]

export function QuickActions() {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action) => (
          <Card key={action.title} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-sm font-medium">{action.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{action.description}</p>
              <Button asChild variant={action.variant} className="w-full">
                <Link href={action.href}>
                  {action.variant === 'default' ? 'Get Started' : 'View'}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
