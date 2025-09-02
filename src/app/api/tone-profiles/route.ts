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

    // Use real database queries for testing
    if (BYPASS_AUTH) {
      // Create a test user and org if they don't exist
      let testUser = await prisma.user.findFirst({
        where: { email: 'test@example.com' }
      })
      
      if (!testUser) {
        testUser = await prisma.user.create({
          data: {
            email: 'test@example.com',
            name: 'Test User'
          }
        })
      }

      let testOrg = await prisma.org.findFirst({
        where: { name: 'Test Organization' }
      })

      if (!testOrg) {
        testOrg = await prisma.org.create({
          data: {
            name: 'Test Organization',
            memberships: {
              create: {
                userId: testUser.id,
                role: 'OWNER'
              }
            }
          }
        })
      }

      // Fetch tone profiles with pagination
      const [toneProfiles, total] = await Promise.all([
        prisma.toneProfile.findMany({
          where: { orgId: testOrg.id },
          orderBy: { createdAt: 'desc' },
          skip: offset,
          take: limit
        }),
        prisma.toneProfile.count({ where: { orgId: testOrg.id } })
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

    // Use real database operations for testing
    if (BYPASS_AUTH) {
      // Create a test user and org if they don't exist
      let testUser = await prisma.user.findFirst({
        where: { email: 'test@example.com' }
      })
      
      if (!testUser) {
        testUser = await prisma.user.create({
          data: {
            email: 'test@example.com',
            name: 'Test User'
          }
        })
      }

      let testOrg = await prisma.org.findFirst({
        where: { name: 'Test Organization' }
      })

      if (!testOrg) {
        testOrg = await prisma.org.create({
          data: {
            name: 'Test Organization',
            memberships: {
              create: {
                userId: testUser.id,
                role: 'OWNER'
              }
            }
          }
        })
      }

      // Create tone profile in database
      const toneProfile = await prisma.toneProfile.create({
        data: {
          name,
          description: description || null,
          settings,
          orgId: testOrg.id
        }
      })

      console.log('✅ Tone profile created successfully:', toneProfile.id)
      return NextResponse.json({ toneProfile }, { status: 201 })
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
