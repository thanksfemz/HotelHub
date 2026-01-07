
'use client';

import { useQuery } from '@tanstack/react-query';
import { DollarSign, Hourglass, CircleSlash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { paymentService } from '@/lib/services/paymentService';

function StatCard({ title, value, icon: Icon, color, isLoading }: { title: string; value: string; icon: React.ElementType; color: string; isLoading: boolean }) {
    if (isLoading) {
        return (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-5 w-2/4" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-3/4" />
              </CardContent>
            </Card>
        );
    }
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 text-muted-foreground ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

export function PaymentSummary() {
  const { data: summary, isLoading } = useQuery({
    queryKey: ['paymentSummary'],
    queryFn: paymentService.getSummary,
  });

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard
        title="Total Revenue"
        value={summary ? formatCurrency(summary.totalRevenue) : '$0.00'}
        icon={DollarSign}
        color="text-green-500"
        isLoading={isLoading}
      />
      <StatCard
        title="Pending Payments"
        value={summary ? formatCurrency(summary.pendingPayments) : '$0.00'}
        icon={Hourglass}
        color="text-yellow-500"
        isLoading={isLoading}
      />
      <StatCard
        title="Total Refunds"
        value={summary ? formatCurrency(summary.totalRefunds) : '$0.00'}
        icon={CircleSlash}
        color="text-red-500"
        isLoading={isLoading}
      />
    </div>
  );
}
