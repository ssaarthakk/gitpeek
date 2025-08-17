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
          scope: "repo read:user user:email",
        },
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.includes('callbackUrl')) {
        const callbackUrl = new URL(url).searchParams.get('callbackUrl');
        if (callbackUrl?.includes('/pricing')) {
          return `${baseUrl}/dashboard/billing`;
        }
        if (callbackUrl?.includes('/dashboard/billing')) {
          return `${baseUrl}/dashboard/billing`;
        }
        if (callbackUrl?.includes('/dashboard')) {
          return `${baseUrl}/dashboard`;
        }
      }

      if (url.startsWith(baseUrl)) {
        return url;
      }
      return `${baseUrl}/dashboard`;
    },
  },
  secret: process.env.AUTH_SECRET,
} satisfies NextAuthConfig;