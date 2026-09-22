import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard — GitPeek',
  description: 'Create, copy and revoke read-only links to your private GitHub repositories, and answer access requests from readers.',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
