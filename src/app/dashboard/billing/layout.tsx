import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GitPeek - Billing',
  description: 'Manage your GitPeek subscription and credits. Purchase additional credits to create more share links and control your repository sharing preferences.',
};

export default function BillingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
