import { Navigation } from '@/components/layout/Navigation'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { RecentReviews } from '@/components/dashboard/RecentReviews'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md space-y-4 rounded-lg border bg-white p-6 shadow-sm text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Welcome to Reviews Autopilot</h1>
          <p className="text-sm text-gray-600">Please sign in to access your dashboard.</p>
          <Link href="/auth/signin" className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-white">
            Sign in
          </Link>
        </div>
      </div>
    )
  }

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
