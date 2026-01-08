
'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { subDays } from 'date-fns';
import { useAuthStore } from '@/lib/stores/authStore';
import { useRouter } from 'next/navigation';

import { reportService } from '@/lib/services/reportService';
import type { OccupancyReport, RevenueReport } from '@/lib/types';
import { DateRangePicker } from '@/components/reports/DateRangePicker';
import { OccupancyReport as OccupancyReportComponent } from '@/components/reports/OccupancyReport';
import { RevenueReport as RevenueReportComponent } from '@/components/reports/RevenueReport';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExportOptions } from '@/components/reports/ExportOptions';

export default function ReportsPage() {
    const { user } = useAuthStore();
    const router = useRouter();
    const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({ from: subDays(new Date(), 29), to: new Date() });
    
    // Role-based access control
    React.useEffect(() => {
        if (user && !['ADMIN', 'MANAGER'].includes(user.role)) {
            toast.error("You don't have permission to view this page.");
            router.push('/dashboard');
        }
    }, [user, router]);

    const { data: occupancyReport, isLoading: isLoadingOccupancy } = useQuery<OccupancyReport>({
        queryKey: ['occupancyReport', dateRange],
        queryFn: () => reportService.getOccupancyReport(dateRange.from, dateRange.to),
    });

    const { data: revenueReport, isLoading: isLoadingRevenue } = useQuery<RevenueReport>({
        queryKey: ['revenueReport', dateRange],
        queryFn: () => reportService.getRevenueReport(dateRange.from, dateRange.to),
    });

    if (user && !['ADMIN', 'MANAGER'].includes(user.role)) {
        return <div className="text-center py-16">Access Denied.</div>;
    }

    return (
        <div className="container mx-auto py-8 space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold font-headline text-primary">Analytics & Reports</h1>
                <DateRangePicker onDateChange={(range) => setDateRange(range)} initialRange={dateRange} />
            </div>

            <Tabs defaultValue="occupancy">
                <div className="flex justify-between items-end">
                    <TabsList>
                        <TabsTrigger value="occupancy">Occupancy</TabsTrigger>
                        <TabsTrigger value="revenue">Revenue</TabsTrigger>
                        <TabsTrigger value="guests" disabled>Guests</TabsTrigger>
                    </TabsList>
                    <ExportOptions data={{occupancyReport, revenueReport}} />
                </div>
                <TabsContent value="occupancy" className="mt-4">
                   <OccupancyReportComponent data={occupancyReport} isLoading={isLoadingOccupancy} />
                </TabsContent>
                <TabsContent value="revenue" className="mt-4">
                    <RevenueReportComponent data={revenueReport} isLoading={isLoadingRevenue} />
                </TabsContent>
                <TabsContent value="guests" className="mt-4">
                    <Card>
                        <CardHeader><CardTitle>Guest Analytics</CardTitle></CardHeader>
                        <CardContent><p>Guest analytics coming soon.</p></CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
