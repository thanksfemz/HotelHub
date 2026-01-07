import { NextResponse } from 'next/server';
import { rooms as mockRooms } from '@/lib/mock-data-layer';

// In a real app, you would check bookings to determine availability
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');

  // For this mock, we'll just return a random subset of available rooms
  // ignoring the dates.
  const availableRooms = mockRooms.filter(room => room.status === 'Available');
  const randomSubset = availableRooms.sort(() => 0.5 - Math.random()).slice(0, 10);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return NextResponse.json(randomSubset);
}
