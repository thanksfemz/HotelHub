import { NextResponse } from 'next/server';
import { subDays, format } from 'date-fns';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get('days') || '7', 10);

  const today = new Date();
  const data = Array.from({ length: days }).map((_, i) => {
    const date = subDays(today, days - 1 - i);
    // Simulate some variance in occupancy
    const occupancy = 60 + Math.random() * 25 - (i % 7);
    return {
      date: format(date, 'MMM dd'),
      occupancy: parseFloat(occupancy.toFixed(1)),
    };
  });

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1200));

  return NextResponse.json(data);
}
