import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GitPeek - Billing',
};

export default function BillingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
