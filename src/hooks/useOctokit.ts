'use client';

import { Octokit } from '@octokit/core';
import api from '@/lib/api';
import { useMemo } from 'react';

export default function useOctokit(providedToken?: string) {
  const accessToken = providedToken;

  const octokit = useMemo(() => {

    if (!accessToken) {
      return null;
    }

    return new Octokit({
      auth: accessToken,
      request: {
        fetch: async (url: RequestInfo | URL, options: RequestInit) => {
          return api({
            url: url.toString(),
            method: options.method,
            headers: options.headers as any,
            data: options.body,
          }).then(res => {
            const responseBody = JSON.stringify(res.data);
            const responseHeaders = new Headers(res.headers as any);
            const response = new Response(responseBody, {
              status: res.status,
              statusText: res.statusText,
              headers: responseHeaders,
            });
            return response;
          });
        }
      }
    });
  }, [accessToken]);

  return octokit;
}