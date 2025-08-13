import RepoContentView from "../RepoContentView";

type MainContentProps = {
    selectedRepo: string | null;
};

export default function MainContent({ selectedRepo }: MainContentProps) {
    return (
        <main className="flex-1 overflow-hidden">
            {selectedRepo ? (
                <RepoContentView repoFullName={selectedRepo} />
            ) : (
                <div className="h-full flex items-center justify-center text-sm text-white/40">
                    Select a repository to browse its contents.
                </div>
            )}
        </main>
    )
}
