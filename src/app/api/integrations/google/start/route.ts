import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { GoogleBusinessProvider } from '@/lib/providers/google'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    const signin = new URL('/auth/signin', process.env.NEXTAUTH_URL)
    return NextResponse.redirect(signin)
  }
  const provider = new GoogleBusinessProvider('')
  const authUrl = provider.getAuthUrl()
  return NextResponse.redirect(authUrl)
}