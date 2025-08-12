'use client';

import useRepos from '@/hooks/useRepo';
import { Select, SelectItem } from "@heroui/select";

type RepoListProps = {
    onRepoSelect: (repoFullName: string) => void;
};

export default function RepoList({ onRepoSelect }: RepoListProps) {
    const { repos, isLoading } = useRepos();

    if (isLoading) {
        return <p>Loading repositories...</p>;
    }

    if (repos.length > 0) {
        return (
            <div>
                <h2 className='font-bold text-xl py-4'>Your Repositories:</h2>
                <Select
                    className="min-w-2xs"
                    label="Select a repository"
                    onChange={(event) => {
                        const value = event.target.value;
                        onRepoSelect(value);
                    }}
                    size='md'
                    labelPlacement='inside'
                >
                    {repos.map((repo) => (
                        <SelectItem key={repo.full_name} >
                            {repo.full_name}
                        </SelectItem>
                    ))}
                </Select>
            </div>
        );
    }

    return null;
}