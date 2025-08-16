'use client';

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import Reveal from '@/components/animations/Reveal';
import { LockIcon, ClockIcon, EyeIcon, ShieldCheckIcon } from "@primer/octicons-react";

export default function FeaturesSection() {
    const features = [
        {
            title: "Secure & Read-Only",
            description:
                "Your code is never stored on our servers and cannot be modified by viewers. Complete security guaranteed.",
            skeleton: <SkeletonOne />,
            className:
                "col-span-1 lg:col-span-4 border-b lg:border-r dark:border-neutral-800",
        },
        {
            title: "Time-Limited Access",
            description:
                "Control exactly how long your links are active, from one hour to seven days. Perfect for interviews.",
            skeleton: <SkeletonTwo />,
            className: "border-b col-span-1 lg:col-span-2 dark:border-neutral-800",
        },
        {
            title: "View Analytics",
            description:
                "Get notified and see exactly when your shared link has been viewed with detailed analytics.",
            skeleton: <SkeletonThree />,
            className:
                "col-span-1 lg:col-span-3 lg:border-r dark:border-neutral-800",
            comingSoon: true,
        },
        {
            title: "Password Protection",
            description:
                "Add an extra layer of security by requiring a password to view shared repositories.",
            skeleton: <SkeletonFour />,
            className: "col-span-1 lg:col-span-3 border-b lg:border-none",
            comingSoon: true,
        },
    ];

    return (
        <div className="relative z-20 py-10 lg:py-20 max-w-7xl mx-auto">
            <div className="px-8">
                <Reveal>
                    <h4 className="text-3xl md:text-4xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black dark:text-white">
                        Features
                    </h4>

                    <p className="text-sm lg:text-base max-w-2xl my-4 mx-auto text-neutral-500 text-center font-normal dark:text-neutral-300">
                        Everything you need to share private code with confidence and control.
                    </p>
                </Reveal>
            </div>

            <div className="relative">
                <Reveal className="grid grid-cols-1 lg:grid-cols-6 mt-12 xl:border rounded-md dark:border-neutral-800">
                    {features.map((feature, idx) => (
                        <FeatureCard key={idx} className={feature.className} comingSoon={feature.comingSoon}>
                            <FeatureTitle comingSoon={feature.comingSoon}>{feature.title}</FeatureTitle>
                            <FeatureDescription>{feature.description}</FeatureDescription>
                            <div className="h-full w-full">{feature.skeleton}</div>
                        </FeatureCard>
                    ))}
                </Reveal>
            </div>
        </div>
    );
}

const FeatureCard = ({
    children,
    className,
    comingSoon,
}: {
    children?: React.ReactNode;
    className?: string;
    comingSoon?: boolean;
}) => {
    return (
        <div className={cn(`p-4 sm:p-8 relative overflow-hidden`, className)}>
            {comingSoon && (
                <div className="absolute top-6 right-4 z-10">
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded-full border border-yellow-500/30">
                        Coming Soon
                    </span>
                </div>
            )}
            {children}
        </div>
    );
};

const FeatureTitle = ({ children, comingSoon }: { children?: React.ReactNode; comingSoon?: boolean }) => {
    return (
        <p className={cn(
            "max-w-5xl mx-auto text-left tracking-tight text-xl md:text-2xl md:leading-snug",
            comingSoon ? "text-neutral-400 dark:text-neutral-500" : "text-black dark:text-white"
        )}>
            {children}
        </p>
    );
};

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => {
    return (
        <p
            className={cn(
                "text-sm md:text-base max-w-4xl text-left mx-auto",
                "text-neutral-500 font-normal dark:text-neutral-300",
                "text-left max-w-sm mx-0 md:text-sm my-2"
            )}
        >
            {children}
        </p>
    );
};

const SkeletonOne = () => {
    return (
        <div className="relative flex py-8 px-2 gap-10 h-full">
            <div className="w-full p-5 mx-auto bg-white dark:bg-neutral-900 shadow-2xl group h-full">
                <div className="flex flex-1 w-full h-full flex-col space-y-2">
                    {/* Security Badge */}
                    <motion.div
                        className="h-full w-full rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/5 flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        <div className="flex flex-col items-center space-y-2">
                            <LockIcon className="h-12 w-12 text-blue-500" />
                            <span className="text-blue-500 font-semibold">Read-Only Access</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

const SkeletonTwo = () => {
    return (
        <div className="relative flex flex-col items-center p-8 gap-10 h-full overflow-hidden">
            <motion.div
                className="flex flex-col items-center space-y-4"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                <ClockIcon className="h-16 w-16 text-blue-500" />
                <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">1-7</div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">Days</div>
                </div>
            </motion.div>
        </div>
    );
};

const SkeletonThree = () => {
    return (
        <div className="relative flex p-8 gap-10 h-full">
            <div className="w-full mx-auto bg-transparent dark:bg-transparent h-full">
                <motion.div
                    className="flex flex-col items-center justify-center h-full space-y-4"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    <EyeIcon className="h-12 w-12 text-blue-500" />
                    <div className="text-center space-y-2">
                        <div className="flex items-center space-x-2">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            <span className="text-sm text-neutral-500 dark:text-neutral-400">3 views today</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                            <span className="text-sm text-neutral-500 dark:text-neutral-400">Last viewed 2h ago</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

const SkeletonFour = () => {
    return (
        <div className="relative flex flex-col items-center p-8 gap-10 h-full">
            <motion.div
                className="flex flex-col items-center space-y-4"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                <ShieldCheckIcon className="h-16 w-16 text-blue-500" />
                <div className="text-center">
                    <div className="text-sm text-blue-500 font-semibold">Password Protected</div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">••••••••</div>
                </div>
            </motion.div>
        </div>
    );
};
