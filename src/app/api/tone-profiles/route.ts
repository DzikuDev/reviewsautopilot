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
      const mockToneProfiles = [
        {
          id: '1',
          name: 'Friendly & Professional',
          description: 'Warm and approachable while maintaining business professionalism',
          settings: {
            formality: 'friendly',
            emotion: 'positive',
            length: 'medium',
            personality: 'warm, helpful, solution-oriented'
          },
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: { name: 'Test User', email: 'test@example.com' }
        },
        {
          id: '2',
          name: 'Empathetic & Caring',
          description: 'Show understanding and care for customer concerns',
          settings: {
            formality: 'casual',
            emotion: 'empathetic',
            length: 'medium',
            personality: 'understanding, caring, supportive'
          },
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: { name: 'Test User', email: 'test@example.com' }
        }
      ]

      return NextResponse.json({
        toneProfiles: mockToneProfiles,
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

    // Fetch tone profiles with pagination
    const [toneProfiles, total] = await Promise.all([
      prisma.toneProfile.findMany({
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
      prisma.toneProfile.count({ where: { orgId: membership.org.id } })
    ])

    return NextResponse.json({
      toneProfiles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching tone profiles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tone profiles' },
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
    const { name, description, settings, isActive } = body

    if (!name || !settings) {
      return NextResponse.json(
        { error: 'Name and settings are required' },
        { status: 400 }
      )
    }

    // For testing, return mock success
    if (BYPASS_AUTH) {
      const mockToneProfile = {
        id: Date.now().toString(),
        name,
        description: description || null,
        settings,
        isActive: isActive !== undefined ? isActive : true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: { name: 'Test User', email: 'test@example.com' }
      }

      return NextResponse.json({ toneProfile: mockToneProfile }, { status: 201 })
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

    // Create tone profile
    const toneProfile = await prisma.toneProfile.create({
      data: {
        name,
        description: description || null,
        settings,
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

    return NextResponse.json({ toneProfile }, { status: 201 })
  } catch (error) {
    console.error('Error creating tone profile:', error)
    return NextResponse.json(
      { error: 'Failed to create tone profile' },
      { status: 500 }
    )
  }
}
