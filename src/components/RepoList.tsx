'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Octokit } from '@octokit/core';
import { Endpoints } from "@octokit/types";
import Link from 'next/link';

type Repo = Endpoints["GET /user/repos"]["response"]["data"][number];

export default function RepoList() {
    const { data: session } = useSession();
    const [repos, setRepos] = useState<Repo[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchRepos = async () => {
            if (session?.accessToken) {
                setIsLoading(true);

                const octokit = new Octokit({ auth: session.accessToken });

                const response = await octokit.request('GET /user/repos', {
                    type: 'all',
                });

                setRepos(response.data);
                setIsLoading(false);
            }
        };

        fetchRepos();
    }, [session]);

    if (isLoading) {
        return <p>Loading repositories...</p>;
    }

    if (session && repos.length > 0) {
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