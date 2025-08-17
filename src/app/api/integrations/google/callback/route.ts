import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { GoogleBusinessProvider } from '@/lib/providers/google'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 })
  }

  const session = await getServerSession(authOptions)
  if (!session) {
    const signin = new URL('/auth/signin', process.env.NEXTAUTH_URL)
    return NextResponse.redirect(signin)
  }

  const provider = new GoogleBusinessProvider('')
  const { accessToken, refreshToken, expiresAt, scopes } = await provider.exchangeCode(code)

  // ensure the user has an org
  const userId = (session.user as any).id as string
  let membership = await prisma.membership.findFirst({ where: { userId } })
  let orgId: string
  if (!membership) {
    const org = await prisma.org.create({ data: { name: `${session.user?.name || 'My'} Organization` } })
    await prisma.membership.create({ data: { userId, orgId: org.id, role: 'OWNER' } })
    orgId = org.id
  } else {
    orgId = membership.orgId
  }

  await prisma.integration.create({
    data: {
      orgId,
      provider: 'GOOGLE',
      accessToken,
      refreshToken,
      expiresAt: expiresAt || undefined,
      scopes,
    },
  })

  const redirect = new URL('/integrations?connected=google', process.env.NEXTAUTH_URL)
  return NextResponse.redirect(redirect)
}