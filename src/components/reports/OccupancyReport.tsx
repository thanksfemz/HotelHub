'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { OccupancyReport } from '@/lib/types';
import { TrendingUp, TrendingDown, Hotel } from 'lucide-react';

interface OccupancyReportProps {
  data?: OccupancyReport;
  isLoading: boolean;
}

function StatCard({ title, value, icon: Icon, unit }: { title: string; value: string | number; icon: React.ElementType, unit?: string }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}{unit}</div>
            </CardContent>
        </Card>
    );
}

export function OccupancyReport({ data, isLoading }: OccupancyReportProps) {
  if (isLoading) {
    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
            </div>
            <Skeleton className="h-96" />
        </div>
    );
  }

  if (!data) return <div className="text-center py-16 text-muted-foreground">No occupancy data available for this period.</div>;

  return (
    <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Avg Occupancy" value={data.averageOccupancy} unit="%" icon={Hotel} />
            <StatCard title="Peak Occupancy" value={data.peakOccupancy} unit="%" icon={TrendingUp} />
            <StatCard title="Lowest Occupancy" value={data.lowestOccupancy} unit="%" icon={TrendingDown} />
            <StatCard title="Most Popular Room" value={data.mostPopularRoomType} icon={Hotel} />
        </div>
      <Card>
        <CardHeader>
          <CardTitle>Occupancy Rate (%)</CardTitle>
          <CardDescription>Percentage of occupied rooms over the selected period.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))' }} fontSize={12} />
                <YAxis unit="%" tick={{ fill: 'hsl(var(--muted-foreground))' }} fontSize={12} />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                    formatter={(value: number) => [`${value}%`, 'Occupancy']}
                />
                <Area type="monotone" dataKey="occupancyRate" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" name="Occupancy Rate" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
