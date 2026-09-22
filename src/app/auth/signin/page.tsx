'use client';

import { signIn } from 'next-auth/react';
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckIcon, CrossIcon, GitHubMark } from '@/components/site/icons';
import { Chip, Tile, buttonClass } from '@/components/kit';
import { LogoPill } from '@/components/view/GateShell';

/** Auth.js puts `?error=<code>` on this page when a sign-in fails. */
const AUTH_ERRORS: Record<string, string> = {
  AccessDenied: 'GitHub sign-in was cancelled or access was denied. Try again when you are ready.',
  OAuthSignin: 'We couldn’t start the GitHub sign-in. Please try again.',
  OAuthCallback: 'GitHub sent back a response we couldn’t verify. Please try again.',
  OAuthCallbackError: 'GitHub sent back a response we couldn’t verify. Please try again.',
  OAuthAccountNotLinked: 'That GitHub account is linked to a different sign-in. Use the account you signed in with before.',
  Callback: 'Something went wrong finishing the sign-in. Please try again.',
  Configuration: 'Sign-in is misconfigured on our side. Please try again later.',
  Verification: 'That sign-in link has expired or was already used. Start again below.',
};
const DEFAULT_AUTH_ERROR = 'Sign-in didn’t work. Please try again.';

const SCOPES = [
  {
    yes: true,
    title: 'Your GitHub username, avatar and email',
    desc: 'So the people you share with can see who sent the link.',
  },
  {
    yes: true,
    title: 'Access to your repositories',
    desc: 'GitHub asks for this so GitPeek can list the repositories you can share. Readers of your links can browse files, not change them.',
  },
  {
    yes: false,
    title: 'A copy of your code',
    desc: 'Files are fetched from GitHub when someone opens a link. GitPeek doesn’t keep them.',
  },
];

function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  if (!error) return null;
  return (
    <div role="alert" className="mb-5 rounded-2xl border border-line bg-surface-2 p-3.5">
      <Chip tone="danger" dot>
        Sign-in failed
      </Chip>
      <p className="mt-2 text-[13.5px] leading-normal text-ink-2">{AUTH_ERRORS[error] ?? DEFAULT_AUTH_ERROR}</p>
    </div>
  );
}

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('github');
    } catch (error) {
      console.error('Error signing in:', error);
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-dvh w-full flex-1 flex-col bg-bg p-3">
      <div className="mb-3 flex">
        <LogoPill />
      </div>

      <div className="mx-auto grid w-full max-w-[1080px] flex-1 content-center gap-3 lg:grid-cols-[1.1fr_1fr]">
        {/* left: what signing in means */}
        <Tile tone="accent" className="order-2 flex flex-col lg:order-1" bodyClassName="flex flex-1 flex-col justify-between gap-10 p-6 sm:p-10">
          <div>
            <h1 className="mb-4 text-[30px] font-semibold leading-[1.1] text-white sm:text-[38px]">Sign in with GitHub</h1>
            <p className="mb-8 max-w-[460px] text-[15px] leading-relaxed text-white/80">
              Signing in identifies you. On the next screen you install the GitPeek GitHub App and pick the
              repositories you want to share.
            </p>

            <ul className="flex flex-col gap-2">
              {SCOPES.map((s) => (
                <li key={s.title} className="flex items-start gap-3.5 rounded-2xl bg-white/10 p-4">
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${s.yes ? 'bg-white text-accent' : 'border border-white/50 text-white'}`}
                  >
                    {s.yes ? <CheckIcon className="h-3.5 w-3.5" /> : <CrossIcon className="h-3.5 w-3.5" />}
                    <span className="sr-only">{s.yes ? 'Included:' : 'Not included:'}</span>
                  </span>
                  <div className="min-w-0">
                    <div className="mb-0.5 text-sm font-semibold text-white">{s.title}</div>
                    <p className="text-[13.5px] leading-normal text-white/80">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-xs leading-[1.7] text-white/80">
            You can remove GitPeek from your GitHub settings at any time. Every share link stops working when you do.
          </p>
        </Tile>

        {/* right: the action */}
        <Tile className="order-1 flex flex-col lg:order-2" bodyClassName="flex flex-1 flex-col justify-center p-6 sm:p-10">
          <div className="mx-auto w-full max-w-[380px]">
            <Chip className="mb-5">Step 1 of 2</Chip>
            <h2 className="mb-2 text-[22px] font-semibold leading-tight text-ink sm:text-[26px]">Sign in</h2>
            <p className="mb-6 text-sm leading-relaxed text-ink-3">
              GitHub is the only way in. There is no password to forget.
            </p>

            <Suspense fallback={null}>
              <AuthError />
            </Suspense>

            <button
              type="button"
              onClick={handleSignIn}
              disabled={isLoading}
              aria-busy={isLoading}
              className={buttonClass('primary', 'lg', 'w-full disabled:cursor-wait')}
            >
              {!isLoading && <GitHubMark className="h-4 w-4" />}
              {isLoading ? 'Redirecting to GitHub…' : 'Continue with GitHub'}
            </button>

            {isLoading && (
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
                <div className="h-full w-3/5 animate-pulse rounded-full bg-accent" />
              </div>
            )}

            <div className="hatch mt-6 flex items-start gap-3 rounded-2xl border border-line p-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line-strong bg-surface text-xs font-semibold text-ink-3">
                2
              </span>
              <div className="min-w-0">
                <div className="mb-0.5 text-[13.5px] font-medium text-ink-2">Then install the GitHub App</div>
                <p className="text-[12.5px] leading-normal text-ink-3">
                  Pick exactly which repositories GitPeek can read. You can change it later.
                </p>
              </div>
            </div>

            <p className="mt-6 text-xs leading-[1.7] text-ink-4">
              By continuing you agree to the{' '}
              <Link href="/terms" className="text-ink-3 underline decoration-line-strong underline-offset-2 hover:text-ink">
                terms
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-ink-3 underline decoration-line-strong underline-offset-2 hover:text-ink">
                privacy policy
              </Link>
              .
            </p>
          </div>
        </Tile>
      </div>
    </main>
  );
}
