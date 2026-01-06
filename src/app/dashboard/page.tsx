'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { Building, Bed, BedDouble, DollarSign } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/authStore';
import { reportService } from '@/lib/services/reportService';
import { StatsCard } from '@/components/dashboard/stats-card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OccupancyChart } from '@/components/dashboard/occupancy-chart';
import { RevenueChart } from '@/components/dashboard/revenue-chart';
import type { OccupancyData, RevenueData } from '@/lib/types';

type DashboardStats = {
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  todayRevenue: number;
};

type TimePeriod = '7' | '30' | '90';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  const [timePeriod, setTimePeriod] = useState<TimePeriod>('30');
  const [isPending, startTransition] = useTransition();

  const [occupancyData, setOccupancyData] = useState<OccupancyData[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [chartsLoading, setChartsLoading] = useState(true);
  const [chartsError, setChartsError] = useState<string | null>(null);

  const fetchStats = async () => {
    setStatsLoading(true);
    setStatsError(null);
    try {
      const data = await reportService.getDashboardStats();
      setStats(data);
    } catch (err) {
      setStatsError('Failed to fetch dashboard statistics. Please try again.');
    } finally {
      setStatsLoading(false);
    }
  };

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
    fetchStats();
  }, []);

  useEffect(() => {
    startTransition(() => {
      fetchChartData(timePeriod);
    });
  }, [timePeriod]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold mb-4">Welcome, {user?.name}!</h1>
        <Button onClick={fetchStats} disabled={statsLoading}>
            {statsLoading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {statsError && (
        <div className="mb-4 rounded-lg bg-destructive/10 p-4 text-center text-destructive">
          <p>{statsError}</p>
          <Button variant="link" onClick={fetchStats} className="text-destructive">
            Click to retry
          </Button>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Rooms"
          value={stats?.totalRooms ?? 0}
          icon={Building}
          isLoading={statsLoading}
          iconBgColor="bg-sky-500"
        />
        <StatsCard
          title="Occupied Rooms"
          value={stats?.occupiedRooms ?? 0}
          icon={Bed}
          isLoading={statsLoading}
          iconBgColor="bg-red-500"
        />
        <StatsCard
          title="Available Rooms"
          value={stats?.availableRooms ?? 0}
          icon={BedDouble}
          isLoading={statsLoading}
          iconBgColor="bg-green-500"
        />
        <StatsCard
          title="Today's Revenue"
          value={`$${(stats?.todayRevenue ?? 0).toLocaleString()}`}
          icon={DollarSign}
          isLoading={statsLoading}
          iconBgColor="bg-blue-500"
        />
      </div>

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
    </div>
  );
}
