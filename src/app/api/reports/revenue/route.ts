import { NextResponse } from 'next/server';
import { subDays, format, eachDayOfInterval, parseISO } from 'date-fns';
import type { RevenueData, RevenueReport } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  if (!startDate || !endDate) {
    return NextResponse.json({ message: 'Missing startDate or endDate' }, { status: 400 });
  }

  const interval = { start: parseISO(startDate), end: parseISO(endDate) };
  const dateRange = eachDayOfInterval(interval);

  const data: RevenueData[] = dateRange.map((date) => {
    const revenue = 15000 + Math.random() * 10000;
    return {
      date: format(date, 'MMM dd'),
      revenue: Math.round(revenue),
      bookings: Math.round(revenue / 250),
    };
  });

  const totalRevenue = data.reduce((acc, curr) => acc + curr.revenue, 0);

  const report: RevenueReport = {
    data,
    totalRevenue,
    averageRevenue: totalRevenue / data.length,
    paymentMethodBreakdown: [
        { method: 'Card', amount: totalRevenue * 0.6, percentage: 60 },
        { method: 'UPI', amount: totalRevenue * 0.2, percentage: 20 },
        { method: 'Cash', amount: totalRevenue * 0.15, percentage: 15 },
        { method: 'Bank Transfer', amount: totalRevenue * 0.05, percentage: 5 },
    ]
  }

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  return NextResponse.json(report);
}
