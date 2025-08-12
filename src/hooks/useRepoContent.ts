'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Octokit } from '@octokit/core';
import { Endpoints } from '@octokit/types';

type RepoContent = Endpoints['GET /repos/{owner}/{repo}/contents/{path}']['response']['data'];

export default function useRepoContent(repoFullName: string | null, path: string = '') {
  const { data: session } = useSession();
  const [content, setContent] = useState<RepoContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cacheRef = useRef<Record<string, RepoContent>>({});
  const key = `${repoFullName || ''}::${path}`;

  useEffect(() => {
    const fetchContent = async () => {
      if (!repoFullName || !session?.accessToken) return;
      // If cached, use it and skip loading flicker
      if (cacheRef.current[key]) {
        setContent(cacheRef.current[key]);
        return;
      }
      try {
        setIsLoading(true);
        setError(null);
        const octokit = new Octokit({ auth: session.accessToken });
        const [owner, repo] = repoFullName.split('/');
        const endpoint = path ? 'GET /repos/{owner}/{repo}/contents/{path}' : 'GET /repos/{owner}/{repo}/contents';
        const params: any = { owner, repo };
        if (path) params.path = path;
        const response = await octokit.request(endpoint as any, params);
        cacheRef.current[key] = response.data;
        setContent(response.data);
      } catch (e: any) {
        setError(e?.message || 'Failed to load content');
        setContent(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [repoFullName, path, session, key]);

  return { content, isLoading, error };
}