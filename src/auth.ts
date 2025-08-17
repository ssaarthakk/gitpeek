import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from './lib/prisma';
import { authConfig } from './auth.config';

export const {
  handlers,
  signIn,
  signOut,
  auth,
} = NextAuth({
  ...authConfig,
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        token.accessToken = account.access_token;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;

        const userFromDb = await prisma.user.findUnique({
          where: { id: token.id as string },
        });
        if (userFromDb) {
          session.user.credits = userFromDb.credits;
        }

        const account = await prisma.account.findFirst({
          where: { userId: token.id as string, provider: 'github' },
        });
        if (account) {
          session.user.installationId = account.installation_id;
        }
      }
      session.accessToken = token.accessToken as string;
      return session;
    },
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
    }
  },
  adapter: PrismaAdapter(prisma),
});