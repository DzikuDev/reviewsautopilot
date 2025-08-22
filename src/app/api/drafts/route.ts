import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { DraftingPipeline } from '@/lib/drafting'

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
    const status = searchParams.get('status')

    // For testing, return mock data instead of database queries
    if (BYPASS_AUTH) {
      const mockDrafts = [
        {
          id: '1',
          content: 'Thank you so much for your wonderful review! We\'re thrilled that you had such a positive experience with us.',
          status: 'NEEDS_REVIEW',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          violations: null,
          review: {
            id: '1',
            rating: 5,
            text: 'Amazing service! The team was incredibly helpful and professional.',
            authorName: 'John Smith',
            publishedAt: new Date().toISOString(),
            location: { name: 'Downtown Office' }
          },
          toneProfile: { name: 'Friendly & Professional' },
          createdBy: { name: 'Test User', email: 'test@example.com' }
        },
        {
          id: '2',
          content: 'We appreciate your feedback and are committed to improving our service.',
          status: 'DRAFT',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          violations: null,
          review: {
            id: '2',
            rating: 3,
            text: 'Good service but could be improved in some areas.',
            authorName: 'Mike Wilson',
            publishedAt: new Date(Date.now() - 86400000).toISOString(),
            location: { name: 'Downtown Office' }
          },
          toneProfile: { name: 'Empathetic & Caring' },
          createdBy: { name: 'Test User', email: 'test@example.com' }
        }
      ]

      // Filter by status if specified
      const filteredDrafts = status && status !== 'all' 
        ? mockDrafts.filter(draft => draft.status === status)
        : mockDrafts

      return NextResponse.json({
        drafts: filteredDrafts,
        pagination: {
          page,
          limit,
          total: filteredDrafts.length,
          pages: 1
        }
      })
    }

    // Original authenticated logic
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's organization
    const membership = await prisma.membership.findFirst({
      where: { userId: session.user.id },
      include: { org: true }
    })

    if (!membership) {
      return NextResponse.json({ error: 'No organization found' }, { status: 404 })
    }

    // Build where clause
    const where: any = {
      review: { location: { orgId: membership.org.id } }
    }

    if (status && status !== 'all') {
      where.status = status
    }

    // Fetch drafts with pagination
    const [drafts, total] = await Promise.all([
      prisma.draftReply.findMany({
        where,
        include: {
          review: {
            include: { location: true }
          },
          toneProfile: true,
          createdBy: {
            select: { name: true, email: true }
          }
        },
        orderBy: { updatedAt: 'desc' },
        skip: offset,
        take: limit
      }),
      prisma.draftReply.count({ where })
    ])

    return NextResponse.json({
      drafts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching drafts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch drafts' },
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
    const { reviewId, templateId, toneProfileId, customPrompt } = body

    if (!reviewId) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      )
    }

    // For testing, return mock success
    if (BYPASS_AUTH) {
      const mockDraft = {
        id: Date.now().toString(),
        content: 'This is a mock draft response generated for testing purposes.',
        status: 'DRAFT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        violations: null,
        review: {
          id: reviewId,
          rating: 4,
          text: 'Sample review text for testing',
          authorName: 'Test User',
          publishedAt: new Date().toISOString(),
          location: { name: 'Test Location' }
        },
        toneProfile: toneProfileId !== 'none' ? { name: 'Test Tone' } : null,
        createdBy: { name: 'Test User', email: 'test@example.com' }
      }

      return NextResponse.json({ draft: mockDraft }, { status: 201 })
    }

    // Original authenticated logic would go here
    return NextResponse.json({ error: 'Not implemented in test mode' }, { status: 501 })
  } catch (error) {
    console.error('Error creating draft:', error)
    return NextResponse.json(
      { error: 'Failed to create draft' },
      { status: 500 }
    )
  }
}
