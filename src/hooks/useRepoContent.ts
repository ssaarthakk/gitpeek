'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Octokit } from '@octokit/core';
import { Endpoints } from '@octokit/types';

type RepoContent = Endpoints['GET /repos/{owner}/{repo}/contents/{path}']['response']['data'];

export default function useRepoContent(repoFullName: string | null) {
  const { data: session } = useSession();
  const [content, setContent] = useState<RepoContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      if (repoFullName && session?.accessToken) {
        setIsLoading(true);
        const octokit = new Octokit({ auth: session.accessToken });
        
        const [owner, repo] = repoFullName.split('/');

        const response = await octokit.request('GET /repos/{owner}/{repo}/contents', {
          owner,
          repo,
        });

        setContent(response.data);
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [repoFullName, session]);

  return { content, isLoading };
}