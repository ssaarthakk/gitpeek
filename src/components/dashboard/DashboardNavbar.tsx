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
import Image from 'next/image';

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
            <Image src="/GitPeek.png" alt="Git Peek" className="h-8 w-8" width={20} height={20}/>
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
