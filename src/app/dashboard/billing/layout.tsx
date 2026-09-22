import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Billing — GitPeek',
  description: 'Your GitPeek credit balance, and how to add more. Each credit creates one share link.',
};

export default function BillingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
