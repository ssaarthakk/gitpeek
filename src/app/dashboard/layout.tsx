import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'GitPeek - Dashboard',
  description: 'Manage your GitHub repositories and share links from your GitPeek dashboard. Create secure, time-limited links to share your code with collaborators and clients.',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
