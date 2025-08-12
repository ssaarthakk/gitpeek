'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Octokit } from '@octokit/core';

export default function useFileContent(repoFullName: string, filePath: string | null) {
  const { data: session } = useSession();
  const [content, setContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setContent(null);

    const fetchFile = async () => {
      if (filePath && repoFullName && session?.accessToken) {
        setIsLoading(true);
        const octokit = new Octokit({ auth: session.accessToken });
        const [owner, repo] = repoFullName.split('/');

        try {
          const { data } = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
            owner,
            repo,
            path: filePath,
          });

          if ('content' in data && 'encoding' in data && data.encoding === 'base64') {
            const decodedContent = atob(data.content);
            setContent(decodedContent);
          }
        } catch (error) {
          console.error("Failed to fetch file content:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchFile();
  }, [filePath, repoFullName, session]);

  return { content, isLoading };
}