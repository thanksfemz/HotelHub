import { NextResponse } from 'next/server';
import { subDays, format } from 'date-fns';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get('days') || '7', 10);

  const today = new Date();
  const data = Array.from({ length: days }).map((_, i) => {
    const date = subDays(today, days - 1 - i);
    // Simulate some variance in revenue
    const revenue = 15000 + Math.random() * 10000;
    return {
      date: format(date, 'MMM dd'),
      revenue: Math.round(revenue),
    };
  });

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  return NextResponse.json(data);
}
