'use client';

import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DollarSign, LineChart, Banknote } from 'lucide-react';
import type { RevenueReport } from '@/lib/types';

interface RevenueReportProps {
  data?: RevenueReport;
  isLoading: boolean;
}

const COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)'];

function StatCard({ title, value, icon: Icon }: { title: string; value: string | number; icon: React.ElementType }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    );
}

export function RevenueReport({ data, isLoading }: RevenueReportProps) {
  if (isLoading) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <Skeleton className="h-28" />
                    <Skeleton className="h-28" />
                </div>
                <Skeleton className="h-96" />
            </div>
            <div className="space-y-6">
                 <Skeleton className="h-full" />
            </div>
        </div>
    )
  }

  if (!data) return <div className="text-center py-16 text-muted-foreground">No revenue data available for this period.</div>;
  
  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <StatCard title="Total Revenue" value={formatCurrency(data.totalRevenue)} icon={DollarSign} />
                <StatCard title="Avg. Daily Revenue" value={formatCurrency(Math.round(data.averageRevenue))} icon={LineChart} />
            </div>
            <Card>
                <CardHeader>
                <CardTitle>Daily Revenue</CardTitle>
                <CardDescription>Revenue generated each day over the selected period.</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px] w-full">
                    <ResponsiveContainer>
                        <BarChart data={data.data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))' }} fontSize={12} />
                            <YAxis tickFormatter={(value) => `$${Number(value) / 1000}k`} tick={{ fill: 'hsl(var(--muted-foreground))' }} fontSize={12} />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'hsl(var(--background))', border: 'hsl(var(--border))' }}
                                labelStyle={{ color: 'hsl(var(--foreground))' }}
                                formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                            />
                            <Bar dataKey="revenue" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Breakdown of revenue by payment method.</CardDescription>
            </CardHeader>
            <CardContent className="h-[450px] w-full flex flex-col">
                <ResponsiveContainer>
                    <PieChart>
                        <Pie data={data.paymentMethodBreakdown} dataKey="amount" nameKey="method" cx="50%" cy="50%" outerRadius={120} labelLine={false} label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                            const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                            const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                            return <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">{(percent * 100).toFixed(0)}%</text>;
                        }}>
                            {data.paymentMethodBreakdown.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={`hsl(${COLORS[index % COLORS.length]})`} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    </PieChart>
                </ResponsiveContainer>
                 <div className="flex-1 mt-4">
                    {data.paymentMethodBreakdown.map((entry, index) => (
                        <div key={entry.method} className="flex items-center justify-between text-sm py-1">
                            <div className="flex items-center gap-2">
                                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: `hsl(${COLORS[index % COLORS.length]})` }} />
                                <span>{entry.method}</span>
                            </div>
                            <span className="font-medium">{formatCurrency(entry.amount)}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
