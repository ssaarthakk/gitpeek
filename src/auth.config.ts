import type { NextAuthConfig } from 'next-auth';
import GitHub from 'next-auth/providers/github';

export const authConfig = {
  session: { strategy: 'jwt' },
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      authorization: {
        params: {
          scope: 'repo read:user user:email',
        },
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;
      if (
        pathname === '/' ||
        pathname.startsWith('/pricing') ||
        pathname.startsWith('/view') ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/public')
      ) {
        return true;
      }
      return !!auth;
    },
  },
} satisfies NextAuthConfig;