'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Endpoints } from '@octokit/types';
import useOctokit from '@/hooks/useOctokit';

type Repo = Endpoints['GET /user/repos']['response']['data'][number];

export default function useRepos() {
  const { data: session } = useSession();
  const octokit = useOctokit(session?.accessToken);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRepos = async () => {
      if (session?.accessToken) {
        if (!octokit) return;
        try {
          const response = await octokit.request('GET /user/repos', {
            type: 'all',
          });
          setRepos(response.data);
        } catch (error) {
          console.error("Failed to fetch repos:", error);
        } finally {
          setIsLoading(false);
        }
      }

    };

    if (repos.length === 0 && session?.accessToken) {
      fetchRepos();
    }
  }, [session, octokit]);

  return { repos, isLoading };
}