import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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

    // Fetch tone profile and verify ownership
    const toneProfile = await prisma.toneProfile.findFirst({
      where: { 
        id: params.id,
        orgId: membership.org.id
      },
      include: {
        createdBy: {
          select: { name: true, email: true }
        }
      }
    })

    if (!toneProfile) {
      return NextResponse.json({ error: 'Tone profile not found' }, { status: 404 })
    }

    return NextResponse.json({ toneProfile })
  } catch (error) {
    console.error('Error fetching tone profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tone profile' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, settings, isActive } = body

    if (!name || !settings) {
      return NextResponse.json(
        { error: 'Name and settings are required' },
        { status: 400 }
      )
    }

    // Get user's organization
    const membership = await prisma.membership.findFirst({
      where: { userId: session.user.id },
      include: { org: true }
    })

    if (!membership) {
      return NextResponse.json({ error: 'No organization found' }, { status: 404 })
    }

    // Update tone profile and verify ownership
    const toneProfile = await prisma.toneProfile.update({
      where: { 
        id: params.id,
        orgId: membership.org.id
      },
      data: {
        name,
        description: description || null,
        settings,
        isActive: isActive !== undefined ? isActive : true,
        updatedAt: new Date()
      },
      include: {
        createdBy: {
          select: { name: true, email: true }
        }
      }
    })

    return NextResponse.json({ toneProfile })
  } catch (error) {
    console.error('Error updating tone profile:', error)
    return NextResponse.json(
      { error: 'Failed to update tone profile' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
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

    // Delete tone profile and verify ownership
    await prisma.toneProfile.delete({
      where: { 
        id: params.id,
        orgId: membership.org.id
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting tone profile:', error)
    return NextResponse.json(
      { error: 'Failed to delete tone profile' },
      { status: 500 }
    )
  }
}
