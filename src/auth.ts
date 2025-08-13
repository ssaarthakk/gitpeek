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
      }
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
});