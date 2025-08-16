import { Location } from '@prisma/client'
import { ReviewsProvider } from './google'

export class FacebookProvider implements ReviewsProvider {
  private accessToken: string

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  async listReviews(location: Location, since?: Date): Promise<import('./google').ReviewIn[]> {
    if (!location.facebookPageId) {
      throw new Error('Facebook page ID not configured')
    }

    try {
      // Facebook doesn't have a direct reviews endpoint, so we'll use ratings and comments
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${location.facebookPageId}/ratings?access_token=${this.accessToken}&fields=reviewer,rating,review_text,created_time,updated_time`
      )

      if (!response.ok) {
        throw new Error(`Facebook API error: ${response.status}`)
      }

      const data = await response.json()
      
      return data.data?.map((rating: any) => ({
        provider: 'FACEBOOK' as const,
        externalId: rating.id,
        rating: rating.rating,
        text: rating.review_text || '',
        authorName: rating.reviewer?.name,
        languageCode: 'en', // Facebook doesn't provide language info
        publishedAt: rating.created_time,
        updatedAt: rating.updated_time || rating.created_time,
      })) || []
    } catch (error) {
      console.error('Error fetching Facebook reviews:', error)
      throw error
    }
  }

  async postReply(location: Location, reviewExternalId: string, text: string): Promise<{ providerReplyId: string }> {
    if (!location.facebookPageId) {
      throw new Error('Facebook page ID not configured')
    }

    try {
      // Facebook doesn't support direct replies to ratings, so we'll create a comment
      const response = await fetch(
        `https://graph.facebook.com/v18.0/${reviewExternalId}/comments`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            message: text,
            access_token: this.accessToken,
          }),
        }
      )

      if (!response.ok) {
        throw new Error(`Facebook API error: ${response.status}`)
      }

      const data = await response.json()
      return { providerReplyId: data.id }
    } catch (error) {
      console.error('Error posting Facebook reply:', error)
      throw error
    }
  }

  getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: process.env.FACEBOOK_APP_ID!,
      redirect_uri: `${process.env.NEXTAUTH_URL}/api/integrations/facebook/callback`,
      scope: 'pages_read_engagement,pages_manage_posts',
      response_type: 'code',
    })

    return `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`
  }

  async exchangeCode(code: string): Promise<{ accessToken: string, refreshToken?: string, expiresAt?: Date, scopes: string[] }> {
    try {
      const response = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Facebook OAuth error: ${response.status}`)
      }

      const data = await response.json()
      
      return {
        accessToken: data.access_token,
        refreshToken: undefined, // Facebook doesn't provide refresh tokens
        expiresAt: data.expires_in ? new Date(Date.now() + data.expires_in * 1000) : undefined,
        scopes: data.scope?.split(',') || [],
      }
    } catch (error) {
      console.error('Error exchanging Facebook OAuth code:', error)
      throw error
    }
  }
}
