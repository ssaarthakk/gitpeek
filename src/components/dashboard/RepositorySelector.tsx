'use client';
import { 
    Card, 
    CardHeader, 
    CardBody, 
    Input, 
    Button, 
    Listbox, 
    ListboxItem, 
    Chip, 
    Skeleton, 
    Spacer 
} from '@heroui/react';
import { Session } from 'next-auth';
import { Endpoints } from '@octokit/types';

type Repository = Endpoints['GET /user/repos']['response']['data'][number];

type RepositorySelectorProps = {
    session: Session;
    repos: Repository[];
    reposLoading: boolean;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedRepo: string;
    setSelectedRepo: (repo: string) => void;
    onCreateShareLink: () => void;
};

export default function RepositorySelector({
    session,
    repos,
    reposLoading,
    searchQuery,
    setSearchQuery,
    selectedRepo,
    setSelectedRepo,
    onCreateShareLink
}: RepositorySelectorProps) {
    const filteredRepos = repos.filter(repo =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Card className="bg-white/5 border border-white/10">
            <CardHeader>
                <h3 className="text-xl font-semibold text-white">Your Repositories</h3>
            </CardHeader>
            <CardBody className="space-y-4">
                <Input
                    placeholder="Search repositories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    startContent={
                        <svg className="h-4 w-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    }
                    classNames={{
                        input: "text-white",
                        inputWrapper: "bg-white/10 border-white/20"
                    }}
                />

                {reposLoading ? (
                    <div className="space-y-2">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-16 w-full rounded-lg" />
                        ))}
                    </div>
                ) : (
                    <div className="max-h-96 overflow-y-auto">
                        <Listbox
                            aria-label="Repository selection"
                            selectionMode="single"
                            selectedKeys={selectedRepo ? [selectedRepo] : []}
                            onSelectionChange={(keys) => {
                                const selected = Array.from(keys)[0] as string;
                                setSelectedRepo(selected);
                            }}
                            classNames={{
                                base: "max-w-none",
                            }}
                        >
                            {filteredRepos.map((repo) => (
                                <ListboxItem
                                    key={repo.full_name}
                                    textValue={repo.full_name}
                                    className="text-white/90 hover:bg-white/10 max-w-[98%]"
                                >
                                    <div className="flex items-center gap-3 w-full min-w-0 pr-2">
                                        <div className="h-8 w-8 rounded-md bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                                            <svg className="h-4 w-4 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                            </svg>
                                        </div>
                                        <div className={`flex flex-col min-w-0 overflow-hidden ${repo.private ? 'max-w-[calc(100%-120px)]' : 'max-w-[calc(100%-60px)]'}`}>
                                            <p className="font-medium text-white truncate">{repo.name}</p>
                                            <div className="text-sm text-white/50 truncate max-w-md">{repo.description || 'No description'}</div>
                                        </div>
                                        {repo.private && (
                                            <Chip
                                                size="sm"
                                                variant="flat"
                                                color="warning"
                                                className="absolute right-8 top-1/2 transform -translate-y-1/2"
                                            >
                                                Private
                                            </Chip>
                                        )}
                                    </div>
                                </ListboxItem>
                            ))}
                        </Listbox>
                    </div>
                )}

                <Spacer y={2} />

                <Button
                    color="primary"
                    size="lg"
                    onPress={onCreateShareLink}
                    isDisabled={!selectedRepo || (session.user?.credits || 0) <= 0}
                    className="w-full"
                >
                    Create Share Link ({session.user?.credits || 0} credits)
                </Button>
            </CardBody>
        </Card>
    );
}
