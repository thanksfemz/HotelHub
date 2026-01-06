import { NextResponse } from 'next/server';

export async function GET() {
  // In a real application, you would fetch this data from your database.
  // Here, we're returning mock data for demonstration purposes.
  const stats = {
    totalRooms: 150,
    occupiedRooms: 112,
    availableRooms: 38,
    todayRevenue: 28000,
    checkInsToday: 15,
    checkOutsToday: 12,
  };

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return NextResponse.json(stats);
}
