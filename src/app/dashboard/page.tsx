'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { reportService } from '@/lib/services/reportService';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OccupancyChart } from '@/components/dashboard/occupancy-chart';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import type { OccupancyData, RevenueData } from '@/lib/types';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { RecentBookings } from '@/components/dashboard/recent-bookings';

type TimePeriod = '7' | '30' | '90';

export default function DashboardPage() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('30');
  const [isPending, startTransition] = useTransition();

  const [occupancyData, setOccupancyData] = useState<OccupancyData[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [chartsLoading, setChartsLoading] = useState(true);
  const [chartsError, setChartsError] = useState<string | null>(null);

  const fetchChartData = async (period: TimePeriod) => {
    setChartsLoading(true);
    setChartsError(null);
    try {
      const [occupancy, revenue] = await Promise.all([
        reportService.getOccupancyData(period),
        reportService.getRevenueData(period),
      ]);
      setOccupancyData(occupancy);
      setRevenueData(revenue);
    } catch (err) {
      setChartsError('Failed to load chart data. Please try again.');
    } finally {
      setChartsLoading(false);
    }
  };

  useEffect(() => {
    startTransition(() => {
      fetchChartData(timePeriod);
    });
  }, [timePeriod]);

  return (
    <div className="space-y-8">
      <QuickActions />
      <StatsCards />

      <div className="mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
          <h2 className="text-2xl font-bold">Analytics</h2>
          <Tabs
            defaultValue={timePeriod}
            onValueChange={(value) => setTimePeriod(value as TimePeriod)}
          >
            <TabsList>
              <TabsTrigger value="7" disabled={isPending}>7 Days</TabsTrigger>
              <TabsTrigger value="30" disabled={isPending}>30 Days</TabsTrigger>
              <TabsTrigger value="90" disabled={isPending}>90 Days</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {chartsError && (
          <div className="mb-4 rounded-lg bg-destructive/10 p-4 text-center text-destructive">
            <p>{chartsError}</p>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
            <OccupancyChart data={occupancyData} isLoading={chartsLoading} />
            <RevenueChart data={revenueData} isLoading={chartsLoading} />
        </div>
      </div>

      <RecentBookings />
    </div>
  );
}
