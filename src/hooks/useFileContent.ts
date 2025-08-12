'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Octokit } from '@octokit/core';

export default function useFileContent(repoFullName: string, filePath: string | null) {
  const { data: session } = useSession();
  const [content, setContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const cacheRef = useRef<Record<string, string>>({});
  const key = `${repoFullName}::${filePath || ''}`;

  useEffect(() => {
    const fetchFile = async () => {
      if (filePath && repoFullName && session?.accessToken) {
        // Serve from cache if present
        if (cacheRef.current[key]) {
          setContent(cacheRef.current[key]);
          return;
        }
        setIsLoading(true);
        const octokit = new Octokit({ auth: session.accessToken });
        const [owner, repo] = repoFullName.split('/');
        try {
          const { data } = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', { owner, repo, path: filePath });
          if ('content' in data && 'encoding' in data && data.encoding === 'base64') {
            const decodedContent = atob(data.content);
            cacheRef.current[key] = decodedContent;
            setContent(decodedContent);
          }
        } catch (error) {
          console.error('Failed to fetch file content:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchFile();
  }, [filePath, repoFullName, session, key]);

  return { content, isLoading };
}