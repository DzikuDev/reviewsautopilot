import { Location } from '@prisma/client'

export type ReviewIn = {
  provider: 'GOOGLE' | 'FACEBOOK'
  externalId: string
  rating: number
  text: string
  authorName?: string
  languageCode?: string
  publishedAt: string
  updatedAt: string
}

export interface ReviewsProvider {
  listReviews: (location: Location, since?: Date) => Promise<ReviewIn[]>
  postReply: (location: Location, reviewExternalId: string, text: string) => Promise<{ providerReplyId: string }>
  getAuthUrl?: () => string
  exchangeCode?: (code: string) => Promise<{ accessToken: string, refreshToken?: string, expiresAt?: Date, scopes: string[] }>
}

export class GoogleBusinessProvider implements ReviewsProvider {
  private accessToken: string
  private refreshToken?: string
  private expiresAt?: Date

  constructor(accessToken: string, refreshToken?: string, expiresAt?: Date) {
    this.accessToken = accessToken
    this.refreshToken = refreshToken
    this.expiresAt = expiresAt
  }

  async listReviews(location: Location, since?: Date): Promise<ReviewIn[]> {
    if (!location.googleLocationId) {
      throw new Error('Google location ID not configured')
    }

    // Check if token needs refresh
    if (this.expiresAt && this.expiresAt <= new Date()) {
      await this.refreshAccessToken()
    }

    try {
      const response = await fetch(
        `https://mybusinessaccountmanagement.googleapis.com/v1/accounts/${location.googleLocationId}/locations/${location.googleLocationId}/reviews`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error(`Google API error: ${response.status}`)
      }

      const data = await response.json()
      
      return data.reviews?.map((review: any) => ({
        provider: 'GOOGLE' as const,
        externalId: review.name.split('/').pop(),
        rating: review.starRating,
        text: review.comment || '',
        authorName: review.reviewer?.profilePhotoUri ? review.reviewer.displayName : undefined,
        languageCode: review.languageCode,
        publishedAt: review.createTime,
        updatedAt: review.updateTime,
      })) || []
    } catch (error) {
      console.error('Error fetching Google reviews:', error)
      throw error
    }
  }

  async postReply(location: Location, reviewExternalId: string, text: string): Promise<{ providerReplyId: string }> {
    if (!location.googleLocationId) {
      throw new Error('Google location ID not configured')
    }

    // Check if token needs refresh
    if (this.expiresAt && this.expiresAt <= new Date()) {
      await this.refreshAccessToken()
    }

    try {
      const response = await fetch(
        `https://mybusinessaccountmanagement.googleapis.com/v1/accounts/${location.googleLocationId}/locations/${location.googleLocationId}/reviews/${reviewExternalId}/replies`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            comment: text,
          }),
        }
      )

      if (!response.ok) {
        throw new Error(`Google API error: ${response.status}`)
      }

      const data = await response.json()
      return { providerReplyId: data.name.split('/').pop() }
    } catch (error) {
      console.error('Error posting Google reply:', error)
      throw error
    }
  }

  getAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      redirect_uri: `${process.env.NEXTAUTH_URL}/api/integrations/google/callback`,
      scope: process.env.GOOGLE_OAUTH_SCOPES || 'https://www.googleapis.com/auth/business.manage',
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent',
    })

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  }

  async exchangeCode(code: string): Promise<{ accessToken: string, refreshToken?: string, expiresAt?: Date, scopes: string[] }> {
    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code,
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/integrations/google/callback`,
          grant_type: 'authorization_code',
        }),
      })

      if (!response.ok) {
        throw new Error(`Google OAuth error: ${response.status}`)
      }

      const data = await response.json()
      
      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: data.expires_in ? new Date(Date.now() + data.expires_in * 1000) : undefined,
        scopes: data.scope?.split(' ') || [],
      }
    } catch (error) {
      console.error('Error exchanging Google OAuth code:', error)
      throw error
    }
  }

  private async refreshAccessToken(): Promise<void> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          refresh_token: this.refreshToken,
          client_id: process.env.GOOGLE_CLIENT_ID!,
          client_secret: process.env.GOOGLE_CLIENT_SECRET!,
          grant_type: 'refresh_token',
        }),
      })

      if (!response.ok) {
        throw new Error(`Google OAuth refresh error: ${response.status}`)
      }

      const data = await response.json()
      this.accessToken = data.access_token
      this.expiresAt = data.expires_in ? new Date(Date.now() + data.expires_in * 1000) : undefined
    } catch (error) {
      console.error('Error refreshing Google access token:', error)
      throw error
    }
  }
}
