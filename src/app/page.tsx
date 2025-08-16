import { Navigation } from '@/components/layout/Navigation'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { RecentReviews } from '@/components/dashboard/RecentReviews'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Monitor your business reviews and manage your online reputation
            </p>
          </div>
          
          <DashboardStats />
          <QuickActions />
          <RecentReviews />
        </div>
      </main>
    </div>
  )
}
