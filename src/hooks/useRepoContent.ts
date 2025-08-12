'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Octokit } from '@octokit/core';
import { Endpoints } from '@octokit/types';

type RepoContent = Endpoints['GET /repos/{owner}/{repo}/contents/{path}']['response']['data'];

export default function useRepoContent(repoFullName: string | null, path: string = '') {
  const { data: session } = useSession();
  const [content, setContent] = useState<RepoContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      if (!repoFullName || !session?.accessToken) return;
      try {
        setIsLoading(true);
        setError(null);
        const octokit = new Octokit({ auth: session.accessToken });
        const [owner, repo] = repoFullName.split('/');
        const endpoint = path ? 'GET /repos/{owner}/{repo}/contents/{path}' : 'GET /repos/{owner}/{repo}/contents';
        const params: any = { owner, repo };
        if (path) params.path = path;
        const response = await octokit.request(endpoint as any, params);
        setContent(response.data);
      } catch (e: any) {
        setError(e?.message || 'Failed to load content');
        setContent(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [repoFullName, path, session]);

  return { content, isLoading, error };
}