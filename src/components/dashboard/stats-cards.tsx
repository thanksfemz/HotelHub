
'use client';
import React, { useEffect, useState } from 'react';
import { Building, Bed, BedDouble, DollarSign, RefreshCw, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/authStore';
import { reportService } from '@/lib/services/reportService';
import { StatsCard } from '@/components/dashboard/stats-card';
import { Button } from '@/components/ui/button';

type DashboardStats = {
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  todayRevenue: number;
};

export function StatsCards() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

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

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div>
        <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">Welcome, {user?.name || user?.username}!</h1>
            <Button onClick={fetchStats} disabled={statsLoading} size="sm" variant="outline">
                <RefreshCw className={`mr-2 h-4 w-4 ${statsLoading ? 'animate-spin' : ''}`} />
                {statsLoading ? 'Refreshing...' : 'Refresh'}
            </Button>
        </div>

      {statsError && (
        <div className="mb-4 flex items-center gap-4 rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="h-5 w-5"/>
          <p>{statsError}</p>
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
    </div>
  );
}
