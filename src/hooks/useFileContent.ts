'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import useOctokit from '@/hooks/useOctokit';

type FileContentResult = {
  content: string | null; // decoded (utf-8) text when applicable
  raw: string | null; // original base64 (without data URI prefix)
  isLoading: boolean;
};

export default function useFileContent(repoFullName: string, filePath: string | null, providedToken?: string): FileContentResult {
  const { data: session } = useSession();
  const octokit = useOctokit(providedToken || session?.accessToken);
  const [content, setContent] = useState<string | null>(null);
  const [raw, setRaw] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const cacheRef = useRef<Record<string, { decoded: string; raw: string }>>({});
  const key = `${repoFullName}::${filePath || ''}`;

  useEffect(() => {
    const fetchFile = async () => {
      const accessToken = providedToken || session?.accessToken;
      if (filePath && repoFullName && accessToken) {
        // Serve from cache if present
        if (cacheRef.current[key]) {
          setContent(cacheRef.current[key].decoded);
          setRaw(cacheRef.current[key].raw);
          return;
        }
        if (!octokit) return;
        setIsLoading(true);
        const [owner, repo] = repoFullName.split('/');
        try {
          const { data } = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', { owner, repo, path: filePath });
          if ('content' in data && 'encoding' in data && data.encoding === 'base64') {
            const rawBase64 = data.content.replace(/\n/g, '');
            let decodedContent = '';
            try {
              decodedContent = atob(rawBase64);
            } catch {
              decodedContent = '';
            }
            cacheRef.current[key] = { decoded: decodedContent, raw: rawBase64 };
            setContent(decodedContent);
            setRaw(rawBase64);
          }
        } catch (error) {
          console.error('Failed to fetch file content:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchFile();
  }, [filePath, repoFullName, session, key, octokit]);

  return { content, raw, isLoading };
}