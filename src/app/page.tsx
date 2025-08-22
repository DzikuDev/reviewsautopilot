import { Navigation } from '@/components/layout/Navigation'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { RecentReviews } from '@/components/dashboard/RecentReviews'
import { BackgroundPattern } from '@/components/ui/background-pattern'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800/30">
      <BackgroundPattern />
      <Navigation />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
              Dashboard
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Monitor your business reviews and manage your online reputation
            </p>
          </div>
          
          {/* Dashboard Components */}
          <div className="space-y-8">
            <DashboardStats />
            <QuickActions />
            <RecentReviews />
          </div>
        </div>
      </main>
    </div>
  )
}
