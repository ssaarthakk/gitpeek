import { useSession } from "next-auth/react";
import LogoutButton from "../LogoutButton";
import RepoList from "../RepoList";
import ShareButton from "./ShareButton";

type NavbarProps = {
    onRepoSelect: (repo: string | null) => void;
    handleShare: (repo: string) => Promise<{ link?: string, error?: string }>;
    selectedRepo: string | null;
};

export default function Navbar({ onRepoSelect, handleShare, selectedRepo }: NavbarProps) {
    const { data: session } = useSession();

    return (
        <nav className="h-14 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-white/10 bg-[#0d1117]/95 backdrop-blur sticky top-0 z-20">
            <div className="flex items-center gap-4 min-w-0">
                {session?.user?.image && (
                    <img
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        className="h-10 w-10 rounded-full ring-2 ring-white/10 object-cover"
                    />
                )}
                <div className="flex flex-col leading-tight min-w-0">
                    <span className="text-[13px] font-semibold text-white/90 truncate max-w-[200px]" title={session?.user?.name || ''}>{session?.user?.name}</span>
                    {session?.user?.email && (
                        <span className="text-[11px] text-white/50 truncate max-w-[200px]" title={session.user.email}>{session.user.email}</span>
                    )}
                </div>
                <div className="hidden sm:block">
                    <LogoutButton />
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="hidden sm:block text-[11px] text-white/40 uppercase tracking-wide">Repository</div>
                <RepoList onRepoSelect={onRepoSelect} />
                <ShareButton repoFullName={selectedRepo} onShare={handleShare} />
                <div className="sm:hidden">
                    <LogoutButton />
                </div>
            </div>
        </nav>
    )
}
