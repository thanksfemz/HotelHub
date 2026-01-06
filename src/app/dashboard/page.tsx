'use client';

import React, { useEffect, useState } from 'react';
import { Building, Bed, BedDouble, DollarSign } from 'lucide-react';
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

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await reportService.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError('Failed to fetch dashboard statistics. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold mb-4">Welcome, {user?.name}!</h1>
        <Button onClick={fetchStats} disabled={isLoading}>
            {isLoading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 p-4 text-center text-destructive">
          <p>{error}</p>
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
          isLoading={isLoading}
          iconBgColor="bg-sky-500"
        />
        <StatsCard
          title="Occupied Rooms"
          value={stats?.occupiedRooms ?? 0}
          icon={Bed}
          isLoading={isLoading}
          iconBgColor="bg-red-500"
        />
        <StatsCard
          title="Available Rooms"
          value={stats?.availableRooms ?? 0}
          icon={BedDouble}
          isLoading={isLoading}
          iconBgColor="bg-green-500"
        />
        <StatsCard
          title="Today's Revenue"
          value={`$${(stats?.todayRevenue ?? 0).toLocaleString()}`}
          icon={DollarSign}
          isLoading={isLoading}
          iconBgColor="bg-blue-500"
        />
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold">More stats coming soon...</h2>
      </div>
    </div>
  );
}
