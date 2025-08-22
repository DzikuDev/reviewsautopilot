import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { GoogleBusinessProvider } from '@/lib/providers/google'

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
    const { action, content, status } = body

    // Get user's organization
    const membership = await prisma.membership.findFirst({
      where: { userId: session.user.id },
      include: { org: true }
    })

    if (!membership) {
      return NextResponse.json({ error: 'No organization found' }, { status: 404 })
    }

    // Fetch draft and verify ownership
    const draft = await prisma.draftReply.findFirst({
      where: { 
        id: params.id,
        review: { location: { orgId: membership.org.id } }
      },
      include: {
        review: { 
          include: { 
            location: { include: { integrations: true } }
          } 
        }
      }
    })

    if (!draft) {
      return NextResponse.json({ error: 'Draft not found' }, { status: 404 })
    }

    if (action === 'update') {
      // Update draft content
      const updatedDraft = await prisma.draftReply.update({
        where: { id: params.id },
        data: { 
          content,
          updatedAt: new Date()
        },
        include: {
          review: { include: { location: true } },
          toneProfile: true,
          createdBy: true
        }
      })

      return NextResponse.json({ draft: updatedDraft })
    }

    if (action === 'approve') {
      // Approve draft and publish reply
      const updatedDraft = await prisma.draftReply.update({
        where: { id: params.id },
        data: { 
          status: 'APPROVED',
          updatedAt: new Date()
        }
      })

      // Publish reply to the review platform
      try {
        const reply = await publishReply(draft, membership.org.id)
        
        // Update review to mark as replied
        await prisma.review.update({
          where: { id: draft.reviewId },
          data: { 
            hasOwnerReply: true,
            ownerReplyAt: new Date(),
            ownerReplyText: draft.content
          }
        })

        return NextResponse.json({ 
          success: true, 
          message: 'Reply published successfully',
          reply 
        })
      } catch (error) {
        // Revert draft status if publishing fails
        await prisma.draftReply.update({
          where: { id: params.id },
          data: { status: 'DRAFT' }
        })
        throw error
      }
    }

    if (action === 'reject') {
      // Reject draft
      const updatedDraft = await prisma.draftReply.update({
        where: { id: params.id },
        data: { 
          status: 'REJECTED',
          updatedAt: new Date()
        },
        include: {
          review: { include: { location: true } },
          toneProfile: true,
          createdBy: true
        }
      })

      return NextResponse.json({ draft: updatedDraft })
    }

    if (action === 'status') {
      // Update draft status
      const updatedDraft = await prisma.draftReply.update({
        where: { id: params.id },
        data: { 
          status,
          updatedAt: new Date()
        },
        include: {
          review: { include: { location: true } },
          toneProfile: true,
          createdBy: true
        }
      })

      return NextResponse.json({ draft: updatedDraft })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error updating draft:', error)
    return NextResponse.json(
      { error: 'Failed to update draft' },
      { status: 500 }
    )
  }
}

async function publishReply(draft: any, orgId: string) {
  // Find the appropriate integration for the review's location
  const integration = await prisma.integration.findFirst({
    where: {
      orgId,
      locationId: draft.review.locationId,
      provider: draft.review.provider
    }
  })

  if (!integration) {
    throw new Error('No integration found for this location')
  }

  if (draft.review.provider === 'GOOGLE') {
    const provider = new GoogleBusinessProvider(
      integration.accessToken,
      integration.refreshToken,
      integration.expiresAt
    )

    const replyResult = await provider.postReply(
      { googleLocationId: draft.review.location.googleLocationId },
      draft.review.externalId,
      draft.content
    )

    // Create reply record in database
    const reply = await prisma.reply.create({
      data: {
        reviewId: draft.reviewId,
        content: draft.content,
        publishedAt: new Date(),
        providerReplyId: replyResult.providerReplyId,
        publishedById: draft.createdById
      }
    })

    return reply
  }

  throw new Error(`Unsupported provider: ${draft.review.provider}`)
}
