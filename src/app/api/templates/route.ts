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
      const mockTemplates = [
        {
          id: '1',
          name: 'Thank You for Positive Review',
          content: 'Thank you so much for your wonderful review, {customerName}! We\'re thrilled that you had such a positive experience with us. Your feedback means the world to our team and motivates us to continue providing excellent service.',
          description: 'Use for 4-5 star reviews to show appreciation',
          minStars: 4,
          maxStars: 5,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: { name: 'Test User', email: 'test@example.com' }
        },
        {
          id: '2',
          name: 'Addressing Concerns',
          content: 'Thank you for taking the time to share your feedback, {customerName}. We take all reviews seriously and appreciate you bringing this to our attention. We\'re committed to improving our service and would love the opportunity to make things right.',
          description: 'Use for 1-3 star reviews to show commitment to improvement',
          minStars: 1,
          maxStars: 3,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: { name: 'Test User', email: 'test@example.com' }
        }
      ]

      return NextResponse.json({
        templates: mockTemplates,
        pagination: {
          page,
          limit,
          total: 2,
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

    // Fetch templates with pagination
    const [templates, total] = await Promise.all([
      prisma.template.findMany({
        where: { orgId: membership.org.id },
        include: {
          createdBy: {
            select: { name: true, email: true }
          }
        },
        orderBy: { updatedAt: 'desc' },
        skip: offset,
        take: limit
      }),
      prisma.template.count({ where: { orgId: membership.org.id } })
    ])

    return NextResponse.json({
      templates,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
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
    const { name, content, description, minStars, maxStars, isActive } = body

    if (!name || !content) {
      return NextResponse.json(
        { error: 'Name and content are required' },
        { status: 400 }
      )
    }

    // For testing, return mock success
    if (BYPASS_AUTH) {
      const mockTemplate = {
        id: Date.now().toString(),
        name,
        content,
        description: description || null,
        minStars: minStars || null,
        maxStars: maxStars || null,
        isActive: isActive !== undefined ? isActive : true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: { name: 'Test User', email: 'test@example.com' }
      }

      return NextResponse.json({ template: mockTemplate }, { status: 201 })
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

    // Create template
    const template = await prisma.template.create({
      data: {
        name,
        content,
        description: description || null,
        minStars: minStars || null,
        maxStars: maxStars || null,
        isActive: isActive !== undefined ? isActive : true,
        orgId: membership.org.id,
        createdById: session.user.id
      },
      include: {
        createdBy: {
          select: { name: true, email: true }
        }
      }
    })

    return NextResponse.json({ template }, { status: 201 })
  } catch (error) {
    console.error('Error creating template:', error)
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    )
  }
}
