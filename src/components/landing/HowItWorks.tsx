'use client';

import { Card, CardBody, Button } from '@heroui/react';
import Reveal from '@/components/animations/Reveal';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MarkGithubIcon, RepoIcon, LinkIcon } from '@primer/octicons-react';

const steps = [
    { title: 'Connect GitHub', desc: 'Securely sign in with your GitHub account in seconds.' },
    { title: 'Choose Repo', desc: 'Select any private repository and choose an expiration.' },
    { title: 'Generate Link', desc: 'Instantly create a secure, read-only link to share.' },
];

export default function HowItWorks() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

    // Interaction state/refs
    const c1BtnRef = useRef<HTMLButtonElement | null>(null);
    const [signInLoading, setSignInLoading] = useState(false);

    const [selectedRepo, setSelectedRepo] = useState(1); // 0..2

    const c3CopyBtnRef = useRef<HTMLButtonElement | null>(null);
    const c3GlowRef = useRef<HTMLDivElement | null>(null);
    const [copied, setCopied] = useState(false);
    const manualCopyUntilRef = useRef(0);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const [c1, c2, c3] = cardsRef.current;
        if (!c1 || !c2 || !c3 || !containerRef.current) return;

        // Respect reduced motion
        if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            gsap.set([c1, c2, c3], { clearProps: 'all', opacity: 1, x: 0, scale: 1 });
            if (c3GlowRef.current) gsap.set(c3GlowRef.current, { opacity: 0 });
            setSignInLoading(false);
            setSelectedRepo(1);
            setCopied(false);
            return;
        }

        // Initial states (avoid expensive filters/shadows)
        gsap.set(c1, { opacity: 0, x: -40 });
        gsap.set(c2, { opacity: 0, scale: 0.95 });
        gsap.set(c3, { opacity: 0 });
        if (c3GlowRef.current) gsap.set(c3GlowRef.current, { opacity: 0 });

        // Build timeline that plays when scrolled into view (simultaneous reveal)
        const tl = gsap.timeline({ paused: true });
        tl.add('reveal');

        // Reveal all three cards together (slower reveals)
        tl.to(c1, { opacity: 1, x: 0, duration: 2, ease: 'power3.out' }, 'reveal')
          .to(c2, { opacity: 1, scale: 1, duration: 2, ease: 'back.out(1.2)' }, 'reveal')
          .to(c3, { opacity: 1, duration: 2, ease: 'power2.out' }, 'reveal')

          // Micro interactions with tiny offsets so it feels alive
          .call(() => setSignInLoading(true), undefined, 'reveal+=0.02')
          .to(c1BtnRef.current, { scale: 0.96, duration: 0.12, ease: 'power1.inOut', yoyo: true, repeat: 1 }, 'reveal+=0.02')
          .to({}, { duration: 0.5 })
          .call(() => setSignInLoading(false))

          .call(() => setSelectedRepo(2), undefined, 'reveal+=0.18')
          .to({}, { duration: 0.2 })
          .call(() => setSelectedRepo(1))

          .to(c3GlowRef.current, { opacity: 1, duration: 0.3, ease: 'sine.inOut', yoyo: true, repeat: 1 }, 'reveal+=0.22')
          .to(c3CopyBtnRef.current, { scale: 0.96, duration: 0.1, ease: 'power1.inOut', yoyo: true, repeat: 1 }, 'reveal+=0.24')
          .call(() => setCopied(true), undefined, 'reveal+=0.24')
          .to({}, { duration: 1.0 })
          .call(() => setCopied(false));

        // Primary trigger: play/reverse based on viewport
        const st = ScrollTrigger.create({
            trigger: containerRef.current,
            start: 'top 70%',
            onEnter: () => tl.play(0),
            onLeaveBack: () => tl.reverse(),
        });

        tl.eventCallback('onReverseComplete', () => {
            setSignInLoading(false);
            setSelectedRepo(1);
            setCopied(false);
            if (c3GlowRef.current) gsap.set(c3GlowRef.current, { opacity: 0 });
        });

        return () => {
            st.kill();
            tl.kill();
        };
    }, []);

    return (
        <div ref={containerRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-semibold text-white">How It Works</h2>
                    <p className="mt-2 text-white/70">A quick animated walkthrough of the flow.</p>
                </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                {steps.map((s, i) => (
                    <div
                        key={s.title}
                        ref={(el) => {
                            cardsRef.current[i] = el;
                        }}
                        className="h-full relative"
                        style={{ willChange: 'transform, opacity' }}
                    >
                        {/* Soft glow overlay for step 3 only (animated via opacity) */}
                        {i === 2 && (
                            <div
                                ref={c3GlowRef}
                                className="pointer-events-none absolute -inset-3 rounded-2xl bg-cyan-400/20 blur-2xl opacity-0"
                                aria-hidden="true"
                            />
                        )}

                        <Card className="relative z-10 h-full bg-white/5 border border-white/10">
                            <CardBody className="h-full flex flex-col">
                                <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/20 text-primary font-semibold">
                                        {i + 1}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">{s.title}</h3>
                                        <p className="mt-1 text-sm text-white/70">{s.desc}</p>
                                    </div>
                                </div>

                                {/* Visual cue area */}
                                <div className="mt-5 flex-1">
                                    {i === 0 && (
                                        <div className="h-full flex items-center justify-center">
                                            <Button
                                                ref={c1BtnRef}
                                                // startContent={<MarkGithubIcon size={20} />}
                                                variant="flat"
                                                size="lg"
                                                className="bg-white/10 text-white px-6 md:px-8 text-base md:text-lg"
                                                isLoading={signInLoading}
                                            >
                                                <MarkGithubIcon size={20} />
                                                Sign in with GitHub
                                            </Button>
                                        </div>
                                    )}

                                    {i === 1 && (
                                        <div className="space-y-2">
                                            <div
                                                className={
                                                    `flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 ` +
                                                    `${selectedRepo === 0 ? 'bg-white/10 ring-2 ring-primary/60' : 'bg-white/5'}`
                                                }
                                            >
                                                <span className={`inline-block h-3 w-3 rounded-full ${selectedRepo === 0 ? 'bg-primary' : 'border border-white/40'}`} />
                                                <RepoIcon size={16} className="text-white/70" />
                                                <span className="text-sm text-white/80 truncate">ssaarthakk/marketing-site</span>
                                            </div>
                                            <div
                                                className={
                                                    `flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 ` +
                                                    `${selectedRepo === 1 ? 'bg-white/10 ring-2 ring-primary/60' : 'bg-white/5'}`
                                                }
                                            >
                                                <span className={`inline-block h-3 w-3 rounded-full ${selectedRepo === 1 ? 'bg-primary' : 'border border-white/40'}`} />
                                                <RepoIcon size={16} className="text-white/70" />
                                                <span className="text-sm text-white truncate">ssaarthakk/gitpeek</span>
                                            </div>
                                            <div
                                                className={
                                                    `flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 ` +
                                                    `${selectedRepo === 2 ? 'bg-white/10 ring-2 ring-primary/60' : 'bg-white/5'}`
                                                }
                                            >
                                                <span className={`inline-block h-3 w-3 rounded-full ${selectedRepo === 2 ? 'bg-primary' : 'border border-white/40'}`} />
                                                <RepoIcon size={16} className="text-white/70" />
                                                <span className="text-sm text-white/80 truncate">ssaarthakk/admin</span>
                                            </div>
                                        </div>
                                    )}

                                    {i === 2 && (
                                        <div className="h-full flex items-center justify-center">
                                            <div className="flex items-center gap-2 rounded-md border border-white/10 bg-black/40 px-2 py-1">
                                                <LinkIcon size={16} className="text-white/70" />
                                                <span className="font-mono text-xs text-white/80 truncate">https://gitpeek.tech/view/7Yx3aK</span>
                                                <Button
                                                    ref={c3CopyBtnRef}
                                                    size="sm"
                                                    variant="bordered"
                                                    className="ml-auto"
                                                    onClick={() => {
                                                        // simulate copy only; give manual override window
                                                        manualCopyUntilRef.current = Date.now() + 1200;
                                                        setCopied(true);
                                                        setTimeout(() => setCopied(false), 1200);
                                                    }}
                                                >
                                                    Copy
                                                </Button>
                                                {copied && (
                                                    <span className="ml-2 text-xs text-emerald-400" aria-live="polite">Copied</span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
}
