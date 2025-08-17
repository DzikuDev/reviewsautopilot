import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'

export default async function IntegrationsPage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md space-y-4 rounded-lg border bg-white p-6 shadow-sm text-center">
          <h1 className="text-2xl font-semibold text-gray-900">Integrations</h1>
          <p className="text-sm text-gray-600">Please sign in to manage integrations.</p>
          <Link href="/auth/signin" className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-white">
            Sign in
          </Link>
        </div>
      </div>
    )
  }

  const userId = (session.user as any).id as string
  const membership = await prisma.membership.findFirst({ where: { userId } })
  const orgId = membership?.orgId
  const integrations = orgId ? await prisma.integration.findMany({ where: { orgId } }) : []

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-3xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Integrations</h1>
        <div className="mb-8">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Google Business Profile</h2>
            <p className="text-sm text-gray-600 mb-4">Connect to fetch reviews and publish owner replies.</p>
            <Link href="/api/integrations/google/start" className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-white">
              Connect Google
            </Link>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-3">Connected Integrations</h2>
          {integrations.length === 0 ? (
            <p className="text-sm text-gray-600">No integrations yet.</p>
          ) : (
            <ul className="space-y-2">
              {integrations.map((i) => (
                <li key={i.id} className="rounded border bg-white p-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span>{i.provider}</span>
                    <span className="text-gray-500">Scopes: {i.scopes?.join(', ')}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  )
}