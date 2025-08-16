import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
 
export default NextAuth(authConfig).auth;
 
export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  // Exclude API routes, Next.js internals, and common static asset file types
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|map|txt|xml|woff|woff2|ttf|otf)$).*)'
  ],
};