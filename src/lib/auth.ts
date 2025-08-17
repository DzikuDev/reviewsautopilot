import { NextAuthOptions, type DefaultSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

type SessionUser = DefaultSession['user'] & { id?: string }

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user && token?.sub) {
        ;(session.user as SessionUser).id = token.sub
      }
      return session
    },
    jwt: async ({ token }) => {
      if (token.sub) {
        // augment token with id for convenience
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (token as unknown as { id?: string }).id = token.sub
      }
      return token
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
}
