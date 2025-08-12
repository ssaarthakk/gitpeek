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
            <Select
                aria-label="Repository selector"
                className="min-w-[280px]"
                placeholder="Select a repository"
                onChange={(event) => {
                    const value = event.target.value;
                    onRepoSelect(value);
                }}
                size='sm'
                labelPlacement='outside'
                variant='flat'
            >
                {repos.map((repo) => (
                    <SelectItem key={repo.full_name} >
                        {repo.full_name}
                    </SelectItem>
                ))}
            </Select>
        );
    }

    return null;
}