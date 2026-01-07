import { NextResponse } from 'next/server';
import { subDays, format, eachDayOfInterval, parseISO } from 'date-fns';
import type { OccupancyData, OccupancyReport } from '@/lib/types';
import { rooms } from '@/lib/mock-data-layer';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  if (!startDate || !endDate) {
    return NextResponse.json({ message: 'Missing startDate or endDate' }, { status: 400 });
  }

  const interval = { start: parseISO(startDate), end: parseISO(endDate) };
  const dateRange = eachDayOfInterval(interval);

  const data: OccupancyData[] = dateRange.map((date) => {
    const occupancy = 60 + Math.random() * 25;
    return {
      date: format(date, 'MMM dd'),
      occupancyRate: parseFloat(occupancy.toFixed(1)),
      occupiedRooms: Math.round((occupancy/100) * 150),
      totalRooms: 150,
    };
  });

  const allOccupancies = data.map(d => d.occupancyRate);
  const averageOccupancy = allOccupancies.reduce((a, b) => a + b, 0) / allOccupancies.length;

  const report: OccupancyReport = {
    data,
    averageOccupancy: parseFloat(averageOccupancy.toFixed(1)),
    peakOccupancy: parseFloat(Math.max(...allOccupancies).toFixed(1)),
    lowestOccupancy: parseFloat(Math.min(...allOccupancies).toFixed(1)),
    mostPopularRoomType: rooms[Math.floor(Math.random() * rooms.length)].roomType,
  }

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1200));

  return NextResponse.json(report);
}
