'use client';
import { 
  Navbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarItem, 
  Button,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Chip,
  Tooltip
} from '@heroui/react';
import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type DashboardNavbarProps = {
  session: Session;
};

export default function DashboardNavbar({ session }: DashboardNavbarProps) {
  const router = useRouter();
  
  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  return (
    <Navbar 
      isBordered 
      className="bg-[#0b0f14]/95 backdrop-blur-md border-white/10"
      classNames={{
        wrapper: "max-w-none px-4 sm:px-6 lg:px-8",
      }}
    >
      <NavbarBrand>
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </div>
          <span className="text-xl font-bold text-white">Git Peek</span>
        </Link>
      </NavbarBrand>

      <NavbarContent justify="end" className="gap-4">
        <NavbarItem>
          <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
            <span className="text-sm text-white/70">Credits:</span>
            <Chip 
              color="primary" 
              variant="flat" 
              size="sm"
              classNames={{
                base: "bg-indigo-500/20 text-indigo-200",
                content: "font-semibold"
              }}
            >
              {session.user?.credits || 0}
            </Chip>
            <Tooltip content="Buy more credits">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                as={Link}
                href="/dashboard/billing"
                className="text-white/70 hover:text-white min-w-unit-6 w-6 h-6"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
              </Button>
            </Tooltip>
          </div>
        </NavbarItem>
        
        <NavbarItem>
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform hover:scale-105"
                color="primary"
                name={session.user?.name || 'User'}
                size="sm"
                src={session.user?.image || undefined}
              />
            </DropdownTrigger>
            <DropdownMenu 
              aria-label="Profile Actions" 
              variant="flat"
              className="bg-[#161b22] border border-white/10"
            >
              <DropdownItem key="profile" className="h-14 gap-2" textValue="Profile">
                <p className="font-semibold text-white">Signed in as</p>
                <p className="font-semibold text-white/70">{session.user?.email}</p>
              </DropdownItem>
              <DropdownItem 
                key="dashboard" 
                as={Link}
                href="/dashboard"
                className="text-white/70 hover:text-white"
              >
                Dashboard
              </DropdownItem>
              <DropdownItem 
                key="billing" 
                as={Link}
                href="/dashboard/billing"
                className="text-white/70 hover:text-white"
              >
                Billing
              </DropdownItem>
              <DropdownItem 
                key="logout" 
                color="danger" 
                onPress={handleSignOut}
                className="text-red-400"
              >
                Sign Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
