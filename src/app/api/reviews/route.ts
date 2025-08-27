import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// TEMPORARILY DISABLED FOR TESTING - Remove this when ready to re-enable auth
const BYPASS_AUTH = true

export async function GET(request: NextRequest) {
  try {
    if (!BYPASS_AUTH) {
      const session = await getServerSession(authOptions)
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    // For testing, return mock data instead of database queries
    if (BYPASS_AUTH) {
      const mockReviews = [
        {
          id: '1',
          provider: 'GOOGLE',
          rating: 5,
          text: 'Amazing service! The team was incredibly helpful and professional throughout the entire process.',
          title: 'Excellent Experience',
          authorName: 'Sarah Johnson',
          publishedAt: new Date(Date.now() - 86400000).toISOString(),
          hasOwnerReply: true,
          location: { name: 'Downtown Office' },
          drafts: [
            {
              id: 'draft-1',
              status: 'APPROVED',
              content: 'Thank you for your wonderful feedback, Sarah!'
            }
          ],
          replies: [
            {
              id: 'reply-1',
              content: 'Thank you for your wonderful feedback, Sarah!',
              publishedAt: new Date(Date.now() - 43200000).toISOString()
            }
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          provider: 'FACEBOOK',
          rating: 4,
          text: 'Great experience overall. Staff was friendly and helpful.',
          title: 'Good Service',
          authorName: 'John Smith',
          publishedAt: new Date(Date.now() - 172800000).toISOString(),
          hasOwnerReply: false,
          location: { name: 'Downtown Office' },
          drafts: [
            {
              id: 'draft-2',
              status: 'DRAFT',
              content: 'Thank you for your feedback, John!'
            }
          ],
          replies: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: '3',
          provider: 'GOOGLE',
          rating: 3,
          text: 'Good service but could be improved in some areas.',
          title: 'Decent Experience',
          authorName: 'Mike Wilson',
          publishedAt: new Date(Date.now() - 259200000).toISOString(),
          hasOwnerReply: false,
          location: { name: 'Downtown Office' },
          drafts: [],
          replies: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]

      return NextResponse.json({
        reviews: mockReviews,
        pagination: {
          page,
          limit,
          total: 3,
          pages: 1
        }
      })
    }

    // Original authenticated logic
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const membership = await prisma.membership.findFirst({
      where: { userId: session.user.id },
      include: { org: true }
    })

    if (!membership) {
      return NextResponse.json({ error: 'No organization found' }, { status: 404 })
    }

    // Fetch reviews with pagination
    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where: { location: { orgId: membership.org.id } },
        include: {
          location: true
        },
        orderBy: { publishedAt: 'desc' },
        skip: offset,
        take: limit
      }),
      prisma.review.count({
        where: { location: { orgId: membership.org.id } }
      })
    ])

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!BYPASS_AUTH) {
      const session = await getServerSession(authOptions)
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    const body = await request.json()
    const { action } = body

    if (action === 'sync') {
      // For testing, return success without actually syncing
      if (BYPASS_AUTH) {
        return NextResponse.json({ 
          message: 'Reviews synced successfully (test mode)',
          syncedCount: 5
        })
      }

      // Original sync logic would go here
      return NextResponse.json({ message: 'Sync not implemented yet' })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error syncing reviews:', error)
    return NextResponse.json(
      { error: 'Failed to sync reviews' },
      { status: 500 }
    )
  }
}
