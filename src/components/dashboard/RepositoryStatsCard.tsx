'use client';
import { Card, CardHeader, CardBody } from '@heroui/react';

type RepositoryStatsCardProps = {
    reposLoading: boolean;
    totalRepos: number;
};

export default function RepositoryStatsCard({ reposLoading, totalRepos }: RepositoryStatsCardProps) {
    return (
        <Card className="bg-white/5 border border-white/10">
            <CardHeader className="pb-3">
                <h3 className="text-lg font-semibold text-white">Total Repositories</h3>
            </CardHeader>
            <CardBody className="pt-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-green-400">
                    {reposLoading ? '-' : totalRepos}
                </span>
            </CardBody>
        </Card>
    );
}
