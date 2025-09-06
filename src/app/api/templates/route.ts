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
      try {
        console.log('🔍 Starting template GET request...')
        
        // Create a test user and org if they don't exist
        let testUser = await prisma.user.findFirst({
          where: { email: 'test@example.com' }
        })
        
        if (!testUser) {
          console.log('👤 Creating test user...')
          testUser = await prisma.user.create({
            data: {
              email: 'test@example.com',
              name: 'Test User'
            }
          })
          console.log('✅ Test user created:', testUser.id)
        } else {
          console.log('👤 Test user found:', testUser.id)
        }

        // Get the first available organization or create one
        let testOrg = await prisma.org.findFirst()
        console.log('🏢 Looking for organization...')

        if (!testOrg) {
          console.log('🏢 Creating new organization...')
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
          console.log('✅ Organization created:', testOrg.id)
        } else {
          console.log('🏢 Found existing organization:', testOrg.id)
          // Add test user to existing organization if not already a member
          const existingMembership = await prisma.membership.findFirst({
            where: { userId: testUser.id, orgId: testOrg.id }
          })
          
          if (!existingMembership) {
            console.log('👥 Adding test user to organization...')
            await prisma.membership.create({
              data: {
                userId: testUser.id,
                orgId: testOrg.id,
                role: 'MEMBER'
              }
            })
            console.log('✅ User added to organization')
          } else {
            console.log('👥 User already member of organization')
          }
        }

        // Fetch templates with pagination
        console.log('📋 Fetching templates for org:', testOrg.id)
        const [templates, total] = await Promise.all([
          prisma.template.findMany({
            where: { orgId: testOrg.id },
            include: {
              createdBy: {
                select: { name: true, email: true }
              }
            },
            orderBy: { createdAt: 'desc' },
            skip: offset,
            take: limit
          }),
          prisma.template.count({ where: { orgId: testOrg.id } })
        ])

        console.log('✅ Templates fetched:', templates.length, 'Total:', total)
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
        console.error('❌ Error in template GET:', error)
        throw error
      }
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

    // Use real database operations for testing
    if (BYPASS_AUTH) {
      try {
        console.log('🔍 Starting template POST request...')
        console.log('📝 Template data:', { name, content, description, minStars, maxStars })
        
        // Create a test user and org if they don't exist
        let testUser = await prisma.user.findFirst({
          where: { email: 'test@example.com' }
        })
        
        if (!testUser) {
          console.log('👤 Creating test user...')
          testUser = await prisma.user.create({
            data: {
              email: 'test@example.com',
              name: 'Test User'
            }
          })
          console.log('✅ Test user created:', testUser.id)
        } else {
          console.log('👤 Test user found:', testUser.id)
        }

        // Get the first available organization or create one
        let testOrg = await prisma.org.findFirst()
        console.log('🏢 Looking for organization...')

        if (!testOrg) {
          console.log('🏢 Creating new organization...')
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
          console.log('✅ Organization created:', testOrg.id)
        } else {
          console.log('🏢 Found existing organization:', testOrg.id)
          // Add test user to existing organization if not already a member
          const existingMembership = await prisma.membership.findFirst({
            where: { userId: testUser.id, orgId: testOrg.id }
          })
          
          if (!existingMembership) {
            console.log('👥 Adding test user to organization...')
            await prisma.membership.create({
              data: {
                userId: testUser.id,
                orgId: testOrg.id,
                role: 'MEMBER'
              }
            })
            console.log('✅ User added to organization')
          } else {
            console.log('👥 User already member of organization')
          }
        }

        // Create template in database
        console.log('📝 Creating template in database...')
        const template = await prisma.template.create({
          data: {
            name,
            content,
            description: description || null,
            minStars: minStars || null,
            maxStars: maxStars || null,
            orgId: testOrg.id,
            createdById: testUser.id
          },
          include: {
            createdBy: {
              select: { name: true, email: true }
            }
          }
        })

        console.log('✅ Template created successfully:', template.id)
        return NextResponse.json({ template }, { status: 201 })
      } catch (error) {
        console.error('❌ Error in template POST:', error)
        throw error
      }
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
