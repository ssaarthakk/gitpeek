'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Octokit } from '@octokit/core';
import { Endpoints } from '@octokit/types';

type Repo = Endpoints['GET /user/repos']['response']['data'][number];

export default function useRepos() {
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

  return { repos, isLoading };
}