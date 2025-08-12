'use client';

import Link from 'next/link';
import useRepos from '@/hooks/useRepo';

export default function RepoList() {
    const { repos, isLoading } = useRepos();

    if (isLoading) {
        return <p>Loading repositories...</p>;
    }

    if (repos.length > 0) {
        return (
            <div>
                <h2 className='font-bold text-xl py-4'>Your Repositories:</h2>
                <ul className='flex flex-col font-medium text-lg gap-2'>
                    {repos.map((repo) => (
                        <li key={repo.id} className='text-blue-500 hover:underline'>
                            <Link href={`https://github.com/${repo.full_name}`} target='_blank'>{repo.name}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    return null;
}